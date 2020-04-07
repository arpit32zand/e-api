const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new Schema({
  uid: {
    type: Number,
    required: true,
    trim: true
  },
  user: {
    type: String,
    required: true,
    trim: true
  }
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
