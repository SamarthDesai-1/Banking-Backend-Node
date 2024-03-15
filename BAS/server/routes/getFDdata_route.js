const express = require("express");
const route = express.Router();
const controller = require("../controller/GetAllFDdataController");

route.get("/get-fd-data", controller.getFDdata);
route.get("/get-fd-data-status/:id", controller.getFDdataStatus);

module.exports = route;