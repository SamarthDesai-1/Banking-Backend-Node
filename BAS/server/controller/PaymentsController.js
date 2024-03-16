const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.PAY_SECRET_ID
});


exports.settlePayment = async (request, response) => {

  console.log("Payment API call");

  try {
    const options = request.body;
    const order = await razorpayInstance.orders.create(options);
    if (!order) {
      response.status(500).send("Error");
    }

    response.json(order);
  }
  catch (e) {
    console.log(e);    
    response.status(500).send("Error");
  }

};