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
    return response.status(404).send({ msg: "OTP is not valid try after some time" });
  }
  else {
    
    if (otp === OBJ.serverOTP) {
  
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
    else if (otp !== OBJ.serverOTP) {
      return response.status(402).send({ msg: "Invalid OTP" });
    }

  }


};
