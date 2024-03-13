const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  Age: {
    type: Number,
    default: 21
  },
  Balance: {
    type: Number,
    default: 0
  },
  Profession: {
    type: String,
    default: ""
  },
  MonthlyIncome: {
    type: Number,
    default: 0
  },
  Reason: {
    type: String,
    default: ""
  },
  Address: {
    type: String,
    default: ""
  },
  PanCard: {
    type: String,
    default: ""
  },
  AadharCard: {
    type: String,
    default: ""
  },
  TypeOfLoan: {
    type: String,
    default: "Personal Loan"
  },
  FirstName: {
    type: String,
    default: ""
  },
  LastName: {
    type: String,
    default: ""
  },
  Employee: {
    type: String,
    default: ""
  },
  AccountNo: {
    type: String,
    default: ""
  },
  interest: {
    type: Number,
    default: "9.5"
  },
  Installments: {
    type: [
      {
        installmentAmount: Number,
        date: Date,
        LoanType: String,
        AccountNo: String,
        RemainingLoanAmount: Number,
        LoanAmount: Number /** with interest rate */
      }
    ]
  },
  Email: {
    type: String,
    unique: true
  },
  LoanAmount: {
    type: Number,
    default: 0
  },
  Status: {
    type: String,
    default: "Pending"
  }
});

const UserLoan = new mongoose.model("loandata", schema);

module.exports = UserLoan;