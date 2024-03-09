const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");
const UserAccountOpenSchema = require("../model/AccountOpenDB");

exports.getAccountData = async (request, response) => {

  await mongoose.connection.close();
  let Database = "AccountOpen_Database";
  await checkConnection(Database);

  const data = await UserAccountOpenSchema.find({});

  console.log(data);

  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data });
};