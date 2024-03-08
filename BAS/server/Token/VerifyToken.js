const JWT = require("jsonwebtoken");

const verifyToken = (request, response, next) => {

  // console.log("Request body comming from frontend : ", request);

  let token = request.body.sessionToken;
  console.log("Request Body : ", request.body);
  console.log("Request Body email : ", request.body.sessionEmail);

  console.log("Token comming from frontend : ", token);

  if (token) {
    
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
    return response.status(402).send({ msg: "Please add token with header or kindly login to access financials" });
  }

  console.log("Random token : ", token);

};

module.exports = verifyToken;