import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv"; // Import dotenv

// Load environment variables from .env file
dotenv.config();

const users = []; // In-memory storage, consider using a database for production
const app = express();
app.use(express.json());

// Use environment variable for JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key";

app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    if (username.length < 5) {
        return res.json({ message: "Give a bigger username!" });
    }
    if (users.find((u) => u.username === username)) {
        return res.json({ message: "Duplicate Entry, Error!" });
    }

    // Hash the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword });
    console.log(users);
    return res.json({ message: "Successfully registered!" });
});

app.post("/signin", (req, res) => {
    const { username, password } = req.body;
    const foundUser = users.find((u) => u.username === username);

    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
        // Sign the JWT
        const token = jwt.sign({ username: foundUser.username }, JWT_SECRET, {
            expiresIn: "1h",
        });
        console.log(users);
        return res.json({ token });
    } else {
        return res.json({ message: "Incorrect username or password" });
    }
});

app.get("/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedInformation = jwt.verify(token, JWT_SECRET);
        const username = decodedInformation.username;

        const user = users.find((u) => u.username === username);
        if (user) {
            return res.send({
                username: user.username,
                password: user.password, // In a real application, avoid sending passwords
            });
        } else {
            return res.status(401).send({ message: "Unauthorized" });
        }
    } catch (error) {
        return res.status(401).send({ message: "Unauthorized" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
