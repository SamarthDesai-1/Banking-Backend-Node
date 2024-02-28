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
  },
  IFSC: {
    type: String,
  },
  MICR: {
    type: String,
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

  /** New database fields */

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
  PIN: {
    type: String
  }
});

const CustomerFinancialasData = new mongoose.model("customerfinancialasdata", schema);

module.exports = CustomerFinancialasData;
