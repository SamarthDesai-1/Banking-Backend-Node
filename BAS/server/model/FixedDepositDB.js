const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  Email: {
    type: String,
    unique: true
  },
  DigitalSignature: {
    type: String,
    default: ""
  },
  AccountNo: {
    type: String,
    unique: true
  },
  Balance: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: ""
  },
  FixedDeposits: {
    type: [
      {
        date: Date,
        status: String,
        amount: Number,
        rate: String,
        expiryTime: Number
      }
    ],
    default: []
  },
  Installments: {
    type: [
      {
        date: Date,
        status: String,
        amount: Number
      }
    ],
    default: []
  }
});

const UserFD = new mongoose.model("userfddata", schema);

module.exports = UserFD;

