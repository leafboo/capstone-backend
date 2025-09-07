import express, { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import { pool } from './mysqlConnection.js'
import jwt from 'jsonwebtoken';
import 'dotenv/config.js';


// remember: Every line of code is a vulnerability

const app = express();

app.use(express.json()); // middleware that converst JSON from request to JavaScript object

app.get("/", (req, res) => {
    res.status(200);
    res.send("Welcome to the authentication API");
});

app.get("/users", authenticateToken, (req, res) => {
    const user = res.locals.user;

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(403).json({message: "Access denied"})
    }
    
})

app.post("/users", async (req, res) => {

    if (!req.body.password) {
        return res.send("body should contain password and should not be empty");
        
    }
    
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const query = 'INSERT INTO Users(UserName, Email, Salt, Hash) VALUES(?, ?, ?, ?);'
        const result = await pool.query(query, [req.body.userName, req.body.email, salt, hashedPassword]);
        res.status(201);
        res.send(result);
    } catch (err) {
        console.error(err)
        res.status(500);
    }
});



function authenticateToken(req: Request, res: Response, next: NextFunction)  {
    
    if (!req.headers.authorization || !req.headers) {
        return res.sendStatus(401);
    }
    

    const authHeader = req.headers.authorization; // find out what is the return value of req.headers
    const token = authHeader.split(' ')[1];

    if (token === undefined || token === null) {
        return res.status(401).json({message:'Token verification failed'});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Access token expired" });
            }
            return res.status(403).json({ message: "Access token invalid" });
        }
        res.locals.user = decode;
        next();
    });
    
}

app.listen(3000, () => {
    console.log("Server is running in localhost:3000");
})