import express from "express";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json()); // middleware that converst JSON from request to JavaScript object

app.get("/users", (req, res) => {
    res.status(200);
    res.send("Welcome to the authentication API");
});

app.post("/users", async (req, res) => {
    if (!req.body.password) {
        return res.send("body should contain password and should not be empty");
        
    }
    
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(`The salt is: ${salt}`);
        console.log(`The hashed password is: ${hashedPassword}`);
        res.status(201); // 201 status for successfully creating new entry
    } catch (err) {
        console.error(err)
        res.status(500);
    }
});

app.listen(3000, () => {
    console.log("Server is running in localhost:3000");
})