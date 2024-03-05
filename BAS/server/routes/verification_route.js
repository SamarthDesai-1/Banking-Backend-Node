const express = require("express");
const route = express.Router();
const verifyToken = require("../Token/VerifyToken");
const controller = require("../controller/VerifyController");

route.post("/verification", verifyToken, controller.authorize);

module.exports = route;