const express = require("express");
const controller = require("../controller/AccountOpenController");
const route = express.Router();
const multer = require("multer");


function getFileExtension(filename) {
  return filename.split('.').pop();
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (request, file, callBack) => {
      callBack(null, "./BAS/server/uploads")
    },
    fileFilter: (request, file, callBack) => {
        
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        
          return callBack(new Error('Only image files are allowed!'), false);
        }
        callBack(null, true);
    },
    filename: (request, file, callBack) => {
      const ext = getFileExtension(file.originalname);
      callBack(null, file.fieldname + "-" + Date.now() + "." + ext);
    }
  })
}).single("user_image");

route.post("/open-account", upload, controller.openAccount);
route.get("/account-exists", controller.accountExists);
route.get("/fetch-account-details", controller.fetchCustomerData);


module.exports = route;