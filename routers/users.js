const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const router = express.Router();
require("dotenv").config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const User = require("../models/user.model");
const Test = require("../models/test.model");
const Mentor = require("../models/mentor.model");
const Candidate = require("../models/candidate.model");

const saltRounds = 10;
// let uid = process.env.UID;

let mes = "";
let ra = "";
router.use(cookieParser());

//sign-up
router.route("/add").post((req, res) => {
  const email = req.body.email;

  User.findOne({ email: email }, (err, foundAcc) => {
    if (err) console.log(err);

    if (!foundAcc) {
      mes = Math.floor(Math.random() * 1000000) + "";
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
          console.log("Mailer error : ", error);
        } else {
          console.log("Send!");
        }
      });

      res.send({
        result: "Send",
        details: req.cookies.userDetails
      });
    } else {
      res.send({ result: "Account Already Exist!" });
    }
  });
});

//Email Verification
router.route("/verify").post((req, res) => {
  const code = req.body.vcode;
  const username = req.body.username;
  const email = req.body.email;
  let password = req.body.password;
  const category = req.body.category;
  const mobileno = req.body.mobileno;
  // const subject = "";
  let courseId = " ",
    courseName = " ",
    fileType = " ";
  path = " ";

  let uid;
  if (code === mes) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        console.log(err);
      } else {
        password = hash;

        if (category === "mentor") {
          uid = 1;
          const newUser = new User({ uid, username, email, password });
          newUser.save().then(() => {
            Mentor.countDocuments()
              .then(count => {
                ra = count + 1;
                const newAcc = new Mentor({
                  uid,
                  mid: ra,
                  username,
                  email,
                  password,
                  mobileno
                });

                newAcc
                  .save()
                  .then(() => res.send({ result: "Created" }))
                  .catch(err => res.status(400).json("error: " + err));
              })
              .catch(err => res.status(400).json("error: " + err));
          });
        } else {
          uid = 2;
          const newUser = new User({ uid, username, email, password });
          newUser
            .save()
            .then(() => {
              Candidate.countDocuments().then(count => {
                ra = count + 1;
                const newAcc = new Candidate({
                  uid,
                  cid: ra,
                  username,
                  email,
                  password,
                  mobileno,
                  subject: [
                    {
                      courseId,
                      courseName,
                      fileType,
                      path
                    }
                  ]
                });
                newAcc
                  .save()
                  .then(() => res.send({ result: "Created" }))
                  .catch(err => res.status(400).json("error: " + err));
              });
            })
            .catch(err => res.status(400).json("error: " + err));
        }
      }
    });
  } else {
    res.send({ result: "Incorrect" });
  }
});

//forgot password
router.route("/forgotmail").post((req, res) => {
  const email = req.body.email;
  const uurl = "http://localhost:3000/forgot/password";

  User.findOne({ email: email }, (err, foundData) => {
    if (err) {
      res.status((400).json("error: " + err));
    }
    if (foundData) {
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
      res.send({ result: "Exist" });
    } else res.send({ result: "DExist" });
  });
});

//forgot password verification
router.route("/forgotpass").put((req, res) => {
  const email = req.body.email;
  let newpass = req.body.newpass;
  const confpass = req.body.confpass;
  if (newpass === confpass) {
    bcrypt.hash(newpass, saltRounds, function(err, hash) {
      if (err) {
        console.log(err);
      } else {
        User.findOneAndUpdate({ email }, { password: hash }, (err, data) => {
          if (err) console.log(err);
          if (data) {
            res.send({ result: "Success" });
          }
        });
      }
    });
  } else {
    res.send({ result: "NoMatch" });
  }
});

//log-in/sign-in code
router.route("/").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, (err, foundAcc) => {
    if (err) console.log(err);

    if (foundAcc) {
      bcrypt.compare(password, foundAcc.password, (err, accre) => {
        if (err) console.log(err);
        else {
          if (accre == true)
            if (foundAcc.category === "teacher")
              res.send({ result: "TLogged" });
            else res.send({ result: "SLogged" });
          else res.send({ result: "Wrong Password" });
        }
      });
    } else res.send({ result: "Wrong Email" });
  });
});

router.route("/send").post((req, res) => {
  const user = req.body.user;
  // Test.findOneAndUpdate(
  //   (err, data) => {
  //     if (err) console.log(err);
  //     if (data) {
  //       console.log({ result: "Success" });
  //     }
  //   }
  // );
  let ra = "";
  Test.countDocuments().then(count => {
    ra = count + 1;
    const newUser = new Test({ uid: ra, user });

    newUser
      .save()
      .then(() => res.send({ result: "Created" }))
      .catch(err => res.status(400).json("error: " + err));
  });
});
router.route("/send").get((req, res) => {
  /*res.send([
    {
      email: "arpit1999@gmail.com",
      uname: "Arpit"
    },
    {
      email: "ankur@gmail.com",
      uname: "Ankur"
    },
    {
      uname: req.body.uname
    }
  ]);*/

  res.send(req.cookies.testcook);
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
