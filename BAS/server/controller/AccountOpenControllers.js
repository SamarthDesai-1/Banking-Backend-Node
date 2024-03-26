const checkConnection = require("../CheckConnections/CheckConnections");
const mongoose = require("mongoose");
const GenerateIFSC = require("../RandomPINS/GenerateIfsc");
const GenerateMICR = require("../RandomPINS/GenerateMicr");
const randomstring = require('randomstring');
const GenerateAccountNo = require("../RandomPINS/AccountNo");

const OBJ = {
  randomString: undefined,
  AccountNo: undefined
};

exports.openAccount = async (request, response) => {
  const UserSignupSchema = require("../model/SignupDB");
  let Database = "Signup_Database";
  await mongoose.connection.close();
  await checkConnection(Database);

  console.log("Request Body : ", request.body);

  console.log("............................................");
  console.log(request.body.sessionEmail);
  console.log("............................................");
  const userData = await UserSignupSchema.find({ Email: request.body.sessionEmail }).then(async data => {
    
    console.log("Data : ", data);
    
    const UserAccountOpenSchema = require("../model/AccountOpenDB");
    Database = "AccountOpen_Database";
    await mongoose.connection.close();
    await checkConnection(Database);
    
    
    let Photo = request.file.path;
    console.log("Request file : ", request.file);
    console.log("Image path : ", Photo);
    
    console.log("Account Number : ", data[0]._id);
    const secondDocumentId = new mongoose.Types.ObjectId(data[0]._id);

    const randomString = randomstring.generate();
    OBJ.randomString = randomString;
    console.log("Random string digital signature : ", randomString);

    OBJ.AccountNo = GenerateAccountNo();
    
    const newAccountUser = new UserAccountOpenSchema({
      _id: secondDocumentId, /* Account Number */
      FirstName: request.body.FirstName,
      LastName: request.body.LastName,
      AccountType: request.body.AccountType,
      Mobile: request.body.Mobile,
      PanCard: request.body.PanCard,
      AadharCard: request.body.AadharCard,
      Photo: request.file.path,
      Nominee: request.body.Nominee,
      NomineeAadharCard: request.body.NomineeAadharCard,
      Address: request.body.Address,
      MonthlyIncome: request.body.MonthlyIncome,
      IFSC: GenerateIFSC(),
      MICR: GenerateMICR(),
      Email: request.body.sessionEmail,
      DOB: request.body.DOB,
      DigitalSignature: randomString,
      AccountNo: OBJ.AccountNo,
      Date: Date.now()
  
    });
  
    /* Save user in database */
    await newAccountUser.save().then(async data => {

      console.log(data);

      /** save token in seperate server database */
      await mongoose.connection.close();
      const TokenSchema = require("../model/TokenDB");
      Database = "Token_DB";
      await checkConnection(Database);

      const newToken = new TokenSchema({ 
        _id: secondDocumentId,
        Email: request.body.sessionEmail,
        Randomstring: randomString,
        AccountNo: OBJ.AccountNo
      });

      await newToken.save().then(data => console.log(data));

      return response.status(200).send({ msg: `Acoount open successfully : ${request.body.sessionEmai}` });

    }).catch((e) => {

      return response.status(402).send({ error: e, msg: "Resolve the error fill the form properly." });

    });

    
    await mongoose.connection.close();

    
  }).catch(e => console.log(e));
  
};

exports.accountExists = async (request, response) => {

  const UserAccountOpenSchema = require("../model/AccountOpenDB");
  const Database = "AccountOpen_Database";
  await mongoose.connection.close();
  await checkConnection(Database);

  console.log("account exists : ", request.body.sessionEmail);

  await UserAccountOpenSchema.find({ Email: request.body.sessionEmail }).then(async data => {
    let boolean = data.length == 1 ? true : false; /* if true from server navigate to enter PIN page to access dashboard else if false navigate to accountopen page */
    console.log(boolean);

    await mongoose.connection.close();

    return response.status(200).send({ isExistsAccount: boolean });
  });

};


exports.fetchCustomerData = async (request, response) => {

  /** call Customer finance data API to fetch */

  await mongoose.connection.close();
  const UserAccountOpenSchema = require("../model/AccountOpenDB");
  Database = "AccountOpen_Database";
  await checkConnection(Database);

  let boolean = false;
  console.log("Email : ", request.body.sessionEmail);

  await UserAccountOpenSchema.find({ Email: request.body.sessionEmail }).then(async data => {

    boolean = !boolean;
    await mongoose.connection.close();
    return response.status(200).send({ Data: data, dataFetchStatus: boolean });

  }).catch((e) => console.log("Error : ", e));

};


exports.updateCustomerData = async (request, response) => {
  

  console.log(request);

  await mongoose.connection.close();
  const UserAccountOpenSchema = require("../model/AccountOpenDB");
  Database = "AccountOpen_Database";
  await checkConnection(Database);

  console.log(".................................................");
  console.log("Request Body update account data : ", request.body);
  console.log(".................................................");

  console.log("FirstName : ", request.body.FirstName);
  console.log("LastName : ", request.body.LastName);
  console.log("DOB : ", request.body.DOB);
  console.log("MonthlyIncome : ", typeof request.body.MonthlyIncome);

  let income = Number.parseInt(request.body.MonthlyIncome);
  console.log(income, "  ", typeof income);

  const image = request.file.path;
  console.log("File : ", image);

  /** update in account open schema */
  await UserAccountOpenSchema.updateOne({ Email: request.body.Email }, { $set: { 
    FirstName: request.body.FirstName,
    LastName: request.body.LastName,
    Photo: image,
    Address: request.body.Address,
    DOB: request.body.DOB,
    Mobile: request.body.Mobile,
    MonthlyIncome: request.body.MonthlyIncome,
    AadharCard: request.body.AadharCard,
    Nominee: request.body.Nominee,
    NomineeAadharCard: request.body.NomineeAadharCard,
    PanCard: request.body.PanCard,

  } }, { new: true });
  await mongoose.connection.close();


  /** customer bank details schema */
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  Database = "CustomerFinancials_Database";
  await checkConnection(Database);

  await CustomerFinancialasData.updateOne({ Email: request.body.Email }, { $set: { 
    FirstName: request.body.FirstName,
    LastName: request.body.LastName,
    Address: request.body.Address,
    DOB: request.body.DOB,
    Mobile: request.body.Mobile,
    MonthlyIncome: request.body.MonthlyIncome,
    AadharCard: request.body.AadharCard,
    Nominee: request.body.Nominee,
    NomineeAadharCard: request.body.NomineeAadharCard,
    PanCard: request.body.PanCard,  
    Photo: image

  } }, { new: true });
  await mongoose.connection.close();


  return response.status(200).send({ msg: "Success ok TEST API" });
};

