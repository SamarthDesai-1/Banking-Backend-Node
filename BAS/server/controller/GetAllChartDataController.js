const mongoose = require('mongoose');
const checkConnection = require("../CheckConnections/CheckConnections");

exports.getChartData = async (request, response) => {

  let ResponseData = [];

  // await mongoose.connection.close();
  const AccountStatusSchema = require("../model/AccountStatusDB");
  let Database = "AccountStatus_Database";
  await checkConnection(Database);

  const bal = await AccountStatusSchema.aggregate([
    {
      $group: {
        _id: null, 
        totalBalance: { $sum: "$Balance" } 
      }
    }
  ])

  let date = new Date(); 
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;

  let start = 1;
  let end = month % 2 == 1 ? 31 : 30;
  
  let dateString = undefined;

  
  const getDATA = async () => {
    let zeroBased = 0;
    for (let i = start; i <= end; i++) {

      dateString = year.toString() + "-" + month.toString() + "-" + i.toString() + "";
      let userSpecifiedDate = new Date(dateString);

      console.log(userSpecifiedDate);

      const data = await AccountStatusSchema.aggregate([
        { $unwind: "$TransactionHistory" },
        {
          $match: {
            $or: [ 
              { "TransactionHistory.statementStatus": "Cr" },
              { "TransactionHistory.statementStatus": "Dr" }
            ]
          }
        },
        {
          $addFields: {
            "TransactionHistory.date": {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$TransactionHistory.date"
              }
            }
          }
        },
        {
          $match: { "TransactionHistory.date": userSpecifiedDate.toISOString().substring(0, 10) }
        },
        {
          $group: {
            _id: null,
            date: { $first: year.toString() + "-" + month.toString() + "-" + zeroBased.toString() + "" },
            balance: { $first: bal[0].totalBalance },
            creditAmount: { $sum: { $cond: [{ $eq: ["$TransactionHistory.statementStatus", "Cr"] }, "$TransactionHistory.transferAmount", 0] } },
            debitCount: { $sum: { $cond: [{ $eq: ["$TransactionHistory.statementStatus", "Dr"] }, 1, 0] } },
            debitAmount: { $sum: { $cond: [{ $eq: ["$TransactionHistory.statementStatus", "Dr"] }, "$TransactionHistory.transferAmount", 0] } }
          }
        }
      ]);
      zeroBased++;
    
      console.log(data);

      if (data.length != 0) 
        ResponseData.push(data[0]);

      date.setDate(date.getDate() + 1);
    }
  };

  await getDATA();

  return response.status(200).send({ msg: "API testing", Data: ResponseData });
}

exports.getServiceData = async (request, response) => {

  const OBJ = {
    Users: undefined,
    DebitCardUsers: undefined,
    FDusers: undefined,
    LoanUsers: undefined
  };
  const ratioOBJ = {
    userPercent: undefined,
    debitPercent: undefined,
    fdPercent: undefined
  };

  await mongoose.connection.close();
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  let Database = "CustomerFinancials_Database";
  await checkConnection(Database);  
  
  let count = await CustomerFinancialasData.countDocuments({ DebitCard: "Active" });
  console.log("Number of users with active debit card:", count);
  
  OBJ.DebitCardUsers = count;
  
  await mongoose.connection.close();
  const UserFD = require("../model/FixedDepositDB");
  Database = "FixedDeposit_Database";
  await checkConnection(Database);  
  
  count = await UserFD.countDocuments();
  console.log("Number of users with active fixed deposit:", count);
  OBJ.FDusers = count;

  await mongoose.connection.close();
  const UserAccountOpenSchema = require("../model/AccountOpenDB");
  Database = "AccountOpen_Database";
  await checkConnection(Database);  
  
  count = await UserAccountOpenSchema.countDocuments();
  console.log("Number of users with active accounts:", count);
  OBJ.Users = count;

  ratioOBJ.userPercent = ((OBJ.Users - (OBJ.DebitCardUsers + OBJ.FDusers)) * 100) / OBJ.Users;
  ratioOBJ.debitPercent = (OBJ.DebitCardUsers * 100) / OBJ.Users;
  ratioOBJ.FDusers = (OBJ.FDusers * 100) / OBJ.Users;

  return response.status(200).send({ msg: "API testing", Data: ratioOBJ,  });
};

