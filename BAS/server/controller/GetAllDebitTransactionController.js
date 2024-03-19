const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");
const AccountStatusSchema = require("../model/AccountStatusDB");

exports.getDebitData = async (request, response) => {
  const { sessionEmail } = request.body;

  await mongoose.connection.close();
  let Database = "AccountStatus_Database";
  await checkConnection(Database);

  const data = await AccountStatusSchema.aggregate([
    { $match: { Email: sessionEmail } },

    { $unwind: "$TransactionHistory" },

    { $match: { "TransactionHistory.statementStatus": "Cr" } },

    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$TransactionHistory.transferAmount" },
      },
    },
  ]);

  const OBJ = data[0];
  console.log(OBJ);

  
  const balance = await AccountStatusSchema.find({ Email: sessionEmail }, { Balance: 1 });
  console.log("Balance : ", balance);
  
  const responseObject = {
    msg: "Data retrieved successfully",
    format: "Array of objects [{}]",
    Balance: balance[0].Balance,
    Cr: data.length > 0 ? data[0].totalAmount : 0,
  };
  console.log(responseObject);

  return response.status(200).send({ Data: responseObject });
};

