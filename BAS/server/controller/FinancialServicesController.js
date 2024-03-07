const mongoose = require("mongoose");
const GenerateCvv = require("../RandomPINS/Cvv");
const GenerateDebitCardNo = require("../RandomPINS/DebitCard");
const checkConnection = require("../CheckConnections/CheckConnections");

exports.issueCard = async (request, response) => {

  const { sessionEmail, formData } = request.body;

  console.log("Email : ", request.body.sessionEmail);

  await mongoose.connection.close();
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  Database = "CustomerFinancials_Database";
  await checkConnection(Database);


  const data = await CustomerFinancialasData.find({ Email: sessionEmail }, { _id: 1 , DigitalSignature: 1, PIN: 1 });
  await CustomerFinancialasData.updateOne({ _id: data[0]._id }, { $set: { DebitCard: "Active" } }, { new: true });


  await mongoose.connection.close();
  Database = "FinancialServices_Database";
  const DebitCardSchema = require("../model/FinancialServicesDB");
  await checkConnection(Database);

  const cvv = GenerateCvv();
  const cardNo = GenerateDebitCardNo();
  const expiryDate = new Date(2027, 8, 1);

  const secondDocumentId = new mongoose.Types.ObjectId(data[0]._id);

  const cardIssue = new DebitCardSchema({
    _id: secondDocumentId,
    CVV: cvv,
    DebitCardNumber: cardNo,
    ExpiryDate: expiryDate,
    Email: sessionEmail,
    DigitalSignature: data[0].RandomString,
    CardIssuer: "Transact Bank ltd",
    DebitCardPIN: data[0].PIN,
    FirstName:formData.FirstName,
    LastName: formData.LastName,
    Mobile: formData.Mobile,
    AccountNo: formData.AccountNo,
  });

  await cardIssue.save().then(data => console.log("New debit card isssue data : ", data)).catch((e) => console.log("Error : ", e));

  return response.status(200).send({ msg: "API test successfully" });
};


exports.fetchCardDetails = async (request, response) => {

  const { sessionEmail } = request.body;

  await mongoose.connection.close();
  Database = "FinancialServices_Database";
  const DebitCardSchema = require("../model/FinancialServicesDB");
  await checkConnection(Database);

  const data = await DebitCardSchema.find({ Email: sessionEmail }, { DebitCardNumber: 1, ExpiryDate: 1, CVV: 1 });

  return response.status(200).send({ msg: "Fetch successfully", Data: data });

};