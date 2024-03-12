const mongoose = require('mongoose');
const checkConnection = require("../CheckConnections/CheckConnections");

exports.getChartData = async (request, response) => {

  let ResponseData = [];

  await mongoose.connection.close();
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

  
  let zeroBased = 0;
  for (let i = start; i <= end; i++) {

    dateString = year.toString() + "-" + month.toString() + "-" + i.toString() + "";
    let userSpecifiedDate = new Date(dateString);

    console.log(userSpecifiedDate);

    // const data = await AccountStatusSchema.aggregate([
    
    //   { $unwind: "$TransactionHistory" }, 
    //   { $match: { "TransactionHistory.statementStatus": "Cr" } }, 
    //   {
    //     $addFields: {
    //       "TransactionHistory.date": {
    //         $dateToString: {
    //           format: "%Y-%m-%d",
    //           date: "$TransactionHistory.date"
    //         }
    //       }
    //     }
    //   },
    //   { $match: { "TransactionHistory.date": userSpecifiedDate.toISOString().substring(0, 10) } }, 
    //   {
    //     $group: {
    //       _id: null,
    //       date: { $first: year.toString() + "-" + month.toString() + "-" + zeroBased.toString() + "" }, 
    //       balance: { $first: bal[0].totalBalance },
    //       creditAmount: { $sum: "$TransactionHistory.transferAmount" },
    //     },
    //   },
    // ]);

    const data = await AccountStatusSchema.aggregate([
      { $unwind: "$TransactionHistory" },
      {
        $match: {
          $or: [ // Match either "Cr" or "Dr" transactions
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

  return response.status(200).send({ msg: "API testing", Data: ResponseData });
}

