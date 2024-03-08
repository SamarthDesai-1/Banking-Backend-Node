const express = require("express");
const route = express.Router();
const verifyToken = require("../Token/VerifyToken");
const controller = require("../controller/FinancialServicesController");

route.post("/issue-debit-card", verifyToken, controller.issueCard);
route.post("/card-detail-fetcher", verifyToken, controller.fetchCardDetails);
route.post("/update-card-detail-fetcher", verifyToken, controller.updateCardDetails);


module.exports = route;