const express = require("express");
const route = express.Router();
const controller = require("../controller/GetAllContactData");

route.get("/get-contact-data", controller.getContactData);

module.exports = route;