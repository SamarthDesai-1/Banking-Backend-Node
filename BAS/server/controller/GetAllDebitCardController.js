const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");
const DebitCardSchema = require("../model/FinancialServicesDB");

exports.getDebitCardData = async (request, response) => {
  await mongoose.connection.close();

  let Database = "FinancialServices_Database";
  await checkConnection(Database);

  const data = await DebitCardSchema.find({});
  console.log(data);
  
  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data });
};