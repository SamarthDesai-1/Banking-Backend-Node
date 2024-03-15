const mongoose = require('mongoose');
const checkConnection = require("../CheckConnections/CheckConnections");

exports.getLoanData = async (request, response) => {
  
  await mongoose.connection.close();
  const UserLoan = require("../model/LoanDB");
  await checkConnection("Loan_Database");

  const data = await UserLoan.find({});
  console.log(data);

  await mongoose.connection.close();
  let LoanStatus = require("../model/LoanStatusDB");
  await checkConnection("LoanStatus_Database");
  const statusData = await LoanStatus.find({}, { Status: 1 });
  console.log(statusData);

  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data, StatusData: statusData });
};