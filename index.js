const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3001;
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection has error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const usersRoute = require("./routers/users");
app.use("/user", usersRoute);

app.get("/sign-up", (req, res) => {
  res.sendFile("SignUp.html", { root: "../e-app/" });
});
app.get("/log-in", (req, res) => {
  res.sendFile("LogIn.html", { root: "../e-app/" });
});
app.get("/forgot-mail", (req, res) => {
  res.sendFile("forpassmail.html", { root: "../e-app/" });
});
app.get("/forgot-pass", (req, res) => {
  res.sendFile("forgotpass.html", { root: "../e-app/" });
});

app.listen(port, () => console.log(`Listening At Port ${port}`));
