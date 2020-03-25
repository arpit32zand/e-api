const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const file = new Schema({
  filename: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    unique: true
  },
  authorname: {
    type: String,
    required: true,
    minlength: 7,
    trim: true
  },
  url: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    unique: true
  }
});
const Content = mongoose.model("Content", file);
module.exports = Content;
