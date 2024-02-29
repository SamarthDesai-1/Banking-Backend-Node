const checkConnection = require("../CheckConnections/CheckConnections");
const mongoose = require("mongoose");

exports.customerFinancialData = async (request, response) => {

  const UserSignupSchema = require("../model/SignupDB");
  let Database = "Signup_Database";
  await mongoose.connection.close();
  await checkConnection(Database);

  const userData = await UserSignupSchema.find({ Email: request.body.sessionEmail }).then(async data => {

    const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
    Database = "AccountOpen_Database";
    await mongoose.connection.close();
    await checkConnection(Database);

    console.log("Account Number : ", data[0]._id);
    const secondDocumentId = new mongoose.Types.ObjectId(data[0]._id);

    console.log("Request object of customer financial data : ", request);


    /** Fetch data from account database and then insert some particular data to newCustomerFianacialData database */
    const AccountOpenData = async () => {

      const UserAccountOpenSchema = require("../model/AccountOpenDB");
      Database = "AccountOpen_Database";
      await mongoose.connection.close();
      await checkConnection(Database);

      const data = await UserAccountOpenSchema.find({ Email: request.body.sessionEmail });

      console.log(data);

      return data;
    };

    await mongoose.connection.close();

    const wait = await AccountOpenData();

    return response.status(200).send({ msg: "Data fetch successfully", data: wait });

    // const newCustomerFianacialData = new CustomerFinancialasData({ 
    //   _id: secondDocumentId, /* Account Number */
    //   Email: request.body.sessionEmail,

    // });

  }).catch(e => console.log("Error from server : ", e));

};
