const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config({ path: "config.env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'BMS', resave: false, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('E:/Banking Application Backend/Banking-Backend-Node/BAS/server'));

app.get("/", (request, response) => {
  return response.status(200).send({ msg: "Hello from express" });
});

/* Connect to Mongo DB  */ 

app.use("/test/api/users", require("./routes/signup_route"));
app.use("/test/api/users", require("./routes/login_route"));
app.use("/test/api/users", require("./routes/contact_route"));
app.use("/test/api/users", require("./routes/accountopen_route"));
app.use("/test/api/users", require("./routes/customerfinancial_route"))
app.use("/test/api/users", require("./routes/pinVerify_route"));
app.use("/test/api/users", require("./routes/accountstatus_route"));
app.use("/test/api/users", require("./routes/transferfunds_route"));
app.use("/test/api/users", require("./routes/fetch_route"));
app.use("/test/api/users", require("./routes/financialServices_route"));
app.use("/test/api/users", require("./routes/fixeddeposit_route"));
app.use("/test/api/users", require("./routes/getSignupData_route"));
app.use("/test/api/users", require("./routes/getDebitCardData_route"));
app.use("/test/api/users", require("./routes/getFDdata_route"));
app.use("/test/api/users", require("./routes/getAccountOpenData_route"));
app.use("/test/api/users", require("./routes/getAllCustomerData_route"));
app.use("/test/api/users", require("./routes/getAllTransaction_route"));

app.listen(PORT, () => {
  console.log(`App listenning at ${PORT}`);
});