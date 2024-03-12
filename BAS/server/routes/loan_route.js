const express = require('express');
const route = express.Router();
const controller = require("../controller/LoanController");

route.post("/apply-loan", controller.applyLoan);

module.exports = route;