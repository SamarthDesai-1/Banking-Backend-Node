const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  CVV: {
    type: String
  },
  DebitCardNumber: {
    type: String
  },
  ExpiryDate: {
    type: Date,
    default: Date
  },  
  CardIssuer: {
    type: String,
    default: "Transact Bank ltd"
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  DigitalSignature: {
    type: String
  },
  FirstName: {
    type: String,
    required: true 
  },
  LastName: {
    type: String,
    required: true
  },
  AccountNo: {
    type: String
  },
  Mobile: {
    type: String,
    required: true
  },
  DebitCardPIN: {
    type: String,
    required: true
  }
});

const DebitCardSchema = new mongoose.model("debitcarddata", schema);

module.exports = DebitCardSchema;