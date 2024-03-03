const checkConnection = require("../CheckConnections/CheckConnections");
const mongoose = require("mongoose");
const GenerateIFSC = require("../RandomPINS/GenerateIfsc");
const GenerateMICR = require("../RandomPINS/GenerateMicr");


exports.openAccount = async (request, response) => {
  const UserSignupSchema = require("../model/SignupDB");
  let Database = "Signup_Database";
  await mongoose.connection.close();
  await checkConnection(Database);

  console.log("Request Body : ", request.body);

  console.log(request.body);
  console.log("............................................");
  console.log(request.body.sessionEmail);
  console.log("............................................");
  const userData = await UserSignupSchema.find({ Email: request.body.sessionEmail }).then(async data => {
    
    console.log("Data : ", data);
    
    const UserAccountOpenSchema = require("../model/AccountOpenDB");
    Database = "AccountOpen_Database";
    await mongoose.connection.close();
    await checkConnection(Database);
    
    
    console.log("--------------------------------");
    // const {FirstName, LastName, AccountType, Mobile, PanCard, AadharCard, Nominee, NomineeAadharCard, Address ,MonthlyIncome, sessionEmail, DOB } =request.body
    let Photo = request.file.path;
    console.log("Image path : ", Photo);
    // const eEmail = sessionEmail
    // console.log(eEmail);
    // const accountOpenn = new UserAccountOpenSchema({FirstName, LastName, AccountType, Mobile, PanCard, AadharCard, Photo, Nominee, NomineeAadharCard, Address ,MonthlyIncome,GenerateIFSC,GenerateMICR, eEmail, DOB})
    
    // const successsave = await accountOpenn.save();
    
    // console.log(successsave);
    
    console.log("Account Number : ", data[0]._id);
    const secondDocumentId = new mongoose.Types.ObjectId(data[0]._id);
    
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
      DOB: request.body.DOB

      // FirstName: request.body.fname,
      // LastName: request.body.lname,
      // AccountType: request.body.accounttype,
      // Mobile: request.body.mobile,
      // PanCard: request.body.pancard,
      // AadharCard: request.body.aadharcard,
      // Photo: request.file.path,
      // Nominee: request.body.nominee,
      // NomineeAadharCard: request.body.nomineeaadharcard,
      // Address: request.body.address,
      // MonthlyIncome: request.body.income,
      // IFSC: GenerateIFSC(),
      // MICR: GenerateMICR(),
      // Email: request.session.username,
      // DOB: request.body.dob
  
  });
  
    /* Save user in database */
    await newAccountUser.save().then(data => {

      console.log(data);
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

  await UserAccountOpenSchema.find({ Email: request.body.sessionEmail }).then(data => {

    boolean = !boolean;
    return response.status(200).send({ Data: data, dataFetchStatus: boolean });

  }).catch(() => console.log("Error"));
  await mongoose.connection.close();

};


exports.updateCustomerData = async (request, response) => {
  
  await mongoose.connection.close();
  const UserAccountOpenSchema = require("../model/AccountOpenDB");
  Database = "AccountOpen_Database";
  await checkConnection(Database);

  console.log(".................................................");
  console.log("Request Body update account data : ", request.body);
  console.log(".................................................");

  console.log("FirstName : ", request.body.data.FirstName);
  console.log("LastName : ", request.body.data.LastName);
  console.log("DOB : ", request.body.data.DOB);
  console.log("MonthlyIncome : ", typeof request.body.data.MonthlyIncome);

  let income = Number.parseInt(request.body.data.MonthlyIncome);
  console.log(income, "  ", typeof income);

  console.log("Data : ", request.body.data);

  /** update in account open schema */
  await UserAccountOpenSchema.updateOne({ Email: request.body.sessionEmail }, { $set: { 
    FirstName: request.body.data.FirstName,
    LastName: request.body.data.LastName,
    Address: request.body.data.Address,
    DOB: request.body.data.DOB,
    Mobile: request.body.data.Mobile,
    MonthlyIncome: request.body.data.MonthlyIncome,
    AadharCard: request.body.data.AadharCard,
    Nominee: request.body.data.Nominee,
    NomineeAadharCard: request.body.data.NomineeAadharCard,
    PanCard: request.body.data.PanCard,

  } }, { new: true });
  await mongoose.connection.close();


  /** customer bank details schema */
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  Database = "CustomerFinancials_Database";
  await checkConnection(Database);

  await CustomerFinancialasData.updateOne({ Email: request.body.sessionEmail }, { $set: { 
    FirstName: request.body.data.FirstName,
    LastName: request.body.data.LastName,
    Address: request.body.data.Address,
    DOB: request.body.data.DOB,
    Mobile: request.body.data.Mobile,
    MonthlyIncome: request.body.data.MonthlyIncome,
    AadharCard: request.body.data.AadharCard,
    Nominee: request.body.data.Nominee,
    NomineeAadharCard: request.body.data.NomineeAadharCard,
    PanCard: request.body.data.PanCard,  

  } }, { new: true });
  await mongoose.connection.close();


  return response.status(200).send({ msg: "Success ok TEST API" });
};

