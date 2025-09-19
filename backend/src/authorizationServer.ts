import express, { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import { pool } from './mysqlConnection.js'
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import 'dotenv/config.js';
import cors from "cors";

// REMOVE ALL KEY VALUE PAIR EXCEPT 'UserName'
type User = {
    Id: number;
    Hash: string;
}

interface CustomJwtPayload extends jwt.JwtPayload {
    sub: string;
}

type UserPayload = {
    sub: number;
}


// remember: Every line of code is a potential vulnerability

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // middleware that converst JSON from request to JavaScript object
app.use(cookieParser());


let refreshTokens: string[] = [] // this is a bad idea, store this to a database or a redis cache later

app.delete("/logout", (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.clearCookie('jwt_access_token', accessToken, { httpOnly: true, sameSite: 'strict' });
    res.clearCookie('jwt_refresh_token', accessToken, { httpOnly: true, sameSite: 'strict' });
    res.sendStatus(204);
})

app.post("/token", (req, res) => { // for handling the request token from the client to request for new refresh and access tokens

    // const refreshToken: string = req.cookies.jwt_refresh_token; 
    const refreshToken: string = req.body.token;

    if (refreshToken === null) {
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }

    // FIX THIS DOGSHIT CODE
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return res.status(403);
        }
        if (decode === undefined) {
            return;
        }

        const accessToken = generateAccessToken({ sub: decode.sub }); 
        res.json({ accessToken: accessToken });

    })
});

app.post("/login", async (req, res) => {
    const query = 'SELECT Id, Hash FROM Users WHERE UserName = ? OR Email = ? ;';
    const [ results ] = await pool.query(query, [req.body.userName, req.body.email]); // find the user's hashed password
    const data: User[] = JSON.parse(JSON.stringify(results));
   
    const passwordInput = req.body.password;
    
    
    
    if (data.length === 0 || data[0] === undefined) {
        res.status(404);
        res.send("User not found");
        return;
    }
    try {
        const passwordDB = data[0].Hash;
        if ( await bcrypt.compare(passwordInput, passwordDB) ) {

            const user = { sub: data[0].Id } // jwt user payload
            const accessToken = generateAccessToken<UserPayload>(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
            refreshTokens.push(refreshToken);

            // we need the 'secure' attribute set to 'true' to only use the cookies with HTTPS only
            res.cookie('jwt_access_token', accessToken, { httpOnly: true, sameSite: 'strict' }); // the sameSite attribute prevents CSRF attacks (it will only send the cookie if it originated from the same site)
            res.cookie('jwt_refresh_token', refreshToken, { httpOnly: true, sameSite: 'strict' });
            res.json({ success: "true" });
        } else {
            res.send("Wrong password. Try again.");
        }
    } catch (err) {
        res.status(500);
    }
})



function generateAccessToken<T extends object>(user: T) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });  
}

app.listen(4000, () => {
    console.log("Server is running in localhost:4000");
})
