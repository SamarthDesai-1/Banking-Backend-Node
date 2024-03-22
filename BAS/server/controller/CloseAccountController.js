const mongoose = require('mongoose');
const checkConnection = require("../CheckConnections/CheckConnections");

exports.closeAccount = async (request, response) => {


  const { formData, sessionEmail, accountNo, userID } = request.body;

  await mongoose.connection.close();
  const CloseAccountStatus = require("../model/CloseAccountStatusDB");
  await checkConnection("CLoseAccountStatus");
  await CloseAccountStatus.deleteOne({ AccountNo: accountNo });

  console.log(typeof accountNo);
  console.log(typeof formData.AccountNo);

  /** account no comming from user textbox and originalAccountNo comming from AccountData sessionstorage */

  await mongoose.connection.close();
  const AccountCloseSchema = require("../model/CloseAccountDB");
  let Database = "CloseAccount_Database";
  await checkConnection(Database);

  const secondDocumentId = new mongoose.Types.ObjectId(userID);

  if (accountNo == formData.AccountNo) {
    
    const newRequest = new AccountCloseSchema({
      _id: secondDocumentId,
      Email: sessionEmail,
      FirstName: formData.FirstName,
      LastName: formData.LastName,
      Reason: formData.Reason,
      AccountNo: formData.AccountNo,
    });

    // await newRequest.save().then((data) => {
    //   console.log(data);
    //   return response.status(200).send({ msg: "API testing", statusProcess: true });
    // }).catch((e) => {
    //   return response.status(402).send({ msg: e })
    // });

    /** Save user */
    await newRequest.save().then(data => console.log(data)).catch(e => console.log(e));

    await mongoose.connection.close();
    const CloseAccountStatus = require("../model/CloseAccountStatusDB");
    await checkConnection("CLoseAccountStatus");
    
    const statusRequest = new CloseAccountStatus({
      _id: secondDocumentId,
      AccountNo: formData.AccountNo,
      Email: sessionEmail
    });

    await statusRequest.save().then(data => console.log(data)).catch((e) => console.log(e));

    return response.status(200).send({ msg: "Close account application submitted successfully", statusProcess: true });

  }
  else {
    return response.status(402).send({ msg: "Invalid account no please retype account no" });
  }


}; 


exports.closeAccountReject = async (request, response) => {

  
};