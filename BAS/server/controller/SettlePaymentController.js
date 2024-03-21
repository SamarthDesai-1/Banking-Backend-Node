const mongoose = require('mongoose');
const checkConnection = require("../CheckConnections/CheckConnections");

let OBJ = { 
  Amount: 0,
  CVV: "",
  AccountNo: "",
  userSignature: "",
  serverSignature: "",
  serverCVV: "",
  Balance: 0,
  
  invalidCVV: false,
  exceedsAmount: false,
  negativeAmount: false,
  insufficientBalance: false,
  wrongAccountNo: false,
  sessionEmail: ""
};


const fetchUserCVV = async () => {

  await mongoose.connection.close();
  const DebitCardSchema = require("../model/FinancialServicesDB");
  await checkConnection("FinancialServices_Database");

  const data = await DebitCardSchema.find({ Email: OBJ.sessionEmail }, { CVV: 1 });
  console.log(data);

  OBJ.serverCVV = data[0].CVV;

};

const fetchSignatureServer = async () => {


  await mongoose.connection.close();
  const TokenSchema = require("../model/TokenDB");
  await checkConnection("Token_DB");

  const data = await TokenSchema.find({ Email: OBJ.sessionEmail }, { Randomstring: 1 });
  console.log(data);
  OBJ.serverSignature = data[0].Randomstring;

};

exports.settlePayment = async (request, response, next) =>{ 
  console.log("Settle Payment");

  const { Amount, CVV, AccountNo } = request.body.array[0];
  const { sessionEmail } = request.body;

  console.log(request.body);

  const first = Amount.charAt(0) === '0' ? true : false;

  if (first) {
    return response.status(402).send({ msg: "Amount must be greater than zero" });
  }

  OBJ.Amount = Amount;
  OBJ.CVV = CVV;
  OBJ.AccountNo = AccountNo;
  OBJ.sessionEmail = sessionEmail;

  await fetchSignatureServer();
  await fetchUserCVV();

  /** Settle Account Status */
  const settlePaymentAccountStatus = async (Amount, CVV, AccountNo, sessionEmail) => {

    Amount = Number.parseInt(Amount);

    await mongoose.connection.close();
    const AccountStatusSchema = require("../model/AccountStatusDB");
    await checkConnection("AccountStatus_Database");

    const obj = {
      date: new Date(),
      transferAmount: Amount,
      senderAccountNo: "",
      recevierAccountNo: "",
      status: "success",
      statementStatus: "Dr",
      msg: `$${Amount} has been debited for pay with debit card`
    };
    
    const data = await AccountStatusSchema.find({ Email: sessionEmail }, { Balance: 1, DigitalSignature: 1, AccountNo: 1 });
    console.log(data);

    OBJ.userSignature = data[0].DigitalSignature;
    OBJ.Balance = data[0].Balance;

    if (data[0].Balance - Amount  <= 1500) {
      OBJ.exceedsAmount = true;
      return;
    }
    else if (Amount <= 0) {
      OBJ.negativeAmount = true;
      return;
    }
    else if (Amount > data[0].Balance) {
      OBJ.insufficientBalance = true;
      return;
    }

    
    if (data[0].AccountNo === AccountNo) {

      if (CVV === OBJ.serverCVV.substring(process.env.START_INDEX, process.env.END_INDEX)) {
        
        if (OBJ.serverSignature === OBJ.userSignature) {
          await AccountStatusSchema.updateOne({ AccountNo: AccountNo }, { $set: { Balance: data[0].Balance - Amount }, $push:{ TransactionHistory: [obj] } }, { new: true });
        }
      }
      else {
        OBJ.invalidCVV = true;
        return;
      }
    }
    else {
      OBJ.wrongAccountNo = true;
      return;
    }
  };
  
  await settlePaymentAccountStatus(Amount, CVV, AccountNo, sessionEmail);


  const settlePaymentCustomerFinancials = async (Amount) => {

    await mongoose.connection.close();
    const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
    await checkConnection("CustomerFinancials_Database");

    OBJ.Amount = Number.parseInt(Amount);
    const data = await CustomerFinancialasData.updateOne({ AccountNo: OBJ.AccountNo }, { $set: { Balance: OBJ.Balance - OBJ.Amount } }, { new: true });
  };


  if (!OBJ.exceedsAmount && !OBJ.negativeAmount && !OBJ.invalidCVV && !OBJ.insufficientBalance && !OBJ.wrongAccountNo) {

    await settlePaymentCustomerFinancials(Amount);
  }


  if (OBJ.exceedsAmount) {
    OBJ.exceedsAmount = false;
    return response.status(402).send({ msg: "Minimum 1500 balance should be maintain" });
  }
  else if (OBJ.negativeAmount) {
    OBJ.negativeAmount = false;
    return response.status(402).send({ msg: "Invalid amount for payment amount should be greater than 0" });
  }
  else if (OBJ.invalidCVV) {
    OBJ.invalidCVV = false;
    return response.status(402).send({ msg: "Incorrect CVV retype it" });
  }
  else if (OBJ.wrongAccountNo) {
    OBJ.wrongAccountNo = false;
    return response.status(402).send({ msg: "Wrong account no retype it" });
  }
  else if (OBJ.insufficientBalance) {
    OBJ.insufficientBalance = false;
    return response.status(402).send({ msg: "Insufficient balance for payment" });
    
  }

  next();
};