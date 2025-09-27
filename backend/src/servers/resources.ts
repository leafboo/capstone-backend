import express, { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import { pool } from '../mysqlConnection.js'
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from "cors";
import 'dotenv/config.js';


// remember: Every line of code is a vulnerability

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // middleware that converst JSON from request to JavaScript object
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200);
    res.send("Welcome to the authentication API");
});

// This endpoint is needed for the admin feature 
app.get("/users", (req, res) => {
    res.send("User accounts")
});


app.post("/users", async (req, res) => {
    const {password, userName, email} = req.body;

    if (!password) {
        return res.send("body should contain password and should not be empty");
        
    }
    
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = 'INSERT INTO Users(UserName, Email, Salt, Hash) VALUES(?, ?, ?, ?);'
        const result = await pool.query(query, [userName, email, salt, hashedPassword]);
        res.status(201);
        res.send(result);
    } catch (err) {
        console.error(err)
        res.status(500);
    }
});

// For getting the current user's details
app.get("/users/me", authenticateToken, async (req, res) => {
    const userId = res.locals.user.sub;

    const query = 'SELECT * FROM Users WHERE Id = ?';
    const [ results ] = await pool.query(query, [userId]);
    const userDetails = JSON.parse(JSON.stringify(results)); // this is set to arrays by default bc of the return value of the pool.query

    res.status(200).json(userDetails[0]);
});

app.get("/workspaces", authenticateToken, async (req, res) => {
    const userId = res.locals.user.sub;
    
    const query = 'SELECT * FROM Workspaces WHERE UserId = ?';
    const [ results ] = await pool.query(query, [userId]);
    const workspaces = JSON.parse(JSON.stringify(results));

    res.status(200).json(workspaces);
});
app.post("/workspaces", authenticateToken,  async(req, res) => {
    const userId = res.locals.user.sub;
    const {workspaceName, dateCreated} = req.body;
    const numberOfPapers = 0;

    const query = `INSERT INTO Workspaces (Name, DateCreated, NumberOfPapers, UserId) 
                   VALUES (?, ?, ?, ?)`;
    const [ results ] = await pool.query(query, [workspaceName, dateCreated, numberOfPapers, userId]);
    const workspaceId = JSON.parse(JSON.stringify(results)).insertId;


    res.status(201).json({message: "Workspace successfully created", workspaceId: workspaceId});

});

app.get("/workspaces/:id", authenticateToken, async (req, res) => {
    const userId = res.locals.user.sub;
    const { id } = req.params;
    
    const query = 'SELECT * FROM Workspaces WHERE Id = ? AND UserId = ?';
    const [ results ] = await pool.query(query, [id, userId]);
    const workspace = JSON.parse(JSON.stringify(results));

    res.status(200).json(workspace);
});
app.delete("/workspaces/:id", authenticateToken, async (req, res) => {
    const userId = res.locals.user.sub;
    const { id } = req.params;

    const query = 'DELETE FROM Workspaces WHERE Id = ? AND UserId = ?';
    const [ results ] = await pool.query(query, [id, userId]);
    const deleteResult = JSON.parse(JSON.stringify(results));
    console.log(deleteResult);

    res.status(200).json({message: "Workspace successfully deleted"});
});

app.post("/researchPapers", authenticateToken, async (req, res) => {
    const { title, yearOfPublication, keywords, abstract, methods, findings } = req.body;

    const query = `INSERT INTO ResearchPapers (Title, YearOfPublication, Keywords, Abstract, Methods, Findings)
                   VALUES (?, ?, ?, ?, ?, ?)`;
    const [ results ] = await pool.query(query, [title, yearOfPublication, keywords, abstract, methods, findings]);
    const researchPaperId = JSON.parse(JSON.stringify(results)).insertId;

    res.status(201).json({message: "Research paper successfully added", researchPaperId: researchPaperId});
})





function authenticateToken(req: Request, res: Response, next: NextFunction)  {

    const accessToken: string = req.cookies.jwt_access_token;
    

    if (accessToken === undefined || accessToken === null) {
        return res.status(403).send("No access token provided")
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Access token expired");
            }
            return res.status(403).send("Access token invalid");
        }
        res.locals.user = decode;
        next();
    });
    
}

app.listen(3000, () => {
    console.log("Server is running in localhost:3000");
});