const mongoose = require("mongoose");

const schema = new mongoose.Schema({ 
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  Email: {
    type: String,
    unique: true,
    required: true
  },
  IFSC: {
    type: String,
    required: true
  },
  MICR: {
    type: String,
    required: true
  },
  MonthlyIncome: {
    type: Number,
    required: true
  },
  Photo: {
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
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  Mobile: {
    type: String,
    required: true
  },
  AccountType: {
    type: String,
    required: true
  },
  DigitalSignature: {
    type: String,
    default: ""
  },

  /** New database fields */
  PIN: {
    type: String,
    unique: true
  },
  Balance: {
    type: Number
  },
  MinimumBalance: {
    type: Number
  },
  Loan: {
    type: String
  },
  CreditCard: {
    type: String
  },
  DebitCard: {
    type: String
  },
  AccountNo: {
    type: String,
    required: true
  }
});

const CustomerFinancialasData = new mongoose.model("customerfinancialasdata", schema);

module.exports = CustomerFinancialasData;

