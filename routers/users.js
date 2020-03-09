const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const User = require("../models/user.model");

const saltRounds = 10;

router.use(cookieParser());
router.route("/add").post((req, res) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const mes = Math.floor(Math.random() * 1000000) + "";

  res.cookie(
    "userDetails",
    { fullname: fullname, email: email, password: password, vercode: mes },
    { maxAge: 1000 * 60 * 10 }
  );

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
    text: mes
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Send!");
    }
  });
  res.sendFile("verifica.html", { root: "../e-app/" });
});

router.route("/verify").post((req, res) => {
  const code = req.body.pin;
  const checkpin = req.cookies.userDetails.vercode;
  const fullname = req.cookies.userDetails.fullname;
  const email = req.cookies.userDetails.email;
  let password = req.cookies.userDetails.password;

  if (code == checkpin) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        console.log(err);
      } else {
        password = hash;
        const newAcc = new User({ fullname, email, password });
        newAcc
          .save()
          .then(() => res.send("Account Created SuccessFully"))
          .then(() => res.redirect("http://localhost:3001/sign-up/"))
          .catch(err => res.status(400).json("error: " + err));
        res.clearCookie("userDetails");
      }
    });
  } else {
    res.send("Incorrect Code");
  }
});

router.route("/forgotmail").post((req, res) => {
  const email = req.body.email;
  const uurl = "http://localhost:3001/forgot-pass/";

  User.findOne({ email: email }, (err, foundData) => {
    if (err) {
      res.status((400).json("error: " + err));
    }
    if (foundData) {
      res.cookie("uDetail", { email: email }, { maxAge: 1000 * 60 * 5 });
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
        text: "Click on the link Given below \n" + uurl
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Send!");
        }
      });
      res.redirect("https://mail.google.com/");
    } else res.send("Account Doesn't Exist");
  });
});

router.route("/forgotpass").post((req, res) => {
  const newpassword = req.body.newpassword;
  const confirmpassword = req.body.confirmpassword;
  const email = req.cookies.uDetail.email;
  if (newpassword === confirmpassword) {
    User.findOne({ email: email }, (err, foundData) => {
      if (err) {
        res.status((400).json("error: " + err));
      } else {
        bcrypt.hash(newpassword, saltRounds, function(err, hash) {
          if (err) {
            console.log(err);
          } else {
            foundData.password = hash;
            foundData.save((err, data) => {
              if (err) console.log(err);
              else {
                res.clearCookie("uDetail");
                res.send("Password Changed Successfully");
              }
            });
          }
        });
      }
    });
  } else {
    res.send("New Password Did Not MATCH Confirm Password");
  }
});

router.route("/").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, (err, foundAcc) => {
    if (err) console.log(err);

    if (foundAcc) {
      bcrypt.compare(password, foundAcc.password, (err, result) => {
        if (err) console.log(err);
        else {
          if (result == true) res.send("Welcome To Eguru");
          else res.send("Account Not Found");
        }
      });
    } else res.send("byebye");
  });
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
