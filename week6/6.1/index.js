import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const users = [];
dotenv.config();
const secret = process.env.JWT_SECRET;
const app = express();
app.use(express.json());
app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    if (username.length < 5) {
        return res.json({
            message: "Give a big username!",
        });
    }
    if (users.find((u) => u.username === username)) {
        res.json({
            message: "Dupliate Entry, Error!",
        });
        return;
    }
    users.push({
        username: username,
        password: password,
    });
    console.log(users);
    return res.json({
        message: "successfully registered!",
    });
});
app.post("/signin", (req, res) => {
    const { username, password } = req.body;
    const foundUser = users.find((u) => {
        if (u.username === username && u.password === password) return true;
        else return false;
    });
    if (foundUser) {
        // const token = generateToken();
        const token = jwt.sign({ username: foundUser.username }, secret);
        console.log(users);
        return res.json({
            token: token,
        });
    } else
        return res.json({
            message: "Incorrect username or password",
        });
});

app.get("/me", (req, res) => {
    const token = req.headers.authorization; //jwt token
    console.log(token);
    const decodedInformation = jwt.verify(token, secret); // {username: "amanfang"}
    console.log(decodedInformation);
    const username = decodedInformation.username;

    const user = users.find((u) => u.username === username);
    if (user)
        res.send({
            username: user.username,
            password: user.password,
        });
    else {
        res.status(401).send({
            message: "Unauthorized",
        });
    }
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
