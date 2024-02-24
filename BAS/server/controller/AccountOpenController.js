const checkConnection = require("../CheckConnections/CheckConnections");
const mongoose = require("mongoose");
const GenerateIFSC = require("../RandomPINS/GenerateIfsc");
const GenerateMICR = require("../RandomPINS/GenerateMicr");


exports.openAccount = async (request, response) => {

  const UserSignupSchema = require("../model/SignupDB");
  let Database = "Signup_Database";
  await mongoose.connection.close();
  await checkConnection(Database);

  const userData = await UserSignupSchema.find({ Email: request.session.username }).then(async data => {
    console.log(data);

    const UserAccountOpenSchema = require("../model/AccountOpenDB");
    Database = "AccountOpen_Database";
    await mongoose.connection.close();
    await checkConnection(Database);

    console.log(data);
    console.log("Account Number : ", data[0]._id);
    const secondDocumentId = new mongoose.Types.ObjectId(data[0]._id);

    const newAccountUser = new UserAccountOpenSchema({
      _id: secondDocumentId, /* Account Number */
      FirstName: request.body.fname,
      LastName: request.body.lname,
      AccountType: request.body.accounttype,
      Mobile: request.body.mobile,
      PanCard: request.body.pancard,
      AadharCard: request.body.aadharcard,
      Photo: request.body.photo,
      Nominee: request.body.nominee,
      Address: request.body.address,
      MonthlyIncome: request.body.income,
      IFSC: GenerateIFSC(),
      MICR: GenerateMICR(),
      Email: request.session.username
    });

    /* Save user in database */
    await newAccountUser.save().then(data => console.log(data)).catch(() => console.log("User already exists"));
    await mongoose.connection.close();

  }).catch(e => console.log(e));

  await mongoose.connection.close();

  return response.status(200).send({ msg: "Acoount open successfully" });

};

exports.accountExists = async (request, response) => {

  const UserAccountOpenSchema = require("../model/AccountOpenDB");
  const Database = "AccountOpen_Database";
  await mongoose.connection.close();
  await checkConnection(Database);
  console.log("account exists : ", request.session.username);
  await UserAccountOpenSchema.find({ Email: request.session.username }).then(async data => {
    let boolean = data.length == 1 ? true : false;
    console.log(boolean);

    await mongoose.connection.close();
    
    return response.status(200).send({ isExistsAccount: boolean });
  });
  
};