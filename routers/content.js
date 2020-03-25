const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const fs = require("fs");
const Content = require("../models/content.model");
//var localStorage = require("localStorage"), myValue = { foo: "bar", baz: "quux" };
//const localStorage = require("localStorage ");

router.route("/render").post((req, res) => {
  localStorage.getItem("Help");
  /*const filename = "./files/" + req.body.filename;
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) return console.log(err);
    if (data) res.send(data);
    else res.send("No data Available");
  });*/
});

router.route("/create").post((req, res) => {
  localStorage.setItem(req.body.name, req.body);
  /*const filename = "./files/" + req.body.name;
  const userCont = req.body.context;

  fs.writeFile(filename, userCont, "utf8", (err, data) => {
    if (err) return console.log(err);

    res.send("Sent");
  });*/
});

module.exports = router;
