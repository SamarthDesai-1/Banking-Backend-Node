const checkConnection = require("../CheckConnections/CheckConnections");
const mongoose = require("mongoose");
const GenerateIFSC = require("../RandomPINS/GenerateIfsc");
const GenerateMICR = require("../RandomPINS/GenerateMicr");


exports.openAccount = async (request, response) => {
  const UserSignupSchema = require("../model/SignupDB");
  let Database = "Signup_Database";
  await mongoose.connection.close();
  await checkConnection(Database);


  const userData = await UserSignupSchema.find({ Email: request.body.sessionEmail }).then(async data => {
    
    const UserAccountOpenSchema = require("../model/AccountOpenDB");
    Database = "AccountOpen_Database";
    await mongoose.connection.close();
    await checkConnection(Database);
    
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

      return response.status(402).send({ msg: "User account is already open", error: e });

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

  const UserAccountOpenSchema = require("../model/AccountOpenDB");
  Database = "AccountOpen_Database";
  await mongoose.connection.close();
  await checkConnection(Database);

  let boolean = false;

  await UserAccountOpenSchema.find({ Email: request.session.username }).then(data => {

    boolean = !boolean;
    return response.status(200).send({ Data: data, dataFetchStatus: boolean });

  }).catch(() => console.log("Error"));
  await mongoose.connection.close();

};

