const express = require("express");
const controller = require("../controller/PinVerifyController");
const route = express.Router();
const verifyToken = require("../Token/VerifyToken");


route.post("/verify-pin", verifyToken, controller.verifyPIN);
route.post("/forget-pin", verifyToken, controller.forgetPIN);
route.post("/match-pin", verifyToken, controller.matchPIN);
route.post("/update-pin", verifyToken, controller.updatePIN);



module.exports = route;
