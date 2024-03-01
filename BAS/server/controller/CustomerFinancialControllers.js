const checkConnection = require("../CheckConnections/CheckConnections");
const mongoose = require("mongoose");

exports.customerFinancialData = async (request, response) => {

  const UserAccountOpenSchema = require("../model/AccountOpenDB");
  let Database = "AccountOpen_Database";
  await mongoose.connection.close();
  await checkConnection(Database);

  const AccountData = await UserAccountOpenSchema.find({ Email: request.body.sessionEmail }).then(async data => {

    console.log("Data comming from account open database : ", data);

    const CustomerFinancialasData = require("../model/CustomerDetailsDB");
    Database = /** CustomerBankDetails__ */
    await mongoose.connection.close();
    await checkConnection(Database);

    console.log("Account Number : ", data[0]._id);
    // const secondDocumentId = new mongoose.Types.ObjectId(data[0]._id);
    
    // const newCustomerFianacialData = new CustomerFinancialasData({ 
    //   _id: secondDocumentId, /* Account Number */
    //   Email: request.body.sessionEmail,

    // });

  }).catch(e => console.log("Error : ", e));

};
