const express = require("express");
const expressValidator = require('express-validator');
const { expressionEmail, expressionPassword } = require('../validation/RegularExpression');
const controller = require("../controller/LoginControllers");

const route = express.Router();

const verifyArray = [
  expressValidator.body("email").isString().notEmpty().matches(expressionEmail),
  expressValidator.body("password").isString().notEmpty().matches(expressionPassword),
];


route.post("/login", controller.validateUser);


route.post("/forget-password", controller.forgetPassword); 

route.get("/reset-password", controller.resetPassword); 


route.get("/profile", controller.verifyUser);


module.exports = route;