const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const multer = require("multer");
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
const allcourses = require("../models/allCourses.model");

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
      sameSite: true,
      secure: false,
    },
  })
);

//sign-up
router.route("/add").post((req, res) => {
  const email = req.body.email;

  User.findOne({ email: email }, (err, foundAcc) => {
    if (err) console.log(err);

    if (!foundAcc) {
      mes = Math.floor(Math.random() * 1000000) + "";
      console.log(typeof mes);
      console.log(mes);
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "eguru.proj@gmail.com",
          pass: "pehelahai1",
        },
      });
      var mailOptions = {
        from: "eguru.proj@gmail.com",
        to: email,
        subject: "no-reply",
        text: "Please Enter This Verification Code to Register \n" + mes,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Mailer error : ", error);
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
  let done = 0;
  let uid, cid, mid;
  console.log(typeof mes);
  console.log(typeof code);
  if (code === mes) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.log(err);
      } else {
        password = hash;

        if (category === "mentor") {
          uid = 1;
          const newUser = new User({ uid, username, email, password });
          newUser
            .save()
            .then(async () => {
              while (done === 0) {
                mid = Math.floor(Math.random() * 10000) + "";
                console.log(uid);
                const check = await Mentor.findOne({ mid });
                if (check) {
                  done = 0;
                } else {
                  done = 1;
                }
              }
              const newAcc = await new Mentor({
                uid,
                mid,
                username,
                email,
                password,
                mobileno,
                // subject: [
                //   {
                //     courseId,
                //     courseName,
                //     fileType,
                //     path,
                //   },
                // ],
              });

              newAcc
                .save()
                .then(() => res.send({ result: "Created" }))
                .catch((err) => res.status(400).json("error: " + err));
            })
            .catch((err) => res.status(400).json("error: " + err));
        } else {
          uid = 2;
          const newUser = new User({ uid, username, email, password });
          newUser
            .save()
            .then(async () => {
              while (done === 0) {
                cid = Math.floor(Math.random() * 10000) + "";
                console.log(uid);
                const check = await Candidate.findOne({ cid });
                if (check) {
                  done = 0;
                } else {
                  done = 1;
                }
              }
              const newAcc = new Candidate({
                uid,
                cid,
                username,
                email,
                password,
                mobileno,
                // subject: [
                //   {
                //     courseId,
                //     courseName,
                //     fileType,
                //     path,
                //   },
                // ],
              });
              newAcc
                .save()
                .then(() => res.send({ result: "Created" }))
                .catch((err) => res.status(400).json("error: " + err));
            })
            .catch((err) => res.status(400).json("error: " + err));
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
          pass: "pehelahai1",
        },
      });
      var mailOptions = {
        from: "eguru.proj@gmail.com",
        to: email,
        subject: "no-reply",
        text: "Click on the link Given below \n" + uurl,
      };

      transporter.sendMail(mailOptions, function (error, info) {
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
    bcrypt.hash(newpass, saltRounds, function (err, hash) {
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
  let sessUser = "";

  User.findOne({ email: email }, (err, foundAcc) => {
    if (err) console.log(err);

    if (foundAcc) {
      bcrypt.compare(password, foundAcc.password, (err, accre) => {
        if (err) console.log(err);
        else {
          if (accre == true) {
            if (foundAcc.uid === 1) {
              res.send({ result: "TLogged", sessUser });
            } else res.send({ result: "SLogged", sessUser });
          } else res.send({ result: "Wrong Password" });
        }
      });
    } else res.send({ result: "Wrong Email" });
  });
});

router.route("/logout").delete((req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie(SESS_NAM).send({ result: "OUT" }); // clears cookie containing expired sessionID
  });
});

router.route("/authchecker").get((req, res) => {
  const sessUser = req.session.email;
  if (sessUser) {
    res.sendFile("test.html", { root: "../e-app/" });
    // res.redirect("/test");
  } else {
    res.sendFile("LogIn.html", { root: "../e-app/" });
  }
});

//update
router.route("/update-m-c").put((req, res) => {
  let email = "",
    id = "",
    username = "",
    uid = "",
    path = "",
    mobileno = "",
    password = "",
    newPass = "",
    confPass = "";
  Object.keys(req.body).forEach((key) => {
    if (key === "username") {
      if (req.body.uid === 1) {
        Mentor.findOneAndUpdate(
          { email },
          { username: username },
          (err, data) => {
            if (err) console.log(err);
            if (data) {
              console.log("Mentor Done");
            }
          }
        );
        User.findOneAndUpdate(
          { email },
          { username: username },
          (err, data) => {
            if (err) console.log(err);
            if (data) {
              res.send({ result: "DONE" });
            }
          }
        );
      } else {
        Candidate.findOneAndUpdate(
          { email },
          { username: username },
          (err, data) => {
            if (err) console.log(err);
            if (data) {
              console.log("Candidate Done");
            }
          }
        );
        User.findOneAndUpdate(
          { email },
          { username: username },
          (err, data) => {
            if (err) console.log(err);
            if (data) {
              res.send({ result: "DONE" });
            }
          }
        );
      }
    } else if (key === "mobileno") {
      if (uid === 1) {
        Mentor.findOneAndUpdate(
          { email },
          { mobileno: mobileno },
          (err, data) => {
            if (err) console.log(err);
            if (data) {
              res.send({ result: "DONE" });
            }
          }
        );
      } else {
        Candidate.findOneAndUpdate(
          { email },
          { mobileno: mobileno },
          (err, data) => {
            if (err) console.log(err);
            if (data) {
              res.send({ result: "DONE" });
            }
          }
        );
      }
    } else if (key === "oldPass") {
      User.findOne({ email: email }, (err, foundAcc) => {
        if (err) console.log(err);

        if (foundAcc) {
          bcrypt.compare(password, foundAcc.password, (err, accre) => {
            if (err) console.log(err);

            if (accre == true) {
              res.send({ result: "FOUND" });
            } else res.send({ result: "NOT" });
          });
        } else {
          res.send({ result: "NO" });
        }
      });
    } else if (key === "path") {
      Mentor.findOneAndUpdate(
        { email, "subject.courseId": id },
        {
          $set: {
            "subject.$.path": path,
          },
        },
        (err, newa) => {
          res.json(newa);
        }
      );
      allcourses.findOneAndUpdate(
        { courseId: id },
        {
          $set: {
            path: path,
          },
        },
        (err, newa) => {
          res.send({ result: "DONE" });
        }
      );
    } else if (key === "newPass") {
      if (newPass === confPass) {
        bcrypt.hash(newPass, saltRounds, function (err, hash) {
          if (err) {
            console.log(err);
          } else {
            User.findOneAndUpdate(
              { email },
              { password: hash },
              (err, data) => {
                if (err) console.log(err);
                if (data) {
                  console.log("User PASSWORD Changed");
                }
              }
            );
            if (uid === 1) {
              Mentor.findOneAndUpdate(
                { email },
                { password: hash },
                (err, data) => {
                  if (err) console.log(err);
                  if (data) {
                    res.send({ result: "DONE" });
                  }
                }
              );
            } else {
              Candidate.findOneAndUpdate(
                { email },
                { password: hash },
                (err, data) => {
                  if (err) console.log(err);
                  if (data) {
                    res.send({ result: "DONE" });
                  }
                }
              );
            }
          }
        });
      } else {
        res.send({ result: "NoMatch" });
      }
    } else {
      email = req.body.email;
      id = req.body.courseId;
      path = req.body.path;
      mobileno = req.body.mobileno;
      uid = req.body.uid;
      password = req.body.oldPass;
      newPass = req.body.newPass;
      confPass = req.body.confPass;
      username = req.body.username;
    }
  });
});

//delete
router.route("delete-m-c").put((req, res) => {
  let email = "",
    uid = "",
    id = "";
  Object.keys(req.body).forEach((key) => {
    if (key === "courseId") {
      if (uid === 1) {
        Mentor.findOneAndUpdate(
          { email },
          {
            $pull: {
              subject: { courseId: { $in: [id] } },
            },
          },
          (err, acc) => {
            if (err) return console.log(err);
            console.log(acc);
          }
        );
        allcourses.findOneAndUpdate(
          { courseId },
          {
            $pull: {
              courseId: id,
            },
          },
          (err, acc) => {
            if (err) return console.log(err);
            res.send({ result: "DONE" });
          }
        );
      } else {
        Candidate.findOneAndUpdate(
          { email },
          {
            $pull: {
              subject: { courseId: { $in: [id] } },
            },
          },
          (err, acc) => {
            if (err) return console.log(err);
            res.send({ result: "DONE" });
          }
        );
      }
    } else {
      email = req.body.email;
      uid = req.body.uid;
      id = req.body.courseId;
    }
  });
});

router.route("/purchase").put((req, res) => {
  cid = req.body.cid;
  courseId = req.body.courseId;
  courseName = req.body.courseName;
  path = req.body.path;
  fileType = req.body.fileType;
  textContent = req.body.textContent;
  imagePath = req.body.imagePath;

  Candidate.findOneAndUpdate(
    { cid },
    {
      $push: {
        subject: {
          courseId,
          courseName,
          path,
          fileType,
          textContent,
          imagePath,
        },
      },
    },
    (err, data) => {
      if (err) console.log(err);
      if (data) {
        res.send({ result: "DONE" });
      }
    }
  );
});

app.use("/uploads", express.static("courseImages"));

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "courseImages/");
  },
  filename: function (req, res, cb) {
    cb(null, Date.now(), file.originalname);
  },
});

const fileFilter = (req, res, cb) => {
  if (file.mimeType == "image/jpeg" || file.mimeType == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    filesize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router
  .route("/add-course")
  .post(upload.single("imagePath"), async (req, res) => {
    let done = 0;
    while (done === 0) {
      courseId = Math.floor(Math.random() * 10000) + "";

      const check = await allcourses.findOne({ courseId });
      if (check) {
        done = 0;
      } else {
        done = 1;
      }
    }
    email = req.body.email;
    courseName = req.body.courseName;
    path = req.body.path;
    actualPrice = req.body.actualPrice;
    discountPrice = req.body.discountPrice;
    fileType = req.body.fileType;
    textContent = req.body.textContent;
    imagePath = req.body.imagePath;

    const newCourse = await new allcourses({
      courseId,
      courseName,
      fileType,
      path,
      actualPrice,
      discountPrice,
      textContent,
      imagePath,
    });

    await newCourse
      .save()
      .then(() => {
        Mentor.update(
          { email },
          {
            $push: {
              subject: {
                courseId,
                courseName,
                fileType,
                path,
                actualPrice,
                discountPrice,
                textContent,
                imagePath,
              },
            },
          },
          (err, data) => {
            if (err) console.log(err);
            if (data) {
              res.send({ result: "Created" });
            }
          }
        );
      })
      .catch((err) => res.status(400).json("error: " + err));
  });

module.exports = router;
