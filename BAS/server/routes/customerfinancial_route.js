const express = require("express");
const controller = require("../controller/CustomerFinancialControllers");
const route = express.Router();
const verifyToken = require("../Token/VerifyToken");

route.post("/customer-finance", verifyToken, controller.customerFinancialData);

module.exports = route;
