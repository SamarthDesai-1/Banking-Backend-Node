const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");
const generateOTP = require("../RandomPINS/GenerateOtp");
const sendMail = require("../services/SendMailResetPassword");

const incrementOBJ = {
  count: 0,
  tries: 3,
  isExecute: true
};

const OBJ = {
  OTP: undefined
};

exports.verifyPIN = async (request, response) => { 

  await mongoose.connection.close();
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  let Database = "CustomerFinancials_Database";
  await checkConnection(Database);

  if (incrementOBJ.isExecute) {
    try {
      console.log("Request Body PIN : ", request.body);
      const data = await CustomerFinancialasData.find({ Email: request.body.sessionEmail }).then(async data => {


        console.log("Server PIN : ", data[0].PIN);
        console.log("User PIn : ", request.body.PIN);
        
        if (data[0].PIN  === request.body.PIN) {
          await mongoose.connection.close();
          console.log("Both PIN matches");
          console.log("Data from customer database : ", data);
          return response.status(200).send({ msg: "Valid PIN welcome to dasboard or userprofile" });
        } 
        else {

          if (incrementOBJ.count < 3) {
            incrementOBJ.count++;
            return response.status(402).send({ msg: "PIN is invalid" });
          }

          console.log("IN ELSE STATEMENT");
          console.log(incrementOBJ.count);
          if (incrementOBJ.count === incrementOBJ.tries) {
            console.log("Tries : ", incrementOBJ);

            incrementOBJ.isExecute = false;
          
            setTimeout(() => {
              console.log("set time out is executed after 2 min");
              incrementOBJ.isExecute = true;
            }, 120000);

            incrementOBJ.count = 0;
            
            return response.status(402).send({ msg: "You are not authorized user access account after one hour" });
          }
        }
  
      });
      
    }
    catch(e) {
      console.log("Error : ", e);
    }
  
  }
  else {
    return response.status(402).send({ msg: "You are not authorized user access account after one minute" });
  }

  await mongoose.connection.close();
 
};


exports.forgetPIN = async (request, response) => {

  await mongoose.connection.close();
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  let Database = "CustomerFinancials_Database";
  await checkConnection(Database);

  const data = await CustomerFinancialasData.find({ Email: request.body.sessionEmail }).then(async data => {

    if (data.length == 1) {
      console.log("FORGET PIN when data.length == 1");

      OBJ.OTP = generateOTP(6);
      console.log("OBJ.OTP : ", OBJ.OTP);

      /* Expiry time of OTP */
      setTimeout(() => {

        OBJ.OTP = undefined;
        console.log("Settimeout is executed for forget PIN");

      }, 60 * 3 * 1000);

      await sendMail(data[0].Email, response, "", OBJ.OTP);

      await mongoose.connection.close();
      
      return response.status(200).send({ msg: "Please check your indox of mail and reset your password", process: true });
    }
    else {
      await mongoose.connection.close();
      return response.status(402).send({ msg: "Unauthorized user or you are not open an account with us" });
    }
    
  }).catch(e => console.log("Error : ", e));
};


exports.matchPIN = async (request, response) => {

  try {
    console.log(`PIN from client ${request.body.otp}`, "  ",` PIN of server ${OBJ.OTP}`);
  
    if (request.body.otp === OBJ.OTP) {
      return response.status(200).send({ msg: `PIN is authenticated successfully` });
    }
    return response.status(402).send({ msg: "Given PIN is unauthorized or expires time limit" });
    
  } catch (error) {
    return response.status(402).send({ error: error });
  }
};


exports.updatePIN = async (request, response) => {

  await mongoose.connection.close();
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  let Database = "CustomerFinancials_Database";
  await checkConnection(Database);

  const updateData = await CustomerFinancialasData.updateOne({ Email: request.body.sessionEmail }, { $set: { PIN: request.body.PIN } }, { new: true } );

  await mongoose.connection.close();
  return response.status(200).send({ msg: "PIN updated successfully" });

};