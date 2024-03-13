const express = require('express');
const route = express.Router();
const controller = require("../controller/LoanController");

route.post("/apply-loan", controller.applyLoan);
route.post("/reject-loan", controller.rejectLoan);
route.post("/exists-loan", controller.existsLoan); 
route.post("/approve-loan", controller.approveLoan); 


module.exports = route;