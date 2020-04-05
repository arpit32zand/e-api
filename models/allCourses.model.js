const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courseSchema = new Schema({
  courseId: {
    type: Number,
    required: true,
    //minlength: 5,
    trim: true,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
    // minlength: 5,
    trim: true,
  },
  fileType: {
    type: String,
    required: true,
    // minlength: 5,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    // minlength: 5,
    trim: true,
  },
  actualPrice: {
    type: Number,
    required: true,
    trim: true,
  },
  discountPrice: {
    type: Number,
    required: true,
    trim: true,
  },
});
const allcourses = mongoose.model("allcourses", courseSchema);
module.exports = allcourses;
