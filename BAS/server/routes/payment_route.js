const express = require('express');
const route = express.Router();
const controller = require("../controller/PaymentsController");

route.post("/payments", controller.settlePayment);

module.exports = route;