import express from "express";
import jwt from "jsonwebtoken";

const users = [];
const JWT_SECRET = "aman";
const app = express();
app.use(express.json());

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send({ message: "Token not found" });
    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.decodeUsername = decodedData.username;
        next();
    } catch (e) {
        return res.send({
            message: "Invalid token",
        });
    }
};

app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    users.push({
        username,
        password,
    });
    // we should check if the user exists or not
    return res.send({
        message: "Sign up success!",
    });
});

app.post("/signin", (req, res) => {
    const { username, password } = req.body;
    const userFound = users.find(
        (user) => user.username === username && user.password === password
    );
    if (userFound) {
        const token = jwt.sign({ username }, JWT_SECRET);
        return res.send({
            message: "sign in success!",
            token: token,
        });
    }
    return res.send({
        message: "wrong credentials",
    });
});

app.get("/me", authMiddleware, (req, res) => {
    const user = users.find((user) => user.username === req.decodeUsername);
    return res.send({
        username: user.username,
        password: user.password,
    });
});

app.listen(3000, () => console.log("Server is running on PORT 3000"));
