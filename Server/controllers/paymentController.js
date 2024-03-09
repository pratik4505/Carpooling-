const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

const checkout = async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "upi"],
        mode: "payment",
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: 'Ride',
            },
            unit_amount: 200, // Amount in cents, so $20 is 2000 cents
          },
          quantity: 1,
        }],
        success_url: `${process.env.CLIENT_URL}/publishRide`,
        cancel_url: `${process.env.CLIENT_URL}/searchRide`,
      });
      res.json({ url: session.url });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };
  

  module.exports = {
    checkout
  }