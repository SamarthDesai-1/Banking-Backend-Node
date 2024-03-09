const express = require("express");
const route = express.Router();
const controller = require("../controller/GetAllCustomerDataController");

route.get("/get-customer-data", controller.getCustomerData);

module.exports = route;