import express from "express";
import bcrypt from "bcrypt";
import { pool } from './mysqlConnection.js'

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
        console.log(`The salt is: ${salt}`);
        console.log(`The hashed password is: ${hashedPassword}`);
        const query = `INSERT INTO Users(UserName, Email, Salt, Hash)
                       VALUES('${req.body.userName}', '${req.body.email}', '${salt}', '${hashedPassword}');`
        pool.query(query, (err, resp, fields) => {
            if (err) {
                throw err;
            }
            res.status(201);
            res.send(resp);
        })
         // 201 status for successfully creating new entry
    } catch (err) {
        console.error(err)
        res.status(500);
    }
});

app.listen(3000, () => {
    console.log("Server is running in localhost:3000");
})