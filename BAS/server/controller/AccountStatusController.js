const mongoose = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");

const OBJ = {
  Amount: undefined,
  RandomStringServer: undefined,

  addFundsAccountNo: true,
  addFundsPIN: true,
  addFundAmountNegative: true,

  isExecutedForWITHDRAWFUNDS: false,
  selfAccountNo: undefined,
  selfPIN: undefined,
};

/** Entry in statement of account status database */
const generateStatement = async ({ amount, sessionEmail }, Status) => {

  await mongoose.connection.close();
  const AccountStatusSchema = require("../model/AccountStatusDB");
  let Database = "AccountStatus_Database";
  await checkConnection(Database);
  
  const obj = {
    date: new Date(),
    transferAmount: amount,
    senderAccountNo: "",
    recevierAccountNo: "",
    status: "success",
    statementStatus: `${Status === "Dr" ? "Dr" : "Cr" }`,
    msg: `$${amount} has been ${Status === "Dr" ? "Debited" : "Credited" } to account`
  };
  
  await AccountStatusSchema.updateOne({ Email: sessionEmail }, { $push: { TransactionHistory: [obj] } }, { new: true });
};

exports.addFunds = async (request, response) => {

  /** insert in new account status database and update in customer financial database */
  const { amount, sessionEmail, accountNo, pin } = request.body;
  
  const first = amount.charAt(0) === '0' ? true : false;

  if (first) {
    return response.status(402).send({ msg: "Amount must be greater than zero" });
  }

  console.log(`Amount : ${amount} and Email : ${sessionEmail} AccountNo : ${accountNo} pin: ${pin}`);

  /** update in new database */
  const updateFunds = async ({ amount, sessionEmail, accountNo, pin }) => {

    console.log(typeof amount);
    amount = Number.parseInt(amount);
    console.log(typeof amount);

    /** Verify digital signature */
    await mongoose.connection.close();
    const TokenSchema = require("../model/TokenDB");
    Database = "Token_DB";
    await checkConnection(Database);

    await TokenSchema.find({ Email: sessionEmail }, { Randomstring: 1 }).then(data => OBJ.RandomStringServer = data[0].Randomstring);

    await mongoose.connection.close();
    let AccountStatusSchema = require("../model/AccountStatusDB");
    Database = "AccountStatus_Database";
    await checkConnection(Database);

    let newBalance = undefined;

    await AccountStatusSchema.find({ Email: sessionEmail }).then(async data => {

      if (data[0].DigitalSignature === OBJ.RandomStringServer) {

        await mongoose.connection.close();
        const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
        Database = "CustomerFinancials_Database";
        await checkConnection(Database);

        await CustomerFinancialasData.find({ Email: sessionEmail }, { AccountNo: 1, PIN: 1 }).then(cache => {
          console.log("cache : ", cache);
          OBJ.selfAccountNo = cache[0].AccountNo,
          OBJ.selfPIN = cache[0].PIN
        });

        console.log(`Self account no : ${OBJ.selfAccountNo} and pin : ${OBJ.pin} and Account no from client : ${accountNo}`);

        if (OBJ.selfAccountNo === accountNo) {

          if (OBJ.selfPIN === pin) {
            if (amount < 0) {
              OBJ.addFundAmountNegative = false;
              return;
            }
            let oldBalance = data[0].Balance;
            newBalance = oldBalance + amount;
            console.log(`RandomString from AccountStatus Database : ${data[0].DigitalSignature} and RandomString from client is : ${OBJ.RandomStringServer}`);
            await CustomerFinancialasData.updateOne({ Email: sessionEmail }, { $set: { Balance: newBalance } }, { new: true });

            /** Update newbalance in loan database */
            await mongoose.connection.close();
            const UserLoan = require("../model/LoanDB");
            await checkConnection("Loan_Database");
            await UserLoan.updateOne({ Email: sessionEmail }, { $set: { Balance: newBalance } }, { new: true });
          }
          else {
            OBJ.addFundsPIN = false;
            return;
          }
        }
        else {
          OBJ.addFundsAccountNo = false;
          return;
        }

      }
      else {
        return response.status(402).send({ msg: "Unauthorized user your transaction is rejected" });
      }
    });

    await mongoose.connection.close();
    AccountStatusSchema = require("../model/AccountStatusDB");
    Database = "AccountStatus_Database";
    await checkConnection(Database);

    await AccountStatusSchema.updateOne({ Email: sessionEmail }, { $set: { Balance: newBalance } }, { new: true });

    await mongoose.connection.close();
  };

  await updateFunds(request.body);

  
  if (!OBJ.addFundsPIN) {
    OBJ.addFundsPIN = true;
    return response.status(402).send({ msg: "Retype PIN is invalid" });
  }
  else if (!OBJ.addFundsAccountNo) {
    OBJ.addFundsAccountNo = true;
    return response.status(402).send({ msg: "Retype account number seems to be wrong" });
  }
  else if (!OBJ.addFundAmountNegative) {
    OBJ.addFundAmountNegative = true;
    return response.status(402).send({ msg: "Invalid Mathematical Expression Amount should be in positive  ot negative" , request: "rejected" });
  }
  
  await generateStatement(request.body, "Cr");
  return response.status(200).send({ msg: "Add funds successfully", status: "success", request: true });
};


exports.withdrawFunds = async (request, response) => { 
  /** const sessionEmail = request.body.sessionEmail; */

  const { amount, sessionEmail } = request.body;

  console.log(`Amount : ${amount} and Email : ${sessionEmail}`);

  const first = amount.charAt(0) === '0' ? true : false;

  if (first) {
    return response.status(402).send({ msg: "Amount must be greater than zero" });
  }

  /** withdraw funds */
  const getFundsBack = async ({ amount, sessionEmail, pin }) => {

    amount = Number.parseInt(amount);

    /** Verify digital signature */
    await mongoose.connection.close();
    const TokenSchema = require("../model/TokenDB");
    let Database = "Token_DB";
    await checkConnection(Database);

    await TokenSchema.find({ Email: sessionEmail }, { Randomstring: 1 }).then(data => OBJ.RandomStringServer = data[0].Randomstring);

    await mongoose.connection.close();
    let AccountStatusSchema = require("../model/AccountStatusDB");
    Database = "AccountStatus_Database";
    await checkConnection(Database);

    await AccountStatusSchema.find({ Email: sessionEmail }, { Balance: 1, DigitalSignature: 1 }).then(async data => {
      console.log(data[0].Balance);
      console.log(data);

      await mongoose.connection.close();
      const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
      Database = "CustomerFinancials_Database";
      await checkConnection(Database);

      await CustomerFinancialasData.find({ Email: sessionEmail }, { AccountNo: 1, PIN: 1 }).then(cache => {
        console.log("cache : ", cache);
        OBJ.selfAccountNo = cache[0].AccountNo,
        OBJ.selfPIN = cache[0].PIN
      });

      if (OBJ.selfPIN === pin) {

        if (data[0].DigitalSignature === OBJ.RandomStringServer) {

          if (amount > data[0].Balance) {
            return response.status(402).send({ msg: "Insufficient funds" , request: "rejected" });
          }
          else if (amount < 0) {
            return response.status(402).send({ msg: "Invalid Mathematical Expression amount should not be negative" , request: "rejected" });
          }
          else {

            await mongoose.connection.close();
            AccountStatusSchema = require("../model/AccountStatusDB");
            Database = "AccountStatus_Database";
            await checkConnection(Database);

            const computeFunds = async (withdrawFund, balance) => {
              let remainingAmount = balance - withdrawFund;
              return remainingAmount;
            };
            OBJ.Amount = await computeFunds(amount, data[0].Balance);
            console.log("OBJ amount : ", OBJ.Amount);

            if (OBJ.Amount <= 1500) {
              return response.status(402).send({ msg: "You cannot withdraw more money minimum balance should have to maintain" });
            }
    
            await AccountStatusSchema.updateOne({ _id: data[0]._id }, { $set: { Balance: OBJ.Amount } }, { new: true });

            /** Update newbalance in loan database */
            await mongoose.connection.close();
            const UserLoan = require("../model/LoanDB");
            await checkConnection("Loan_Database");
            await UserLoan.updateOne({ Email: sessionEmail }, { $set: { Balance: OBJ.Amount } }, { new: true });

            OBJ.isExecutedForWITHDRAWFUNDS = true;

            await generateStatement(request.body, "Dr");

          }
        }
        else {
          return response.status(402).send({ msg: "Unauthorized user your transaction is rejected" });
        }
      }
      else {
        return response.status(402).send({ msg: "Retype PIN is invalid" });
      }
      
     
    }).catch(e => console.log("Error : ", e));
  };

  await getFundsBack(request.body);

  const updateFunds = async ({ sessionEmail }) => {
    await mongoose.connection.close();
    const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
    Database = "CustomerFinancials_Database";
    await checkConnection(Database);

    await CustomerFinancialasData.updateOne({ Email: sessionEmail }, { $set: { Balance: OBJ.Amount } }, { new: true });
    await mongoose.connection.close();
  };

  await updateFunds(request.body);

  if (OBJ.isExecutedForWITHDRAWFUNDS) {
    OBJ.isExecutedForWITHDRAWFUNDS = false;
    return response.status(200).send({ msg: "Withdraw funds successfully" });
  }
};
