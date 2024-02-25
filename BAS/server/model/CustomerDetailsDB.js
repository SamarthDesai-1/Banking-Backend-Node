const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  CurrentBalance: {
    type: Number,
  },
  MinimumBalance: {
    type: Number,
  },
  Loan: {
    type: String,
  },
  Email: {
    type: String,
    unique: true,
  }
});

const UserCustomerDetailsSchema = new mongoose.model("customerbankdetails", schema);

module.exports = UserCustomerDetailsSchema;
