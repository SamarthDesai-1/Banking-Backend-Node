const mongoose = require('mongoose');
const checkConnection = require("../CheckConnections/CheckConnections");
const AccountCloseSchema = require("../model/CloseAccountDB");

exports.getCloseRequest = async (request, response) => {

  await mongoose.connection.close();
  let Database = "CloseAccount_Database";
  await checkConnection(Database);

  const data = await AccountCloseSchema.find({});
  console.log(data);

  return response.status(200).send({ msg: "Data get successfully", format: "Array of objet [{}]", Data: data });
  
};


exports.getClosed = async (request, response) => {

  const { sessionEmail } = request.body;

  await mongoose.connection.close();
  let Database = "CloseAccount_Database";
  await checkConnection(Database);

  const data = await AccountCloseSchema.find({ Email: sessionEmail }, { Status: 1 });
  console.log(data);
  console.log("Data length : ", data.length);

  if (data.length == 1) {

    if (data[0].Status === "Pending") {

      return response.status(200).send({ msg: "Your request has been pending", Data: data});
    }
    else if (data[0].Status === "reject") {
      return response.status(200).send({ msg: "Your request has been reject", Data: data});
    }
  }

  return response.status(402).send({ msg: "first fill the form to close account then after check status" });
  
};


exports.deleteAccount = async (request, response) => {

  const { id, status } = request.body;

  await mongoose.connection.close();
  let Database = "CloseAccount_Database";
  await checkConnection(Database);

  let updateDATA = undefined;
  if (status === "confirm") {
    updateDATA = "success";
  }
  else {
    updateDATA = "reject";
  }

  console.log(updateDATA);
  const data = await AccountCloseSchema.updateOne({ AccountNo: id }, { $set: { Status: `${updateDATA}` } });

  await AccountCloseSchema.deleteOne({ AccountNo: id });

  if (updateDATA === "success") {

    const accountOpenDatabase = async (id) => {
      await mongoose.connection.close();
      const UserAccountOpenSchema = require("../model/AccountOpenDB");
      const Database = "AccountOpen_Database";
      await checkConnection(Database);

      const msg = await UserAccountOpenSchema.deleteOne({ AccountNo: id });
      if (msg.deletedCount === 1) {
        console.log('Document deleted successfully');
      } 
      else {
        console.log('No document found matching the filter criteria');
      }
    };
    await accountOpenDatabase(id);

    const customerData = async (id) => {
      await mongoose.connection.close();
      const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
      const Database = "CustomerFinancials_Database";
      await checkConnection(Database);

      const msg = await CustomerFinancialasData.deleteOne({ AccountNo: id });
      if (msg.deletedCount === 1) {
        console.log('Document deleted successfully');
      } 
      else {
        console.log('No document found matching the filter criteria');
      }
    };
    await customerData(id);

    const accountStatus = async (id) => {
      await mongoose.connection.close();
      const AccountStatusSchema = require("../model/AccountStatusDB");
      const Database = "AccountStatus_Database";
      await checkConnection(Database);

      const msg = await AccountStatusSchema.deleteOne({ AccountNo: id });
      if (msg.deletedCount === 1) {
        console.log('Document deleted successfully');
      } 
      else {
        console.log('No document found matching the filter criteria');
      }
    };
    await accountStatus(id);

    const deleteCard = async (id) => {

      await mongoose.connection.close();
      const DebitCardSchema = require("../model/FinancialServicesDB");
      const Database = "FinancialServices_Database";
      await checkConnection(Database);

      const user = await DebitCardSchema.findOne({ AccountNo: id });
      if (user) {
        await DebitCardSchema.deleteOne({ AccountNo: id });
      }
      else {
        console.log("Data not found");
      }
    };
    await deleteCard(id);

    const fixedDeposit = async (id) => {
      await mongoose.connection.close();
      const UserFD = require("../model/FixedDepositDB");
      const Database = "FixedDeposit_Database";
      await checkConnection(Database);

      const user = await UserFD.findOne({ AccountNo: id });
      if (user) {
        await UserFD.deleteOne({ AccountNo: id });
      }
      else {
        console.log("Data not found");
      }
    };
    await fixedDeposit(id);

    const tokenDB = async (id) => {
      await mongoose.connection.close();
      const TokenSchema = require("../model/TokenDB");
      const Database = "Token_DB";
      await checkConnection(Database);

      const user = await TokenSchema.findOne({ AccountNo: id });
      if (user) {
        await TokenSchema.deleteOne({ AccountNo: id });
      }
      else {
        console.log("Data not found");
      }
    };
    await tokenDB(id);


    return response.status(200).send({ msg: "Admin user has been deleted from the database" });
  }
    
  return response.status(402).send({ msg: "Admin user request has been rejected" });
};