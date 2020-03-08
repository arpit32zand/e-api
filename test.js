const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const port = 3000;
const saltRounds = 10;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/hsh", (req, res) => {
  const password = "aditya";

  bcrypt.hash(password, saltRounds, function(err, hash) {
    res.send(hash);
  });
});
app.get("/getCookie", (req, res) => {
  res.send(req.cookies.Email);
});

app.listen(port, () => console.log(`Listening At Port ${port}`));
