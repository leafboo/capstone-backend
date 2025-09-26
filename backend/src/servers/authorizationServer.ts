import express, { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import { pool } from '../mysqlConnection.js'
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import 'dotenv/config.js';
import cors from "cors";

type User = {
    Id: number;
    Hash: string;
}

type UserPayload = {
    sub: number;
}


// remember: Every line of code is a potential vulnerability

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // middleware that converst JSON from request to JavaScript object
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Welcome to the auth api")
})

app.delete("/logout", (req, res) => {
    
    res.clearCookie('jwt_access_token', { httpOnly: true, sameSite: 'strict' });
    res.clearCookie('jwt_refresh_token', { httpOnly: true, sameSite: 'strict' });
    res.sendStatus(204);
})

app.post("/token", (req, res) => { 

    const refreshToken: string = req.cookies.jwt_refresh_token;

    if (refreshToken === null) {
        return res.status(403).send("There is no refresh token provided");
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Refresh token expired");
            }
            return res.status(403).send("Refresh token invalid");
        }
        if (decode === undefined) {
            return res.status(403).send("There is no payload found in the refresh token");
        }

        const accessToken = generateAccessToken({ sub: decode.sub }); 
        res.cookie('jwt_access_token', accessToken, { httpOnly: true, sameSite: 'strict' });
        res.status(200).send("New access token successfully created");

    })
});

app.post("/login", async (req, res) => {
    const query = 'SELECT Id, Hash FROM Users WHERE UserName = ? OR Email = ? ;';
    const [ results ] = await pool.query(query, [req.body.userName, req.body.email]); // find the user's hashed password
    const usersFound: User[] = JSON.parse(JSON.stringify(results));
   
    const passwordInput = req.body.password;
    
    
    if (usersFound.length === 0 || usersFound[0] === undefined) {
        return res.status(404).send("User not found");
    }

    try {
        const passwordDB = usersFound[0].Hash;
        if ( await bcrypt.compare(passwordInput, passwordDB) ) {

            const user = { sub: usersFound[0].Id } // jwt user payload
            const accessToken = generateAccessToken<UserPayload>(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            // we need the 'secure' attribute set to 'true' to only use the cookies with HTTPS only
            res.cookie('jwt_access_token', accessToken, { httpOnly: true, sameSite: 'strict' }); // the sameSite attribute prevents CSRF attacks (it will only send the cookie if it originated from the same site)
            res.cookie('jwt_refresh_token', refreshToken, { httpOnly: true, sameSite: 'strict' });
            res.status(200).send("Successfully logged in");
        } else {
            res.status(401).send("Wrong password. Try again.");
        }
    } catch (err) {
        res.sendStatus(500);
    }
})



function generateAccessToken<T extends object>(user: T) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });  
}

app.listen(4000, () => {
    console.log("Server is running in localhost:4000");
})
