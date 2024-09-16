import express from "express";

const users = [];

function generateToken() {
    let options = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ];

    let token = "";
    for (let i = 0; i < 32; i++) {
        // use a simple function here
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}

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
        const token = generateToken();
        foundUser.token = token;
        console.log(users);
        return res.json({
            message: token,
        });
    } else
        return res.json({
            message: "Incorrect username or password",
        });
});

app.get("/me", (req, res) => {
    const token = req.headers.authorization;
    console.log(token);
    const user = users.find((u) => u.token === token);
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
