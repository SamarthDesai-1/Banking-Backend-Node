const mongoose = require('mongoose');
const checkConnection = require('../CheckConnections/CheckConnections');

exports.blockDebitCard = async (request, response) => {

  const { sessionEmail } = request.body;

  console.log("Email : ", sessionEmail);

  const updateStatus = async (sessionEmail) => {

    await mongoose.connection.close();
    const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
    await checkConnection("CustomerFinancials_Database");

    const data = await CustomerFinancialasData.updateOne({ Email: sessionEmail }, { $set : { DebitCard: "No issue" } }, { new: true });
    console.log(data);
  };
  await updateStatus(sessionEmail);

  const deleteData = async (sessionEmail) => {

    await mongoose.connection.close();
    const DebitCardSchema = require("../model/FinancialServicesDB");
    await checkConnection("FinancialServices_Database");

    const data = await DebitCardSchema.deleteOne({ Email: sessionEmail });
    console.log(data);
  };  
  await deleteData(sessionEmail);

  return response.status(200).send({ msg: "Block card successfully" });
};