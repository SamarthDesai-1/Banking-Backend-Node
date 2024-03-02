const nodemailer = require("nodemailer");

const SendMail = async (email, response, token, OTP) => {

  console.log(`Email : ${email}`);
  console.log("OTP : ", OTP);

  const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: "transactorgltd@gmail.com",
      pass: "poum grxa duvv ienc"
    }
  });

  const mailOptions = {
    from: "transactorgltd@gmail.com",
    // to: `${email}`,
    to: "samarthdesain@gmail.com",
    subject: "Hello from Transact LTD",
    text: `Dear User,\n\nYou have requested to reset your password for your account with us. To proceed with the password reset process, please use the following OTP (One-Time Password) within the next 10 minutes:\n\nOTP: ${OTP}\n\nIf you did not initiate this password reset request, please disregard this email. Your account security may have been compromised, and we recommend contacting our support team immediately.\n\nThank you for using our service.\n\nBest regards,\nTransact Payments`,
  };

  try {
    const result = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      else {
        console.log(`Email send successfully : ${info.response}`);
      }
    });
    // return response.status(200).send({ msg: `Email send successfully to your ${request.body.email}` });

  } catch (error) {
    response.status(404).send({ msg: "Not able to send Email" });
    return;
  }

};

module.exports = SendMail;

