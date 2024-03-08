const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");

exports.fetchUser = async (request, response) => {

  const { sessionEmail } = request.body;
  let data = undefined;

  try {
    
    const AccountStatusSchema = require("../model/AccountStatusDB");
    let Database = "AccountStatus_Database";
    await checkConnection(Database);
  
    console.log("Connection is established");
  
    data = await AccountStatusSchema.find({ Email: sessionEmail });
    console.log("Data : ", data);
  }
  catch(error) {
    console.log(error);
  }


  return response.status(200).send({ msg: "Test fetch user", Data: data });

};