const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");
const CustomerFinancialasData = require("../model/CustomerFinancialsDB");

exports.getCustomerData = async (request, response) => {

  await mongoose.connection.close();
  let Database = "CustomerFinancials_Database";
  await checkConnection(Database);

  const data = await CustomerFinancialasData.find({});
  console.log(data);

  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data });
};