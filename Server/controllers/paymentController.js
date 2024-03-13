const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const User = require("../models/User");
const AvailableRide = require("../models/AvailableRide");
const BookedRide = require("../models/BookedRide");
const PastRide = require("../models/PastRide");

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
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "INR",
      amount: data.amount,
      description: data.description,
      receipt_email: data.email,
      metadata: {
        key: data.key,
        paidBy: data.userId,
      },
      automatic_payment_methods: { enabled: true },
    });
    console.log(paymentIntent);
    // Send publishable key and PaymentIntent details to client
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};

const paymentWebhook = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      try {
        const paymentIntentSucceeded = event.data.object;
        const customData = paymentIntentSucceeded.metadata.customData;

        // Access user schema and retrieve pendingPayments
        const user = await User.findById(customData.paidBy);
        const value = user.pendingPayments.get(customData.key);

        // Delete the key from pendingPayments map
        user.pendingPayments.delete(customData.key);

        // Update user's pendingPayments
        user.pendingPayments = pendingPayments;
        await user.save();

        // Access AvailableRide schema and retrieve paidTo data
        const availableRide = await AvailableRide.findOne({
          rideId: value.rideId,
        });
        const paidTo = availableRide.driverId;
        
        // Subtract booked seats from available seats
        availableRide.availableSeats -= value.seats;
        
        // Save the updated document
        await availableRide.save();

        const driver = await User.findById(availableRide.driverId);

        
        // Store transaction data in Transaction schema
        const transaction = new Transaction({
          intentId: paymentIntentSucceeded.id,
          paidBy: customData.paidBy,
          paidTo: paidTo,
          amountPaid: paymentIntentSucceeded.amount,
          unitCost: value.unitCost,
          distance: value.distance,
          seats: value.seats,
          rideId: value.rideId,
        });
        await transaction.save();

        const transactionId = transaction._id;

        const pastRide=new PastRide({
          rideId: value.rideId,
          userId:customData.paidBy,
          source:value.pickUpAddress,
          destination:value.destinationAddress,
          user:'passenger',
          rating:{},
          overview_polyline:availableRide.overview_polyline,
        });

        await pastRide.save();

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
          transactionId: transactionId,
          verificationCode:generateUniqueCode(),
          vehicleType: availableRide.vehicleType,
          overview_polyline: availableRide.overview_polyline,
          passengerName:user.name,
          passengerImageUrl:user.imageUrl,
          driverId:availableRide.driverId,
          driverName:driver.name,
          driverImageUrl:driver.imageUrl,
          pastRideId:pastRide._id,
          driverPastId:availableRide.pastRideId
        });
        await bookedRide.save();

        //ALSO MAKE PASTRIDE SCHEMA FOR DRIVER 
        

        console.log("Transaction stored");
      } catch (error) {
        console.error("Error storing payment intent:", error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

module.exports = {
  checkout,
  paymentWebhook,
};
