const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");
const UserSignupSchema = require("../model/SignupDB");

exports.getSignupData = async (request, response) => {
  await mongoose.connection.close();

  const Database = "Signup_Database";
  await checkConnection(Database);

  const data = await UserSignupSchema.find({});

  console.log(data);

  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data });
};

