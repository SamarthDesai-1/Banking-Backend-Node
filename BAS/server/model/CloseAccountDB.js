const mongoose = require("mongoose");

const schema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  FirstName: {
    type: String,
    default: ""
  },
  LastName: {
    type: String,
    default: ""
  },
  Email: {
    type: String,
    unique: true
  },
  AccountNo: {
    type: String,
    unique: true
  },
  Reason: {
    type: String,
    default: ""
  },
  Admin: {
    type: String,
    default: "false"
  },
  Status: {
    type: String,
    default: "Pending"
  }
});

const AccountCloseSchema = mongoose.model("accountcloserequest", schema);

module.exports = AccountCloseSchema;