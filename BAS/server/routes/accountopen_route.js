const express = require("express");
const controller = require("../controller/AccountOpenController");
const route = express.Router();

route.post("/open-account", controller.openAccount);
route.get("/account-exists", controller.accountExists);

module.exports = route;