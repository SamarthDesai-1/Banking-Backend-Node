const express = require("express");
const route = express.Router();
const controller = require("../controller/GetAllAccountDataController");

route.get("/get-account-data", controller.getAccountData);

module.exports = route;