const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");

exports.getFDdata = async (request, response) => {
  
  await mongoose.connection.close();
  const UserFD = require("../model/FixedDepositDB");
  let Database = "FixedDeposit_Database";
  await checkConnection(Database);
  
  const data = await UserFD.find({});
  console.log(data);
  
  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data });
};


exports.getFDdataStatus = async (request, response) => {
  
  const { id } = request.params;
  console.log(id);
  
  await mongoose.connection.close();
  const UserFD = require("../model/FixedDepositDB");
  let Database = "FixedDeposit_Database";
  await checkConnection(Database);
  
  const data = await UserFD.findOne({ AccountNo: id });
  console.log(data);

  await mongoose.connection.close();
  const UserLoan = require("../model/LoanDB");
  await checkConnection("Loan_Database");

  const loanData = await UserLoan.findOne({ AccountNo: id });

  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data, LoanData: loanData });

};