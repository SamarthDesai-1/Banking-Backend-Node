const express = require("express");
const verifyToken = require("../Token/VerifyToken");
const route = express.Router();
const controller = require("../controller/FetchController");

route.post("/transaction-history", verifyToken, controller.fetchUser);

module.exports = route;