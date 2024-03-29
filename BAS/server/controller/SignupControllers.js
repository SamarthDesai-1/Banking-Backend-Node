const generateOTP = require("../RandomPINS/GenerateOtp");
const sendEmail = require("../services/SendMailOTP");
const checkConnection = require("../CheckConnections/CheckConnections");
const mongoose = require("mongoose");

const OBJ = {
  serverOTP: undefined,
  SignupData: undefined
};

exports.validateUser = async (request, response) => {
  const UserSignupSchema = require("../model/SignupDB");
  const Database = "Signup_Database";
  await mongoose.connection.close();
  await checkConnection(Database);
  console.log(`Execute`);

  if (!request.body) {
    response.status(400).send({ msg: `Data not found or recevied` });
    return;
  }

  const newUserEmail = await UserSignupSchema.findOne({ Email: request.body.email });

  if (newUserEmail) {
    response.status(402).send({ msg: true });
    return;
  }

  const OTP = generateOTP(6);
  OBJ.SignupData = request.body;
  OBJ.serverOTP = OTP;

  setTimeout(() => {
    OBJ.serverOTP = null;
    console.log("sestimeout is executed for signup registration API");
  }, 60 * 3 * 1000);

  sendEmail(request, response, OTP);
  await mongoose.connection.close();

};


exports.verifyOTP = async (request, response) => {
  const UserSignupSchema = require("../model/SignupDB");
  const Database = "Signup_Database";
  await mongoose.connection.close();
  await checkConnection(Database);
  const { otp } = request.body;

  
  
  if (otp && OBJ.serverOTP === null) {

    console.log();
    console.log("Setimeout");
    console.log(otp);
    console.log(OBJ.serverOTP);
    console.log();
    console.log("otp && OBJ.serverOTP === null");
    console.log();

    return response.status(404).send({ msg: "Given OTP is unauthorized or expires time limit" });
  }

  if (otp === OBJ.serverOTP) {

    console.log();
    console.log("otp === OBJ.serverOTP");
    console.log();

    const newUser = new UserSignupSchema({
      FirstName: OBJ.SignupData.fname,
      LastName: OBJ.SignupData.lname,
      Email: OBJ.SignupData.email,
      Password: OBJ.SignupData.password,
    });
  
    /* Save user in database */
    await newUser.save().then((data) => console.log(data)).catch((error) => console.log(error));

    await mongoose.connection.close();
  
    return response.status(200).send({ msg: `Data inserted successfully` });
  }

  else {

    console.log(otp);
    console.log(OBJ.serverOTP);
      
    console.log();
    console.log("otp !== OBJ.serverOTP");
    console.log();

    return response.status(402).send({ msg: "Invalid OTP" });
  }
};

