import express, { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import { pool } from './mysqlConnection.js'
import jwt from 'jsonwebtoken';
import 'dotenv/config.js';


type User = {
    Id: number;
    UserName: string;
    Email: string;
    Salt: string;
    Hash: string;
}


// remember: Every line of code is a potential vulnerability

const app = express();

app.use(express.json()); // middleware that converst JSON from request to JavaScript object


app.post("/users/login", async (req, res) => {
    const query = 'SELECT * FROM Users WHERE UserName = ? OR Email = ? ;';
    const [ results ] = await pool.query(query, [req.body.userName, req.body.email]); // select the user first 
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

            const user = data[0]; // payload
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            res.json({ accessToken: accessToken, refreshToken: refreshToken });
            res.send("Successfully logged in")
        } else {
            res.send("Wrong password. Try again.")
        }
    } catch (err) {
        res.status(500);
    }
    // console.log(rows?[0].Hash);
})

function generateAccessToken(user: User) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' }); // set the expiresIn to 15m later 
}

app.listen(4000, () => {
    console.log("Server is running in localhost:4000");
})