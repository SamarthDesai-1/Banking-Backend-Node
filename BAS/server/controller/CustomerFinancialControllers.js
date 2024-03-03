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
      console.log("PIN : ", request.body.PIN);

      /** Data insreted successfully */
      await mongoose.connection.close();
      const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
      Database = "CustomerFinancials_Database";
      await checkConnection(Database);

      console.log("Account Number : ", data[0]._id);
      const secondDocumentId = new mongoose.Types.ObjectId(data[0]._id);

      const newCustomerData = new CustomerFinancialasData({
        _id: secondDocumentId,
        Email: data[0].Email,
        IFSC: data[0].IFSC,
        MICR: data[0].MICR,
        MonthlyIncome: data[0].MonthlyIncome,
        Photo: data[0].Photo,
        PanCard: data[0].PanCard,
        AadharCard: data[0].AadharCard,
        FirstName: data[0].FirstName,
        LastName: data[0].LastName,
        Mobile: data[0].Mobile,
        PIN: request.body.PIN,
        AccountType: data[0].AccountType,
        Balance: request.body.Balance === undefined ? 0 : request.body.Balance,
        MinimumBalance: request.body.MinimumBalance === undefined ? 0 : request.body.MinimumBalance,
        Loan: request.body.Loan === "" ? "null" :  request.body.Loan,
        CreditCard: request.body.CreditCard === undefined ? "No issue" : request.body.CreditCard,
        DebitCard: request.body.DebitCard === undefined ? "No issue" : request.body.DebitCard
      });

      /* Save user in database */
      await newCustomerData.save().then(data => {

        console.log(data);
        return response.status(200).send({ msg: `Data inserted successfully in customer financial database : ${request.body.sessionEmai}` });

      }).catch((e) => {

        return response.status(402).send({ error: e, msg: "Resolve the error fill the form properly." });

      });

      await mongoose.connection.close();

    }).catch(e => console.log("Error : ", e));
  }
  else {
    console.log("Customer financial data call");
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
   // else if (request.body.PIN !== undefined && request.body.update) {
  //   /** Update PIN code here */

  // }

  console.log("..................................................................");
  console.log(request.body);
  console.log("..................................................................");

};

