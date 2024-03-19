const express = require("express");
const route = express.Router();
const controller = require("../controller/GetAllDebitTransactionController");

route.post("/get-debit-data", controller.getDebitData);

module.exports = route;
