const express = require("express");
const route = express.Router();
const verifyToken = require("../Token/VerifyToken");
const controller = require("../controller/TransferFundController");

route.post("/tranfer-funds", verifyToken, controller.transferFund);

module.exports = route;