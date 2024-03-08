const mongoose = require("mongoose");
const GenerateCvv = require("../RandomPINS/Cvv");
const GenerateDebitCardNo = require("../RandomPINS/DebitCard");
const checkConnection = require("../CheckConnections/CheckConnections");

const OBJ = {
  validMobile: false,
  validAccontNo: false
};  

exports.issueCard = async (request, response) => {

  const { sessionEmail, formData } = request.body;

  console.log("Email : ", request.body.sessionEmail);

  await mongoose.connection.close();
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  Database = "CustomerFinancials_Database";
  await checkConnection(Database);


  const data = await CustomerFinancialasData.find({ Email: sessionEmail }, { _id: 1 , DigitalSignature: 1, PIN: 1, AccountNo: 1, Mobile: 1 });
  await CustomerFinancialasData.updateOne({ _id: data[0]._id }, { $set: { DebitCard: "Active" } }, { new: true });

  if (data[0].Mobile !== formData.Mobile) {
    return response.status(402).send({ msg: "Mobile number is invalid please add mobile number your are enter when fill create account form" });
  }
  if (data[0].AccountNo !== formData.AccountNo) {
    console.log(data[0].AccountNo);
    console.log(formData.AccountNo);
    return response.status(402).send({ msg: "Seems your account number type is not match retype the account no" });
  }
  else {
    
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
  
    let object = {};
    await cardIssue.save().then(data => {
      console.log("New debit card isssue data : ", data);
      object = data;
    }).catch((e) => console.log("Error : ", e));

    return response.status(200).send({ msg: "Data inserted successfully", Data: object });
  }


};

exports.fetchCardDetails = async (request, response) => {

  const { sessionEmail } = request.body;
  
  await mongoose.connection.close();
  Database = "FinancialServices_Database";
  await checkConnection(Database);
  const DebitCardSchema = require("../model/FinancialServicesDB");
  
  const data = await DebitCardSchema.find({ Email: sessionEmail }, { DebitCardNumber: 1, ExpiryDate: 1, CVV: 1 });

  return response.status(200).send({ msg: "Fetch successfully", Data: data });

};

