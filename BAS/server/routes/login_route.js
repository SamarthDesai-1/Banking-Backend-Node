const express = require("express");
const controller = require("../controller/LoginControllers");
const JWT = require("jsonwebtoken");
const verifyToken = require("../Token/VerifyToken");

const route = express.Router();


route.post("/login", controller.validateUser);


route.post("/forget-password", /** Token verification cannot be possible at here */ controller.forgetPassword); 

route.post("/reset-password", /** Token verification cannot be possible at here */ controller.resetPassword); 

route.post("/reset-password-otp", /** Token verification cannot be possible at here */ controller.otpPassword); 


route.get("/profile", controller.verifyUser);


module.exports = route;