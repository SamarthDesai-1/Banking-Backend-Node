const mongoose = require('mongoose');

const schema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  AccountNo: {
    type: String,
    default: ""
  },
  Email: {
    type: String,
    default: ""
  },
  Status: {
    type: String,
    default: "Pending"
  }
});

const LoanStatus = new mongoose.model("loanstatusdatas", schema);

module.exports = LoanStatus;