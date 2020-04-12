const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const signUp = new Schema({
  uid: {
    type: Number,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
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
});
const User = mongoose.model("User", signUp);
module.exports = User;
