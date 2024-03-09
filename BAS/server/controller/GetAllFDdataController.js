const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");
const UserFD = require("../model/FixedDepositDB");

exports.getFDdata = async (request, response) => {

  await mongoose.connection.close();
  let Database = "FixedDeposit_Database";
  await checkConnection(Database);

  const data = await UserFD.find({});
  console.log(data);

  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data });
};