const mongoose = require("mongoose");

/**
 * Fetch first name and last name and email from signupDB
*/

let schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  AccountType: {
    type: String,
    required: true
  },
  Mobile: {
    type: String,
    required: true
  },
  PanCard: {
    type: String,
    required: true,
    unique: true
  },
  AadharCard: {
    type: String,
    required: true,
    unique: true
  },
  Photo: {
    type: String,
    required: true
  },
  Nominee: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  MonthlyIncome: {
    type: Number,
    required: true
  },
  IFSC: {
    type: String,
  },
  MICR: {
    type: String,
  },
  Email: {
    type: String,
    unique: true,
  }
});


let UserAccountOpenSchema = new mongoose.model("accountopenusers", schema);

module.exports = UserAccountOpenSchema;

