import express from "express";
import bcrypt from "bcrypt";
import { pool } from './mysqlConnection.js'


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
    const query = 'SELECT Hash FROM Users WHERE UserName = ? OR Email = ? ;';
    const [ rows ] = await pool.query(query, [req.body.userName, req.body.email]); // select the user first 
    const user = null;
    const hashedUserPassword = "";

    if (user === null) {
        res.status(404);
        res.send("User not found");
        return;
    }
    try {
        if ( await bcrypt.compare(req.body.password, hashedUserPassword) ) {
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