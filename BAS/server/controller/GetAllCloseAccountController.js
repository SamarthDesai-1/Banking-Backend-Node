const mongoose = require('mongoose');
const checkConnection = require("../CheckConnections/CheckConnections");
const AccountCloseSchema = require("../model/CloseAccountDB");

exports.getCloseRequest = async (request, response) => {

  await mongoose.connection.close();
  let Database = "CloseAccount_Database";
  await checkConnection(Database);

  const data = await AccountCloseSchema.find({});
  console.log(data);

  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data });
  
};


exports.getClosed = async (request, response) => {

  const { sessionEmail } = request.body;

  await mongoose.connection.close();
  let Database = "CloseAccount_Database";
  await checkConnection(Database);

  const data = await AccountCloseSchema.find({ Email: sessionEmail }, { Status: 1 });
  console.log(data);

  if (data[0].Status === "Pending") 
    return response.status(402).send({ msg: "first fill the form to close account then check status" })

  return response.status(200).send({ msg: data });
};


// exports.deleteAccount = async (request, response) => {

//   const { id, status } = request.body;

//   await mongoose.connection.close();
//   let Database = "CloseAccount_Database";
//   await checkConnection(Database);

//   const data = await AccountCloseSchema.updateOne({ AccountNo: id }, { $set: { Status: "" } })
// };