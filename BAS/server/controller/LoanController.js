const mongoose = require('mongoose');
const checkConnection = require("../CheckConnections/CheckConnections");
const axios = require("axios");

exports.applyLoan = async (request, response) => {
  const { sessionEmail, formData } = request.body;

  await mongoose.connection.close();
  let LoanStatus = require("../model/LoanStatusDB");
  await checkConnection("LoanStatus_Database");

  await LoanStatus.deleteOne({ Email: sessionEmail });

  const getRandomDecimal = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  let amount = (4000000 * 12.95) / 100;
  console.log(amount);

  console.log(request.body);


  await mongoose.connection.close();
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  let Database = "CustomerFinancials_Database";
  await checkConnection(Database);
  
  const data = await CustomerFinancialasData.find({ Email: sessionEmail }, { _id: 1, Balance: 1, AadharCard: 1, PanCard: 1, AccountNo: 1 });

  console.log(data[0].AadharCard);
  console.log(data[0].PanCard);
  if (data[0].AadharCard !== formData.AadharCard) {
    return response.status(402).send({ msg: "Aadhar card does not match retype it." });
  }
  else if (data[0].PanCard !== formData.PanCard) {
    return response.status(402).send({ msg: "Pan card does not match retype it." });
  }

  await mongoose.connection.close();
  const UserLoan = require("../model/LoanDB");
  await checkConnection("Loan_Database");

  const secondDocumentId = new mongoose.Types.ObjectId(data[0]._id);
  const newUserLoan = new UserLoan({
    _id: secondDocumentId,
    Age: formData.Age,
    Balance: data[0].Balance,
    Profession: formData.Profession,
    MonthlyIncome: formData.MonthlyIncome,
    Reason: formData.Reason,
    Address: formData.Address,
    PanCard: data[0].PanCard,
    AadharCard: data[0].AadharCard,
    FirstName: formData.FirstName,
    LastName: formData.LastName,
    Employee: formData.flexRadioDefault,
    AccountNo: data[0].AccountNo,
    interest: getRandomDecimal(9, 13).toFixed(2),
    Email: sessionEmail,
    LoanAmount: Number.parseInt(formData.Amount),
    LoanTimePeriod: formData.Years
  });

  /** save the use */
  await newUserLoan.save().then(data => console.log(data)).catch((e) => console.log(e));

  await mongoose.connection.close();
  LoanStatus = require("../model/LoanStatusDB");
  await checkConnection("LoanStatus_Database");
  
  const newLoanStatus = new LoanStatus({
    _id: secondDocumentId,
    AccountNo: data[0].AccountNo,
    Email: sessionEmail,
  });

  await newLoanStatus.save().then((data) => console.log(data)).catch((e) => console.log(e));

  return response.status(200).send({ msg: "API testing", Data: data });
};


exports.rejectLoan = async (request, response) => {

  const { id } = request.body;

  await mongoose.connection.close();
  const UserLoan = require("../model/LoanDB");
  await checkConnection("Loan_Database");

  const data = await UserLoan.deleteOne({ _id: id });
  console.log(data);

  await mongoose.connection.close();
  const LoanStatus = require("../model/LoanStatusDB");
  await checkConnection("LoanStatus_Database");

  await LoanStatus.updateOne({ _id: id }, { $set: { Status: "Rejected" } });

  return response.status(200).send({ msg: "API testing" });
};

exports.existsLoan = async (request, response) => {

  let OBJ = {};

  const { sessionEmail } = request.body;
  console.log(request.body);

  console.log("exists loan api call");

  await mongoose.connection.close();
  const LoanStatus = require("../model/LoanStatusDB");
  await checkConnection("LoanStatus_Database");

  const data = await LoanStatus.find({ Email: sessionEmail }, { Status: 1 });
  console.log(data);

  await mongoose.connection.close();
  const UserLoan = require("../model/LoanDB");
  await checkConnection("Loan_Database");
  if (data.length != 0 && data[0].Status == "Approved") {
    const data = await UserLoan.find({ Email: sessionEmail });
    OBJ = data;
  }
  else if (data.length != 0 && data[0].Status == "Rejected") {
    const data = await UserLoan.find({ Email: sessionEmail });
    OBJ = data;
  }

  return response.status(200).send({ msg: "Ok", Data: data, OBJdata: OBJ });

};

exports.approveLoan = async (request, response) => {
  const { id, amount, year, rate } = request.body;
  
  await mongoose.connection.close();
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  await checkConnection("CustomerFinancials_Database");

  const balance = await CustomerFinancialasData.aggregate([
    {
      $group: {
        _id: null,
        totalBalance: { $sum: "$Balance" }
      }
    }
  ]);

  if (balance[0].Balance > amount) {
    return response.status(402).send({ msg: "Bank not have enough funds avaliable right now" });
  }

  /** Approve loan only one time */
  await mongoose.connection.close();
  const UserLoan = require("../model/LoanDB");
  await checkConnection("Loan_Database");

  const isApprove = await UserLoan.find({ _id: id }, { LoanInfo: 1 });
  console.log(isApprove[0].LoanInfo.length);

  if (isApprove[0].LoanInfo.length == 1) {
    return response.status(402).send({ msg: "Already loan is approved to customer" });
  }

  console.log(request.body);

  const totalLoanAmount = amount;
  const loanAmountAfterInterst = ((amount * rate) / 100); /** rate on loan amount */
  const totalLoanAmountReceviedYears = loanAmountAfterInterst * year; /** rate amount * years */
  const userPayAmount = totalLoanAmountReceviedYears + amount;

  const forOneYear = (userPayAmount / 12);
  const installment = (forOneYear / year);

  console.log(loanAmountAfterInterst);
  console.log(totalLoanAmountReceviedYears);
  console.log(userPayAmount);
  console.log(forOneYear);
  console.log(installment);
  console.log(amount);

  const date = new Date();
  
  const formatDate = date.toISOString().substring(0, 10);
  console.log(formatDate);

  const processDate = new Date(formatDate);

  const OBJ = {
    StartingDate: formatDate,
    EndingDate: (processDate.getFullYear() + year) + "-" + formatDate.substring(5), 
    Amount: amount,
    loanAmountAfterInterst: loanAmountAfterInterst,
    totalLoanAmountReceviedYears: totalLoanAmountReceviedYears,
    userPayAmount: userPayAmount,
    forOneYear: forOneYear,
    installment: installment
  };

  console.log(OBJ);

  console.log(id);

  const data = await UserLoan.updateOne({ _id: id }, { $set: { Status: "Approved" }, $push: { LoanInfo: OBJ } }).catch((e) => console.log(e));
  console.log(data);

  await mongoose.connection.close();
  const LoanStatus = require("../model/LoanStatusDB");
  await checkConnection("LoanStatus_Database");

  await LoanStatus.updateOne({ _id: id }, { $set: { Status: "Approved" } });

  /** transfer loan amount from bank account to customer account */
  const bankAmount = await axios.post("http://localhost:5000/test/api/users/get-bank-amount").then(async (data) => {
    console.log("Bank Amount : ", data.data.Data);

    await mongoose.connection.close();
    const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
    await checkConnection("CustomerFinancials_Database");

    const balance = await CustomerFinancialasData.find({ _id: id }, { Balance: 1 });
    console.log(balance);
    await CustomerFinancialasData.updateOne({ _id: id }, { $set: { Balance: balance[0].Balance + amount } });
    
    await mongoose.connection.close();
    const AccountStatusSchema = require("../model/AccountStatusDB");
    await checkConnection("AccountStatus_Database");
    
    const obj = {
      date: new Date(),
      transferAmount: amount,
      senderAccountNo: "Loan Amount",
      recevierAccountNo: "65d6c4999de62fa480c6c404",
      status: "success",
      statementStatus: "Cr",
      msg: "Loan Recevied"
    };
    
    await AccountStatusSchema.updateOne(
      { _id: id }, 
      { 
        $set: { Balance: balance[0].Balance + amount }, 
        $push: { TransactionHistory: [obj] } 
      }
    );

  });

  
  return response.status(200).send({ msg: "API testing", Date: OBJ });
};
