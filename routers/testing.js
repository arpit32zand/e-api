const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
//const cookieParser = require("cookie-parser");
const router = express.Router();
const session = require("express-session");
require("dotenv").config();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const User = require("../models/user.model");
const Test = require("../models/test.model");
const Mentor = require("../models/mentor.model");
const Candidate = require("../models/candidate.model");

const saltRounds = 10;
// let uid = process.env.UID;

const IN_PROD = process.env.NODE_ENV === "production";
let mes = "";
let ra = "";
//router.use(cookieParser());
router.use(
  session({
    name: process.env.SESS_NAM,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SEC_CODE,
    cookie: {
      maxAge: 1000 * 5,
      sameSite: false,
      secure: false,
    },
  })
);

router.route("/authchecker").get((req, res) => {
  const sessUser = req.session.email;
  if (sessUser) {
    res.sendFile("test.html", { root: "../e-app/" });
    // res.redirect("/test");
  } else {
    res.sendFile("LogIn.html", { root: "../e-app/" });
  }
});

router.route("/sesin").post((req, res) => {
  const email = req.body.email;
  const pass = req.body.password;

  User.findOne({ email: email }, (err, foundAcc) => {
    if (err) console.log(err);

    if (foundAcc) {
      bcrypt.compare(pass, foundAcc.password, (err, accre) => {
        if (err) console.log(err);
        else {
          if (accre == true) {
            req.session.email = foundAcc.email;
            // console.log(req.session.email);
            res.redirect("/testing/test/");
          } else res.send({ result: "Wrong Password" });
        }
      });
    } else res.send({ result: "Wrong Email" });
  });
});

router.route("/sesout").get((req, res) => {
  console.log(req.session);
  req.session.destroy((err) => {
    if (err) {
      console.log("error");
    }

    res.clearCookie(process.env.SESS_NAME).redirect("/testing/log-in/");
  });
});

router.route("/test").get((req, res) => {
  if (req.session.email) {
    res.sendFile("test.html", { root: "../e-app/" });
  } else {
    res.sendFile("LogIn.html", { root: "../e-app/" });
  }
});

router.route("/log-in").get((req, res) => {
  if (req.session.email) {
    res.sendFile("test.html", { root: "../e-app/" });
  } else {
    res.sendFile("LogIn.html", { root: "../e-app/" });
  }
});

module.exports = router;

/*if (newpassword === confirmpassword) {
    User.findOne({ email: email }, (err, foundData) => {
      if (err) {
        res.status((400).json("error: " + err));
      } else {
        foundData.password = newpassword;
      }
  
      foundData.save((err, data) => {                                 
        if (err) console.log(err);
        else res.send("Password Changed Successfully");
      });
    });
  } else {
    res.send("New Password Did Not MATCH Confirm Password");
  }*/

//add-new
/*router.route("/add").post((req, res) => {
    const mes = req.body.vcode;
    const email = req.body.email;
  
    User.findOne({ email: email }, (err, foundAcc) => {
      if (err) console.log(err);
  
      if (!foundAcc) {
        var transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: "eguru.proj@gmail.com",
            pass: "pehelahai1"
          }
        });
        var mailOptions = {
          from: "eguru.proj@gmail.com",
          to: email,
          subject: "no-reply",
          text: "Please Enter This Verification Code to Register \n" + mes
        };
  
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Send!");
          }
        });
  
        res.send({
          result: "Send",
        });
      } else {
        res.send({ result: "Account Already Exist!" });
      }
    });
  });*/
