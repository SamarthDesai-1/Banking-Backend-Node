const express = require("express");
const route = express.Router();
const verifyToken = require("../Token/VerifyToken");
const controller = require("../controller/FinancialServicesController");

route.post("/issue-debit-card", verifyToken, controller.issueCard);
route.post("/card-detail-fetcher", controller.fetchCardDetails);


module.exports = route;