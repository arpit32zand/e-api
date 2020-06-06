const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require("cors");
let autoIncrement = require("mongoose-auto-increment");
const multer = require('multer')
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3003;
const uri = process.env.ATLAS_URI;
const Candidate = require("./models/candidate.model");
const User = require("./models/user.model");
const allcourses = require("./models/allCourses.model");
const Mentor = require("./models/mentor.model");

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection has error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const contRoute = require("./routers/content");
app.use("/cont", contRoute);

const testRoute = require("./routers/testing");
app.use("/testing", testRoute);

const usersRoute = require("./routers/users");
app.use("/user", usersRoute);

app.use('/uploads', express.static('courseImages'))

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
      cb(null, 'courseImages/')
  },
  filename:function (req, res, cb) {
    cb(null, Date.now(), file.originalname)
  }
});

const fileFilter = (req, res, cb) => {
  if(file.mimeType =='image/jpeg' || file.mimeType =='image/png')
  {
    cb(null, true)
  }else{
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    filesize: 1024*1024*5
  },
  fileFilter: fileFilter
})

app.post("/allCourses", upload.single('imagePath'), (req, res) => {
  const discountPrice = req.body.dprice;
  const actualPrice = req.body.aprice;
  const fileType = req.body.fileType;
  const path = req.body.path;
  const courseName = req.body.courseName;
  const courseId = req.body.courseId;
  const imagePath = req.file.path

  const newCour = new allcourses({
    courseId,
    courseName,
    path,
    fileType,
    actualPrice,
    discountPrice,
    imagePath
  });
  newCour
    .save()
    .then(() => res.send("Saved"))
    .catch((err) => res.status(400).json("error: " + err));
});

app.get("/allCourses", (req, res) => {
  allcourses.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/candidates", (req, res) => {
  Candidate.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/allcourse", (req, res) => {
  allcourses.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/mentors", (req, res) => {
  Mentor.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

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

app.get("/getFile", (req, res) => {
  res.sendFile("verifica.html", { root: "../e-app/" });
});

app.get("/test", (req, res) => {
  res.sendFile("test.html", { root: "../e-app/" });
});

app.get("/createFile", (req, res) => {
  res.sendFile("createFile.html", { root: "../e-app/" });
});

app.listen(port, () => console.log(`Listening At Port ${port}`));
