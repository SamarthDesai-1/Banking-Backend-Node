const express = require('express');
const route = express.Router();
const controller = require("../controller/CloseAccountController");

route.post("/close-account", controller.closeAccount)

module.exports = route;
