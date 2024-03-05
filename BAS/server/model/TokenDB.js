const mongoose = require("mongoose");


let schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  Email: {
    type: String,
    required: true
  },
  Randomstring: {
    type: String,
    required: true,
  },
  AccountNo: {
    type: String,
    required: true
  }
});

const TokenSchema = new mongoose.model("tokendata", schema);

module.exports = TokenSchema;
