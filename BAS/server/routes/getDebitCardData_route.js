const express = require("express");
const route = express.Router();
const controller = require("../controller/GetAllDebitCardController");

route.get("/get-debit-card-data", controller.getDebitCardData);

module.exports = route;