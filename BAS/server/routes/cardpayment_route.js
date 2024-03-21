const express = require("express");
const verifyToken = require("../Token/VerifyToken");
const route = express.Router();
const controllerPayment = require("../controller/CardPaymentController");
const controllerSettlePayment = require("../controller/SettlePaymentController");


route.post("/create-checkout-session", verifyToken, controllerSettlePayment.settlePayment, controllerPayment.makePayment);


module.exports = route;