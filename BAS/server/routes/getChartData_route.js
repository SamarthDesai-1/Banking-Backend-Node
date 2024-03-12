const express = require('express');
const route = express.Router();
const controller = require("../controller/GetAllChartDataController");

route.post("/get-data", controller.getChartData);
route.post("/get-service", controller.getServiceData);

module.exports = route;
