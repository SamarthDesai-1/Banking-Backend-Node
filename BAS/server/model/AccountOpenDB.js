const mongoose = require("mongoose");

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
  NomineeAadharCard: {
    type: String,
    required: true,
    unique: true
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
  },
  DOB: {
    type: String,
    required: true
  },
  DigitalSignature: {
    type: String,
    default: ""
  },
  AccountNo: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    required: true
  }
});


const UserAccountOpenSchema = new mongoose.model("accountopenusers", schema);

module.exports = UserAccountOpenSchema;



