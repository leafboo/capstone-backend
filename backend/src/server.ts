import express from "express";
import bcrypt from "bcrypt";
import { pool } from './mysqlConnection.js'


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

app.get("/", (req, res) => {
    res.status(200);
    res.send("Welcome to the authentication API");
});

app.post("/users", async (req, res) => {
    // CHECK IF THE USER ALREADY EXISTS
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
            res.send("Successfully logged in")
        } else {
            res.send("Wrong password. Try again.")
        }
    } catch (err) {
        res.status(500);
    }
    // console.log(rows?[0].Hash);
})

app.listen(3000, () => {
    console.log("Server is running in localhost:3000");
})