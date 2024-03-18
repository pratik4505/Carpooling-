const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const User = require("../models/User");
const AvailableRide = require("../models/AvailableRide");
const BookedRide = require("../models/BookedRide");
const PastRide = require("../models/PastRide");
const Transaction = require("../models/Transaction");
function generateUniqueCode() {
  // Get current timestamp in milliseconds
  const timestamp = new Date().getTime();

  // Convert timestamp to string and remove milliseconds
  const timestampString = timestamp.toString().slice(0, -3);

  // Extract last 6 digits from the timestamp string
  const lastSixDigits = timestampString.slice(-6);

  // Ensure there are no leading zeros
  let uniqueCode = parseInt(lastSixDigits);

  // Check if the unique code has leading zeros
  while (uniqueCode < 100000) {
    // If so, multiply by 10 until it's a 6-digit number
    uniqueCode *= 10;
  }

  return uniqueCode;
}

const checkout = async (req, res) => {
  const data = req.body;

  try {
    const amountInCents = Math.round(parseFloat(data.amount) * 100);

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: data.description,
            },
            unit_amount: Math.min(999999, amountInCents), //max amount 9999usd allowed
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: process.env.CLIENT_URL,
      cancel_url: `${process.env.CLIENT_URL}/paymentFailed`,
      customer_email: data.email,
      payment_intent_data: {
        metadata: {
          key: data.key,
          paidBy: data.userId,
        },
      },
    });

    // Redirect the user to the Checkout page URL
    res.redirect(303, session.url);
  } catch (error) {
    console.error("Error creating session:", error.message);
    res.status(400).json({ error: { message: error.message } });
  }
};

const paymentWebhook = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;
  //console.log('request.body',request.body);
  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }
  //console.log(event);

  console.log(event);
  console.log(
    "---------------------------------------------------------------------------------"
  );
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const session = event.data.object;
        const customData = session.metadata;
        //console.log("session",session);
        // console.log("customData",customData);
        console.log("**", customData, "*");
        // Access user schema and retrieve pendingPayments
        const user = await User.findById(customData.paidBy);
        const value = user.pendingPayments.get(customData.key);

        // Delete the key from pendingPayments map

        user.pendingPayments.delete(customData.key);

        // Update user's pendingPayments

        await user.save();

        // Access AvailableRide schema and retrieve paidTo data
        const availableRide = await AvailableRide.findById(value.rideId);

        if (!availableRide) {
          console.error("Available ride not found");
          break;
        }

        const paidTo = availableRide.driverId;

        // Subtract booked seats from available seats
        availableRide.availableSeats -= value.seats;

        // Save the updated document
        await availableRide.save();

        // Find driver details
        const driver = await User.findById(availableRide.driverId);

        // Store transaction data in Transaction schema
        const transaction = new Transaction({
          intentId: session.id,
          paidBy: customData.paidBy,
          paidTo: paidTo,
          amountPaid: session.amount / 100,
          unitCost: value.unitCost,
          distance: value.distance,
          seats: value.seats,
          rideId: value.rideId,
          driverName: driver.name,
          source: value.pickUpAddress,
          destination: value.destinationAddress,
          latest_charge: session.latest_charge,
        });
        await transaction.save();

        // Create past ride entry for the passenger
        const pastRide = new PastRide({
          rideId: value.rideId,
          userId: customData.paidBy,
          source: value.pickUpAddress,
          destination: value.destinationAddress,
          user: "passenger",
          rating: {},
          overview_polyline: availableRide.overview_polyline, // Ensure overview_polyline exists
          sourceCo: value.pickUp,
          destinationCo: value.destination,
        });
        await pastRide.save();

        // Create booked ride entry for the passenger
        const bookedRide = new BookedRide({
          rideId: value.rideId,
          passengerId: customData.paidBy,
          seats: value.seats,
          pickUp: value.pickUp,
          destination: value.destination,
          pickUpAddress: value.pickUpAddress,
          destinationAddress: value.destinationAddress,
          pickUpDate: value.pickUpDate,
          pickUpTime: value.pickUpTime,
          unitCost: value.unitCost,
          distance: value.distance,
          transactionId: transaction._id,
          verificationCode: generateUniqueCode(),
          vehicleType: availableRide.vehicleType,
          overview_polyline: availableRide.overview_polyline, // Ensure overview_polyline exists
          passengerName: user.name,
          passengerImageUrl: user.imageUrl,
          driverId: availableRide.driverId,
          driverName: driver.name,
          driverImageUrl: driver.imageUrl,
          pastRideId: pastRide._id,
          driverPastId: availableRide.pastRideId,
        });
        await bookedRide.save();

        console.log("Transaction stored");
        break;

      default:
        //console.log(Unhandled event type ${event.type});
        break;
    }
  } catch (error) {
    console.error("Error processing event:", error);
    return response
      .status(500)
      .send(`Error processing event: ${error.message}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).send();
};

module.exports = {
  checkout,
  paymentWebhook,
};
