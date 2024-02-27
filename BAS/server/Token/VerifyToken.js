const JWT = require("jsonwebtoken");

const verifyToken = async (token, key) => {

  const boolean = false;

  JWT.verify(token, key, async (error, decode) => {
    
    if (error) 
      return boolean;
    
    else 
      return !boolean;

  });

};

module.exports = verifyToken;