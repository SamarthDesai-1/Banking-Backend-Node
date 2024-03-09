const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");
const UserContact = require("../model/ContactDB");

exports.getContactData = async (request, response) => {
  
  await mongoose.connection.close();
  let Database = "Contact_Database";
  await checkConnection(Database);

  const data = await UserContact.find({});
  console.log(data);

  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data });
};