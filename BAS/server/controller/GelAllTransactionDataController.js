const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");
const AccountStatusSchema = require("../model/AccountStatusDB");

exports.getTransactionData = async (request, response) => {

  await mongoose.connection.close();
  const { id } = request.params;
  let Database = "AccountStatus_Database";
  await checkConnection(Database);

  const data = await AccountStatusSchema.find({ _id: id });
  console.log(data);
  
  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data });
}