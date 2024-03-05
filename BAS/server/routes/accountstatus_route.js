const express = require("express");
const route = express.Router();
const verifyToken = require("../Token/VerifyToken");
const controller = require("../controller/AccountStatusController");

route.post("/add-funds", verifyToken, controller.addFunds);
route.post("/withdraw-funds", verifyToken, controller.withdrawFunds);

module.exports = route;