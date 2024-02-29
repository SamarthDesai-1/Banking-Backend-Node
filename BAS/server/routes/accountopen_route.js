const express = require("express");
const controller = require("../controller/AccountOpenControllers");
const route = express.Router();
const multer = require("multer");
const verifyToken = require("../Token/VerifyToken");
const path = require("path");


function getFileExtension(filename) {
  return filename.split('.').pop();
}

const upload = multer({
  storage: multer.diskStorage({
    destination: async (request, file, callBack) => {

      // callBack(null, path.join(__dirname, "./uploads"))
      // const destinationPath = path.join(__dirname, "BAS/server/uploads");

      callBack(null, "./uploads")
    },
    fileFilter: async (request, file, callBack) => {
        
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        
          return callBack(new Error('Only image files are allowed!'), false);
        }
        callBack(null, true);
    },
    filename: async (request, file, callBack) => {
      const ext = getFileExtension(file.originalname);
      console.log("\n");
      console.log("Inside multer middleware : ", file.originalname);
      callBack(null, file.fieldname + "-" + Date.now() + "." + ext);
    }
  })
});

route.post("/open-account", upload.single('Photo'), controller.openAccount);
route.post("/account-exists", verifyToken, controller.accountExists);

route.get("/fetch-account-details", controller.fetchCustomerData);


module.exports = route;
