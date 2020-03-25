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

//sign-up
router.route("/add").post((req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, (err, foundAcc) => {
    if (err) console.log(err);

    if (!foundAcc) {
      const mes = Math.floor(Math.random() * 1000000) + "";
      let cdata = {
        vercode: mes,
        username: username,
        email: email,
        password: password
      };
      res.cookie(
        "userDetails",
        cdata,
        {
          maxAge: 1000 * 60 * 5
        },
        {
          httpOnly: false,
          secure: false,
          sameSite: false
        }
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
        details: req.cookies.userDetails
      });
    } else {
      res.send({ result: "Account Already Exist!" });
    }
  });
});

//email verification
router.route("/verify").post((req, res) => {
  const code = req.body.vcode;
  const checkpin = req.cookies.userDetails.vercode;
  const username = req.cookies.userDetails.username;
  const email = req.cookies.userDetails.email;
  let password = req.cookies.userDetails.password;
  if (code == checkpin) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        console.log(err);
      } else {
        password = hash;
        const newAcc = new User({ username, email, password });
        newAcc
          .save()
          .then(() => res.send({ result: "Created" }))
          //.then(() => res.redirect("http://localhost:3001/sign-up/"))
          .catch(err => res.status(400).json("error: " + err));
        //res.clearCookie("userDetails");
      }
    });
  } else {
    res.send({ result: "Incorrect" });
  }
});

//forgot password
router.route("/forgotmail").post((req, res) => {
  const email = req.body.email;
  const uurl = "http://localhost:3000/";

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
      res.send({ result: "Check Your Email For Verification!" });
    } else res.send({ result: "Account Doesn't Exist" });
  });
});

//forgot password verification
router.route("/forgotpass").post((req, res) => {
  const newpassword = req.body.newpassword;
  const confirmpassword = req.body.confirmpassword;
  const email = req.cookies.uDetail.email;
  if (newpassword === confirmpassword) {
    User.findOne({ email: email }, (err, foundData) => {
      if (err) {
        res.status((400).json("error: " + err));
      }
      if (foundData) {
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
    res.send("Confirm Password Did Not MATCH New Password");
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
          if (accre == true) res.send({ result: "Logged" });
          else res.send({ result: "Wrong Password" });
        }
      });
    } else res.send({ result: "Wrong Email" });
  });
});

router.route("/send").post((req, res) => {
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
  res.cookie("testcook", { mes: "Hello everyone", mes2: "thanks" });
  let data = {
    result: req.cookies.testcook
  };
  console.log(data.result);
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
