const mongoose = require("mongoose");

let schema = new mongoose.Schema({  
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  DigitalSignature: {
    type: String,
    default: ""
  },
  Email: {
    type: String,
    required: true
  },
  Balance: {
    type: Number,
    default: 0
  },
  Loan: {
    type: Array,
    default: []
  },
  TransactionHistory: {
    type: [
      {
        date: Date,
        transferAmount: Number,
        senderAccountNo: String,
        recevierAccountNo: String,
        status: String, /** active or inactive */
        statementStatus: String,
        msg: String,
      }
    ],
    default: [] /** array of object */
  }, /** later on add credit card field also */
  AccountNo: {
    type: String,
    required: true,
    unique: true
  },
  Token: {
    type: String,
    default: ""
  }
});

const AccountStatusSchema = new mongoose.model("AccountStatusData", schema);

module.exports = AccountStatusSchema;

