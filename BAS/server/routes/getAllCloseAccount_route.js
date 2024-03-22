const express = require('express');
const route = express.Router();
const controller = require("../controller/GetAllCloseAccountController");

route.get("/get-close-requests", controller.getCloseRequest);
route.post("/admin-request", controller.deleteAccount);
route.post("/exists-request", controller.getClosed);


module.exports = route;