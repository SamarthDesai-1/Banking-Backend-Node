const express = require("express");
const route = express.Router();
const controller = require("../controller/FixedDepositController");

/** API-1 to insert data in FD database */
route.post("/open-fd", controller.openFD);
route.post("/exists-fd", controller.existsFD);

module.exports = route;