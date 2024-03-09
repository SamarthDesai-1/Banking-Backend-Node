const express = require("express");
const route = express.Router();
const controller = require("../controller/GetAllFDdataController");

route.get("/get-fd-data", controller.getFDdata);

module.exports = route;