const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const signUp = new Schema({
  fullname: {
    type: String,
    required: true,
    minlength: 5,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    unique: true
  }
});
const ActualUser = mongoose.model("ActualUser", signUp);
module.exports = ActualUser;
