const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.makePayment = async (request, response) => {

  const { array } = request.body;

  console.log(array);

  const lineItems = array.map((elem) => ({

    price_data: {
      currency: "usd",
      product_data: {
        name: elem.AccountNo,
      },
      unit_amount: Number.parseInt(elem.Amount) * 100,
    },
    quantity: 1
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/Deshbord",
    cancel_url: "http://localhost:3000/Deshbord",
  });

  return response.status(200).send({ msg: "API testing", Data: { id: session.id } });
};


