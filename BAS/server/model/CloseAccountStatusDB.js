const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  AccountNo: {
    type: String,
    default: "",
  },
  Email: {
    type: String,
    default: "",
  },
  Status: {
    type: String,
    default: "Pending",
  },
});

const CloseAccountStatus = new mongoose.model("closeaccountstatus", schema);

module.exports = CloseAccountStatus;
