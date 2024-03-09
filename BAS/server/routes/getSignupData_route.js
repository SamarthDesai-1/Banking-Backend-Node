const express = require("express");
const route = express.Router();
const controller = require("../controller/GetAllSignupDataController");

route.get("/get-signup-data", controller.getSignupData);

module.exports = route;