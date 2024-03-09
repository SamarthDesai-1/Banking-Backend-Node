const express = require("express");
const route = express.Router();
const controller = require("../controller/GelAllTransactionDataController");

route.get("/get-transactionr-data/:id", controller.getTransactionData);

module.exports = route;