const express = require('express');
const route = express.Router();
const controller = require("../controller/GetAllLoanDataController");

route.get("/get-loan-data", controller.getLoanData)

module.exports = route;
