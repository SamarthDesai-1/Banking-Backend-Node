const bcrypt = require('bcryptjs');
const JWT = require("jsonwebtoken");
const randomstring = require('randomstring');
const sendMail = require("../services/SendMailResetPassword");
const checkConnection = require("../CheckConnections/CheckConnections");
const mongoose = require("mongoose");
const generateOTP = require("../RandomPINS/GenerateOtp");
const verifyToken = require("../Token/VerifyToken");

const key = process.env.SECRET_KEY;

const OBJ = {
  OTP: undefined
};

function generateToken(request) {
  const userOBJ = {
    email: request.body.email,
    password: request.body.password
  };

  return JWT.sign({ userOBJ }, key);
}

exports.validateUser = async (request, response) => {
  const UserSignupSchema = require("../model/SignupDB");
  const Database = "Signup_Database";
  await mongoose.connection.close();
  await checkConnection(Database);
  await UserSignupSchema.find({ Email: request.body.email }).then(data => {
    if (data.length == 1) {

      bcrypt.compare(request.body.password, data[0].Password, (error, result) => {

        if (error) {
          console.log(error);
          return response.status(402).send({ msg: "error occured", error: error });
        }

        if (result) {
          console.log(`Valid user, welcome to transact`);

          const token = generateToken(request);
          response.setHeader('Authorization', `Bearer ${token}`);


          /* After complete testing API remove below both lines and all cookie variables */
          response.cookie("Name", token);
          response.cookie("Email", request.body.email);

          /* Create user session */
          request.session.username = request.body.email;
          console.log("Login Email using session : ", request.session.username);

          return response.status(200).send({ msg: "Cookie set successfully", Token: token, Email: request.body.email });
        }
        else {
          console.log(`Invalid password`);
          return response.status(402).send({ msg: "Invalid password" });
        }

      });
    }
    else {
      response.status(404).send({ msg: "User not found" });
    }
  });
  await mongoose.connection.close();
};

/* Just build for demo to authenticate user token with JWT.verify for testing purpose to HOME page */
exports.verifyUser = (request, response) => {

  const cookieValue = request.cookies.Name;
  console.log("Cookie value : ", cookieValue);

  try {
    JWT.verify(cookieValue, key, (error, decode) => {

      if (error) {
        return response.status(401).send({ error: "Unauthorized: Invalid token" });
      }
      else {

        request.session.username = request.cookies.Email;
        console.log("from verifyUser function : ", request.session.username);
        // response.cookie("Email", null, { expires: new Date(0) });

        return response.send({ msg: `Welcome to the home page : ${request.session.username}`, Session: request.session.username });
      }
    });
  } catch (error) {
    return response.status(401).send({ error: "Please authenticate a valid token" });
  }

};

exports.forgetPassword = async (request, response) => {

  /* Access session value to update only password of session email no one else can update any other individuals passwords */

  /* Token verfication is remaining on all API's first test token in this API */

  const UserSignupSchema = require("../model/SignupDB");
  const Database = "Signup_Database";
  await mongoose.connection.close();
  await checkConnection(Database);

  const email = request.body.email;
  const user = await UserSignupSchema.find({ Email: email }).then(async data => {

    console.log(data);

    if (data.length == 1) {
      console.log("when data.length == 1");

      console.log("verify token execute successfully");
    
      console.log("if statement execute");
      const randomString = randomstring.generate();

      const update = async (randomString, email) => {
        await UserSignupSchema.updateOne({ Email: email }, { $set: { Token: randomString } });

        console.log(`data updated successfully`);
      }

      await update(randomString, data[0].Email);

      OBJ.OTP = generateOTP(6);

      /* Expiry time of OTP */
      setTimeout(() => {

        OBJ.OTP = undefined;
        console.log("Settimeout is executed");

      }, 60 * 2 * 1000);

      await sendMail(data[0].Email, response, randomString, OBJ.OTP);

      return response.status(200).send({ msg: "Please check your indox of mail and reset your password", RandomString: randomString });
      
    }
    else {
      return response.status(402).send({ msg: "Not found email ID", isMailFound: true });
    }

  }).catch(error => {
    console.log(error);
    return response.status(402).send({ success: true, msg: `${error.message} this email not exists` });
  });

  await mongoose.connection.close();
};

exports.resetPassword = async (request, response) => {

  const UserSignupSchema = require("../model/SignupDB");
  const Database = "Signup_Database";
  await mongoose.connection.close();
  await checkConnection(Database);

  try {

    const token = request.body.tokenString;
    console.log("Reset password token : ", token);

    await UserSignupSchema.find({ Token: token }).then(async data => {
      if (data.length == 1) {
        const password = request.body.password;

        const passwordHASH = async (newPassword) => {
          const hashPassword = await bcrypt.hash(newPassword, 12);
          return hashPassword;
        }
        const newPassword = await passwordHASH(password);

        await UserSignupSchema.findByIdAndUpdate(data[0]._id, { $set: { Password: newPassword, Token: '' } }, { new: true });

        await mongoose.connection.close();

        response.status(200).send({ success: true, msg: "User password has been reset", data: data });
      }
      else {
        response.status(402).send({ success: true, msg: "This link has been expires" });
        await mongoose.connection.close();
      }
      await mongoose.connection.close();
    });
  }
  catch (error) {
    return response.status(402).send({ msg: error.message });
  }

};

exports.otpPassword = async (request, response) => {

  try {
    console.log(`OTP from client ${request.body.otp}`, "  ",` OTP of server ${OBJ.OTP}`);
  
    if (request.body.otp === OBJ.OTP) {
      return response.status(200).send({ msg: `OTP is authenticated successfully` });
    }
    return response.status(402).send({ msg: "Given OTP is unauthorized or expires time limit" });
    
  } catch (error) {
    return response.status(402).send({ error: error });
  }

};  