const JWT = require("jsonwebtoken");


const verifyToken = async (request, response, next) => {


  let token = request.body.sessionToken;
  console.log("Request Body : ", request.body);
  console.log("Request Body email : ", request.body.sessionEmail);

  console.log("Token comming from frontend : ", token);

  if (token) {
    console.log("Token without bearer : ", token);

    JWT.verify(token, process.env.SECRET_KEY, (error, valid) => {

      if (error) {
        response.status(402).send({ msg: "Please provide valid token with header" });
      }
      else {
        next();
      }

    });

    let x = process.env.SECRET_KEY;
    console.log("PORT number from .ENV file : ", x);

  }
  else {
    return response.status(402).send({ msg: "Please add token with header or kindly login to access My Account" });
  }

  console.log("Random token : ", token);

};

module.exports = verifyToken;