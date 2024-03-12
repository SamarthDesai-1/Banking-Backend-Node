const mongoose = require('mongoose');
const checkConnection = require("../CheckConnections/CheckConnections");

exports.closeAccount = async (request, response) => {

  const { formData, sessionEmail, accountNo, userID } = request.body;

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

    await newRequest.save().then((data) => {
      console.log(data);
      return response.status(200).send({ msg: "API testing", statusProcess: true });
    }).catch((e) => {
      return response.status(402).send({ msg: e })
    });

  }
  else {
    return response.status(402).send({ msg: "Invalid account no please retype account no" });
  }


}; 