const checkConnection = require("../CheckConnections/CheckConnections");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const OBJ = {
  wantFetchAccountData: false,
  wantStorePIN: false
}

const getAccountOpenData = async (request) => {
  const UserAccountOpenSchema = require("../model/AccountOpenDB");
  let Database = "AccountOpen_Database";
  await mongoose.connection.close();
  await checkConnection(Database);
  try {
    const data = await UserAccountOpenSchema.find({ Email: request.body.sessionEmail });

    if (data) {
      await mongoose.connection.close();
      return data; 
    }
    else {
      console.log("Not found data");
      return;
    }
  }
  catch(e) {
    await mongoose.connection.close();
    console.log("Error : ", e);
  }
  return null;
}

exports.customerFinancialData = async (request, response) => {

  if (request.body.PIN !== undefined) { /** PIN is defined for ex: 9582 */
    OBJ.wantStorePIN = true; /** To store data in customer financial database */
    OBJ.wantFetchAccountData = true; /** Note fetch data from account open database */

    await getAccountOpenData(request).then(async data => {

      console.log("Account open data : ", data);

      return response.status(200).send({ msg: "Success Ok" });
    });
  }
  else if (request.body.PIN !== undefined && request.body.update) {
    /** Update PIN code here */

  }
  else {
    await mongoose.connection.close();
    const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
    Database = "CustomerFinancials_Database";
    await checkConnection(Database);

    try {
      const customerFinancialData = await CustomerFinancialasData.find({ Email: request.body.sessionEmail });
      console.log(customerFinancialData);
      if (customerFinancialData) {
        await mongoose.connection.close();
        return response.status(200).send({ data: customerFinancialData });
      }
    }
    catch(e) {
      await mongoose.connection.close();
      console.log("Failed to fetch the data : false");
    }
  }

  console.log("..................................................................");
  console.log(request.body);
  console.log("..................................................................");

};

