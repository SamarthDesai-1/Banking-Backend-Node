const express = require('express');
const route = express.Router();
const controller = require("../controller/GetAllChartDataController");

route.post("/get-data", controller.getChartData);

module.exports = route;
