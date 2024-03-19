const mongoose  = require("mongoose");
const checkConnection = require("../CheckConnections/CheckConnections");
const randomString = require("randomstring");

/** PIN verification is not done yet do it. */
const OBJ = {
  senderPin: undefined,
  isExecuted: false
};

exports.transferFund = async (request, response) => {

  const { amount, pin } = request.body;

  const first = amount.charAt(0) === '0' ? true : false;

  if (first) {
    return response.status(402).send({ msg: "Amount must be greater than zero" });
  }

  /** STEP: 1  set token string in both sender and recevier account */ 
  const paymentToken = randomString.generate();

  const setTokens = async ({ recevier, sessionEmail }) => {

    await mongoose.connection.close();
    const AccountStatusSchema = require("../model/AccountStatusDB");
    let Database = "AccountStatus_Database";
    await checkConnection(Database);
    
    await AccountStatusSchema.updateOne({ Email: sessionEmail }, { $set: { Token: paymentToken } }, { new: true });
    await AccountStatusSchema.updateOne({ AccountNo: recevier }, { $set: { Token: paymentToken } }, { new: true });
    
    await mongoose.connection.close();
    const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
    Database = "CustomerFinancials_Database";
    await checkConnection(Database);

    await CustomerFinancialasData.find({ Email: sessionEmail }).then(data => OBJ.senderPin = data[0].PIN);
    await mongoose.connection.close();
    
    console.log(OBJ.Pin);
    console.log("Tokens set successfully");
  };

  await setTokens(request.body);

  console.log(OBJ.senderPin);

  /** STEP: 2 make payment or transfer */
  const settlePayment = async ({ recevier, amount, sessionEmail, msg }) => {

    amount = Number.parseInt(amount);

    const Conditions = {
      maxLimit: 1000000,
      minLimit: 500,
      minBalance: 1500
    };  

    const Confirmation = {
      senderToken: undefined,
      recevierToken: undefined,
      senderBalance: undefined,
      recevierBalance: undefined,
      senderAccountNo: undefined,
      recevierAccountNo: undefined
    };

    await mongoose.connection.close();
    const AccountStatusSchema = require("../model/AccountStatusDB");
    let Database = "AccountStatus_Database";
    await checkConnection(Database);

    const senderSide = await AccountStatusSchema.find({ Email: sessionEmail }).then(data => {
      Confirmation.senderToken = data[0].Token;
      Confirmation.senderBalance = data[0].Balance;
      Confirmation.senderAccountNo = data[0].AccountNo;
      console.log(data);
    });

    try {
      const recevierSide = await AccountStatusSchema.find({ AccountNo: recevier }).then(data => {
        Confirmation.recevierToken = data[0].Token;
        Confirmation.recevierBalance = data[0].Balance;
        Confirmation.recevierAccountNo = data[0].AccountNo;
        console.log(data);
      });
      console.log("server side : ", senderSide);
      console.log("recevier side : ", recevierSide);
    } catch (error) {
      return response.status(402).send({ msg: "Retye recevier account no is not exists", status: true });
    }


    /** PIN verify code at here in if statement */

    if (recevier === Confirmation.recevierAccountNo) { /** verify recevier account number */

      if (Confirmation.senderToken === Confirmation.recevierToken) {

        console.log("Sender : ", Confirmation.senderBalance + " " + "Recevier : " +  Confirmation.recevierBalance + " " + amount);
  
        if (Confirmation.senderBalance < amount) { /** if not have enough funds in acoount to carry transaction */
          return response.status(402).send({ msg: "Insufficient bank balance for payment and maintain balance of 1500", status: false });
        }
        else if (amount < 0) {
          return response.status(402).send({ msg: "Invalid mathematical expression amount not should be in negative", status: false });
        }
        else {
          const payment = Confirmation.senderBalance - amount;
  
          if (payment <= Conditions.minBalance) {
            return response.status(402).send({ msg: "Transfer amount exceeds the limits of minimum balance" });
          }
          else {          
  
            const recevierAmount = Confirmation.recevierBalance + amount; /** - = dr and + = cr */
  
            const obj = {
              date: new Date(),
              transferAmount: amount,
              senderAccountNo: Confirmation.senderAccountNo,
              recevierAccountNo: Confirmation.recevierAccountNo,
              status: "success",
              statementStatus: "Dr",
              msg: msg
            };
  
            /** sender */
            await AccountStatusSchema.updateOne({ Email: sessionEmail }, { $set: { Balance: payment, Token: "" }, $push: { TransactionHistory: [obj] } }, { new: true });
  
            obj.statementStatus = "Cr";
            
            /** recevier */
            await AccountStatusSchema.updateOne({ AccountNo: recevier }, { $set: { Balance: recevierAmount, Token: "" }, $push: { TransactionHistory: [obj] } }, { new: true });
  
            await mongoose.connection.close();
            const CustomerFinancialasData = require("../model/CustomerFinancialsDB");
            let Database = "CustomerFinancials_Database";
            await checkConnection(Database);
  
            await CustomerFinancialasData.updateOne({ AccountNo: recevier }, { $set: { Balance: recevierAmount } }, { new: true });
            await CustomerFinancialasData.updateOne({ Email: sessionEmail }, { $set: { Balance: payment } }, { new: true });
  
            await mongoose.connection.close();

             /** Update newbalance in loan database */
             await mongoose.connection.close();
             const UserLoan = require("../model/LoanDB");
             await checkConnection("Loan_Database");
             await UserLoan.updateOne({ Email: sessionEmail }, { $set: { Balance: payment } }, { new: true });
  
            OBJ.isExecuted = true;
            if (OBJ.isExecuted) {
              await mongoose.connection.close();
              return response.status(200).send({ msg: "Transfer funds successfully" });
            }
          }
        }
      }
    }
    
    await mongoose.connection.close();
  };

  if (OBJ.senderPin === pin) {
    await settlePayment(request.body);
    await mongoose.connection.close();
  }
  else {
    return response.status(402).send({ msg: "PIN is invalid" });
  }

};
