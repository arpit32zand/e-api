const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const memtor = new Schema({
  uid: {
    type: Number,
    required: true,
    trim: true,
  },
  mid: {
    type: Number,
    required: true,
    //minlength: 5,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    unique: true,
  },
  mobileno: {
    type: Number,
    minlength: 10,
    maxlength: 10,
    trim: true,
  },
  subject: [
    {
      courseId: {
        type: Number,
        //required: true,
        //minlength: 5,
        trim: true,
        unique: true,
      },
      courseName: {
        type: String,
        //required: true,
        //minlength: 5,
        trim: true,
      },
      fileType: {
        type: String,
        //required: true,
        //minlength: 5,
        trim: true,
      },
      path: {
        type: String,
        //required: true,
        //minlength: 5,
        trim: true,
      },
    },
  ],
  username: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
  },
});
const Mentor = mongoose.model("Mentor", memtor);
module.exports = Mentor;
