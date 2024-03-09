const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");

const OBJ = {
  INTERESTRATE: "3",
  minBalance: 1500
};


/** Entry in statement of account status database */
const generateStatement = async (FD, sessionEmail, Status) => {

  await mongoose.connection.close();
  const AccountStatusSchema = require("../model/AccountStatusDB");
  let Database = "AccountStatus_Database";
  await checkConnection(Database);
  
  const obj = {
    date: new Date(),
    transferAmount: FD,
    senderAccountNo: "",
    recevierAccountNo: "",
    status: "success",
    statementStatus: `${Status === "Dr" ? "Dr" : "Cr" }`,
    msg: `$${FD} has been ${Status === "Dr" ? "Debited" : "Credited" } to account for Fixed Deposit installment`
  };
  
  await AccountStatusSchema.updateOne({ Email: sessionEmail }, { $set: { Balance: FD }, $push:{ TransactionHistory: [obj] } }, { new: true });
};


const updateFunds = async (FD, sessionEmail) => {
  await mongoose.connection.close();
  const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
  Database = "CustomerFinancials_Database";
  await checkConnection(Database);

  await CustomerFinancialasData.updateOne({ Email: sessionEmail }, { $set: { Balance: FD } }, { new: true });
  await mongoose.connection.close();
};



exports.openFD = async (request, response) => {

  const { formData, sessionEmail, data } = request.body;

  const first = (formData.amount.charAt(0) === '0' || formData.amount.charAt(0) === '-') ? true : false;

  if (first) {
    return response.status(402).send({ msg: "Amount must be greater than zero" });
  }
  
  const monthsFirstVal = formData.timeperiod.charAt(0) === "0" ? true : false;
  const months = Number.parseInt(formData.timeperiod);
  if (months < 0 || monthsFirstVal) {
    return response.status(402).send({ msg: "months must be greater than zero" });
  }

  console.log(formData);
  console.log(sessionEmail);
  console.log(data);

  await mongoose.connection.close();
  let Database = "Token_DB";
  const TokenSchema = require("../model/TokenDB");
  await checkConnection(Database);

  const signature = await TokenSchema.find({ Email: sessionEmail }, { Randomstring: 1 });
  await mongoose.connection.close();

  console.log(signature);


  if (data.PIN === formData.pin) {

    if (data.DigitalSignature === signature[0].Randomstring) {
      let amount = Number.parseInt(formData.amount);
      let AccountBalance = data.Balance;
      
      if ((AccountBalance - amount) <= OBJ.minBalance) {
        return response.status(402).send({ msg: "Account balance 1500 should be maintained" });
      }
      else {
        const FD = AccountBalance - amount;

        /** generate statement entry for Dr FD installment */
        
        await mongoose.connection.close();
        Database = "FixedDeposit_Database";
        const UserFD = require("../model/FixedDepositDB");
        await checkConnection(Database);

        let responseData = {};
        
        let bool = true;
        const secondDocumentId = new mongoose.Types.ObjectId(data._id);
        const newFD = new UserFD({
          _id: secondDocumentId,
          Email: sessionEmail,
          DigitalSignature: data.DigitalSignature,
          AccountNo: data.AccountNo,
          Balance: formData.amount,
          date: new Date()
        });
        await newFD.save().then(data => {
          console.log(data);
          responseData = data;
        }).catch((e) => {
          console.log(e);
          bool = false;
          return response.status(402).send({ msg: "You are already create an fixed deposit", error: e });
        });
        
        
        if (bool) {
          
          await updateFunds(FD, sessionEmail);
          await generateStatement(amount, sessionEmail, "Dr");
          return response.status(200).send({ msg: { Response: { Message: "API testing successfully", Data: responseData } } });

        }
      }
    }
  }
  else {
    return response.status(402).send({ msg: "Retype pin is invalid" });
  }
};


exports.existsFD = async (request, response) => {

  const { sessionEmail } = request.body;
  await mongoose.connection.close();
  Database = "FixedDeposit_Database";
  const UserFD = require("../model/FixedDepositDB");
  await checkConnection(Database);

  const data = await UserFD.find({ Email: sessionEmail });

  return response.status(200).send({ msg: "About existance", Data: data });
};