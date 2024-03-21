const express = require('express');
const verifyToken = require("../Token/VerifyToken");
const route = express.Router();
const controller = require("../controller/BlockCardController");

route.post("/block-card", verifyToken, controller.blockDebitCard);

module.exports = route;