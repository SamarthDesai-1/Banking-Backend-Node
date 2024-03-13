const mongoose = require('mongoose');
const checkConnection = require("../CheckConnections/CheckConnections");

const OBJ = {
  TotalDeposits: undefined,
  LoanApproved: false,
  TotalLoanAmountWithInterest: undefined,
};

// const funds = async () => {

  // const getRandomDecimal = (min, max) => {
  //   return Math.random() * (max - min) + min;
  // }

//   await mongoose.connection.close();
//   const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
//   await checkConnection("CustomerFinancials_Database");

//   const balance = await CustomerFinancialasData.aggregate([
//     {
//       $group: {
//         _id: null,
//         totalBalance: { $sum: "$Balance" }
//       }
//     }
//   ]);

//   OBJ.TotalDeposits = balance[0].totalBalance;

//   /** 500000 is static change yo dynamic */
  
//   if (500000 < OBJ.TotalDeposits) {
//     OBJ.LoanApproved = true;
//     const TotalLoanAmount = ((500000 * randomNumber) / 100);
    // const randomNumber = getRandomDecimal(9, 13);
    // console.log(randomNumber.toFixed(2));
//   }
  
// };

exports.applyLoan = async (request, response) => {

  const getRandomDecimal = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  let amount = (4000000 * 12.95) / 100;
  console.log(amount);

  console.log(request.body);

  const { sessionEmail, formData } = request.body;

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
    LoanAmount: Number.parseInt(formData.Amount)
  });

  /** save the use */
  await newUserLoan.save().then(data => console.log(data)).catch((e) => console.log(e));

  return response.status(200).send({ msg: "API testing", Data: data });
};


exports.rejectLoan = async (request, response) => {

  const { id } = request.body;

  await mongoose.connection.close();
  const UserLoan = require("../model/LoanDB");
  await checkConnection("Loan_Database");

  const data = await UserLoan.deleteOne({ _id: id });
  console.log(data);

  return response.status(200).send({ msg: "API testing" });
};