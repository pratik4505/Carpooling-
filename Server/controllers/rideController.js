const AvailableRide = require("../models/AvailableRide");
const User = require("../models/User");
const BookedRide = require("../models/BookedRide");
const PastRide = require("../models/PastRide");
const Chat = require("../models/Chat");
const uuid = require("uuid");
const Transaction = require("../models/Transaction");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const postRide = async (req, res) => {
  // Extract data from request body
  const userId = req.userId;

  try {
    const {
      source,
      destination,
      date,
      time,
      availableSeats,
      unitCost,
      vehicleType,
      totalSeats,
      overview_polyline,
      totalTime,
      speed,
      userData,
    } = req.body;
    // Create a new AvailableRide document
    const newAvailableRide = new AvailableRide({
      source,
      destination,
      date,
      time,
      overview_polyline,
      availableSeats,
      unitCost,
      vehicleType,
      driverId: userId,
      totalSeats,
      totalTime,
      speed,
      pastRideId: "abc",
    });

    // Save the new AvailableRide to the database
    await newAvailableRide.save();

    const pastRide = new PastRide({
      rideId: newAvailableRide._id,
      userId: userId,
      source,
      destination,
      user: "driver",
      rating: {},
      overview_polyline,
    });

    await pastRide.save();
    newAvailableRide.pastRideId = pastRide._id;
    await newAvailableRide.save();

    const chat = new Chat({
      rideId: newAvailableRide._id,
      members: {
        [userData.userId]: {
          name: userData.name,
          imageUrl: userData.imageUrl,
        },
      },
      chatName: `${userData.name} (${source.split(",")[0]} to ${
        destination.split(",")[0]
      })`,
      driverId: userData.userId,
    });

    await chat.save();

    console.log("I am here");

    res.status(201).json(newAvailableRide); // Status code 201: Created
  } catch (err) {
    console.error("Error saving AvailableRide:", err);
    res.status(500).json({ error: "Internal server error" }); // Status code 500: Internal Server Error
  }
};

const findRides = async (req, res) => {
  try {
    const { seats, date } = req.body;
    const rides = await AvailableRide.find({
      date: date,
      availableSeats: { $gte: seats },
    });
    res.status(200).json(rides);
  } catch (err) {
    console.error("Error fetching rides:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { findRides };

const getRequests = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    // If userId is not provided, send a 400 Bad Request response
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      // If user is not found, send a 404 Not Found response
      return res.status(404).json({ error: "User not found" });
    }
    // Extract rideRequests map from the user
    const rideRequests = user.rideRequests;
    // Send rideRequests map as the response
    return res.status(200).json(rideRequests);
  } catch (error) {
    // If an error occurs during database operation, send a 500 Internal Server Error response
    console.error("Error fetching ride requests:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const postRequests = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const { action, key } = req.body;
    if (!action || !key) {
      return res
        .status(400)
        .json({ error: "Action and key must be provided in the request body" });
    }
    // Find the user

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Access the rideRequest map for the given key
    const request = user.rideRequests?.get(key);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    // Delete the key-value pair from rideRequests map
    user.rideRequests.delete(key);
    // If action is 'accept', put the request in pendingPayments map of requesterId
    if (action === "accept") {
      const {
        requesterId,
        message,
        rideId,
        pickUp,
        destination,
        seats,
        distance,
        unitCost,
        pickUpDate,
        pickUpTime,
        pickUpAddress,
        destinationAddress,
      } = request;
      const requester = await User.findById(requesterId);
      if (!requester) {
        return res.status(404).json({ error: "Requester not found" });
      }

      const requestData = {
        rideId,
        pickUp,
        destination,
        seats,
        distance,
        unitCost,
        pickUpDate,
        pickUpTime,
        pickUpAddress,
        destinationAddress,
      };

      if (!requester.pendingPayments) {
        requester.pendingPayments = new Map();
      }

      requester.pendingPayments.set(key, requestData);
      await requester.save();
    }

    // Save the changes to the user
    await user.save();

    res.status(200).json({ message: "Request processed successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAcceptedRides = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    // If userId is not provided, send a 400 Bad Request response
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      // If user is not found, send a 404 Not Found response
      return res.status(404).json({ error: "User not found" });
    }
    // Extract rideRequests map from the user
    const pendingPayments = user.pendingPayments;

    // Send rideRequests map as the response
    return res.status(200).json(pendingPayments);
  } catch (error) {
    // If an error occurs during database operation, send a 500 Internal Server Error response
    console.error("Error fetching pending Payments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const postDeclinePayment = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is extracted from authentication middleware

    // Check if action and key are provided in the request body
    const { key } = req.body;
    if (!key) {
      return res
        .status(400)
        .json({ error: " key must be provided in the request body" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Access the rideRequest map for the given key
    const Payments = user.pendingPayments?.get(key);
    if (!Payments) {
      return res.status(404).json({ error: " Payment Request not found" });
    }

    // Delete the key-value pair from rideRequests map
    user.pendingPayments.delete(key);
    await user.save();

    res.status(200).json({ message: "Payment request deleted successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBookedRides = async (req, res) => {
  try {
    // Retrieve userId from request
    const userId = req.userId;

    // Find all booked rides where passengerId is equal to userId
    const bookedRides = await BookedRide.find({ passengerId: userId });

    // Send the booked rides as the response
    res.json(bookedRides);
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error fetching booked rides:", error);
    res.status(500).json({ error: "Unable to fetch booked rides" });
  }
};

const getCoRiders = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is available in req.userId
    const rideId = req.params.rideId;

    // Find all documents from BookedRide schema where rideId matches and passengerId is not equal to userId
    const coRiders = await BookedRide.find({
      rideId: rideId,
      passengerId: { $ne: userId },
    }).select("passengerId passengerName passengerImageUrl pastRideId");

    // Send the co-riders data as response
    res.status(200).json(coRiders);
  } catch (error) {
    console.error("Error fetching co-riders:", error);
    res.status(500).json({ error: "Unable to fetch co-riders" });
  }
};

const postRatings = async (req, res) => {
  try {
    // Assuming req.userId contains the user's ID

    // Iterate over each key-value pair in the map
    console.log(req.body);
    for (const [pastRideId, ratingValue] of Object.entries(req.body)) {
      // Find the document of PastRide schema for the given pastRideId
      const pastRide = await PastRide.findById(pastRideId);

      // Check if the pastRide exists
      if (!pastRide) {
        return res.status(404).json({
          success: false,
          message: `PastRide with ID ${pastRideId} not found`,
        });
      }

      // Initialize the ratings map if it's undefined
      if (!pastRide.ratings) {
        pastRide.ratings = new Map();
      }

      // Update the ratings map for the current user
      pastRide.ratings.set(req.userId, ratingValue);

      // Save the updated document
      await pastRide.save();
    }

    // Respond with success message
    res
      .status(200)
      .json({ success: true, message: "Ratings updated successfully" });
  } catch (error) {
    console.error("Error updating ratings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getDriverRides = async (req, res) => {
  try {
    // Extract userId from req
    const { userId } = req;

    // Find documents from AvailableRide schema where driverId is userId
    const availableRides = await AvailableRide.find({ driverId: userId });

    // Initialize an array to store results
    const driverRides = [];

    // Loop through availableRides
    for (const ride of availableRides) {
      // Find documents from BookedRide schema where rideId is equal to _id of availableRide
      const bookedRides = await BookedRide.find({ rideId: ride._id }).select(
        "_id pastRideId passengerId passengerName passengerImageUrl seats pickUp destination pickUpAddress destinationAddress pickUpDate pickUpTime distance rideCancelled unitCost codeVerified"
      );

      // Add passengers information to the availableRide document
      const rideWithPassengers = {
        ...ride.toObject(), // Convert Mongoose document to plain JavaScript object
        passengers: bookedRides,
      };

      // Add the ride with passengers to the result array
      driverRides.push(rideWithPassengers);
    }

    // Respond with the driver rides
    res.status(200).json(driverRides);
  } catch (error) {
    console.error("Error fetching driver rides:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const rideRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { userData, rideData } = req.body;
    const driver = await User.findById(rideData.driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const requestData = {
      requesterId: userData.userId,
      requesterImageUrl: userData.imageUrl,
      requesterName: userData.name,
      ...rideData,
    };

    if (!driver.rideRequests) {
      driver.rideRequests = new Map();
    }

    const key = uuid.v1();
    driver.rideRequests.set(key, requestData);
    await driver.save();

    res.status(200).json({ message: "Ride request sent successfully" });
  } catch (error) {
    console.error("Error in rideRequest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { _id, code } = req.body;

    const bookedRide = await BookedRide.findById(_id);

    if (!bookedRide) {
      throw new Error("Ride not found");
    }

    if (bookedRide.codeVerified) {
      return res.json({ rideCancelled: false, codeVerified: true });
    }

    if (bookedRide.rideCancelled) {
      return res.json({ rideCancelled: true, codeVerified: false });
    }
    console.log(bookedRide.verificationCode);
    if (bookedRide.verificationCode != code) {
      return res.json({ rideCancelled: false, codeVerified: false });
    }

    bookedRide.codeVerified = true;
    await bookedRide.save();

    const transaction = await Transaction.findById(bookedRide.transactionId);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    transaction.codeVerified = true;
    await transaction.save();

    // const payout = await stripe.payouts.create({
    //   amount: 1100,
    //   currency: "usd",
    // });

    const driver = await User.findById(req.userId);
    driver.wallet += transaction.amountPaid;
    await driver.save();

    return res.json({ rideCancelled: false, codeVerified: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};
const getPastRides = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is available in req.userId

    // Find all documents from PastRide schema where userId matches
    const pastRides = await PastRide.find({ userId }).sort({ createdAt: -1 });

    // Calculate average rating for each past ride
    const pastRidesWithAverageRating = await Promise.all(
      pastRides.map(async (ride) => {
        let totalRating = 0;
        let numberOfRatings = 0;

        if (ride.ratings && ride.ratings instanceof Map) {
          ride.ratings.forEach((value) => {
            if (
              value &&
              typeof value === "object" &&
              value.rating !== undefined
            ) {
              totalRating += value.rating;
              numberOfRatings++;
            }
          });
        }

        const averageRating =
          numberOfRatings > 0 ? totalRating / numberOfRatings : 0;

        return { ...ride.toObject(), averageRating };
      })
    );

    // console.log("The past rides are:", pastRidesWithAverageRating);

    // Send the past rides data with average rating as response
    res.status(200).json(pastRidesWithAverageRating);
  } catch (error) {
    console.error("Error fetching Past Rides:", error);
    res.status(500).json({ error: "Unable to fetch past rides" });
  }
};

const cancelRide = async (req, res) => {
  const { bookedId } = req.body;

  try {
    const bookedRide = await BookedRide.findById(bookedId.toString());

    if (!bookedRide) {
      return res.json({ message: "Too late to cancel ride" });
    }

    if (bookedRide.codeVerified) {
      return res.json({
        message: "Cannot cancel after sharing verification code",
      });
    }

    if (bookedRide.rideCancelled) {
      return res.json({ message: "Ride already cancelled" });
    }

    const prevTransaction = await Transaction.findById(
      bookedRide.transactionId
    );

    const refund = await stripe.refunds.create({
      charge: prevTransaction.latest_charge,
    });

    if (refund.status !== "succeeded") {
      return res.json({ message: "Refund failed" });
    }

    bookedRide.rideCancelled = true;
    await bookedRide.save();

    // prevTransaction.rideCancelled = true;
    // await prevTransaction.save();

    const newTransaction = new Transaction({
      intentId: refund.payment_intent,
      amountPaid: refund.amount,
      latest_charge: refund.charge,
      paidBy: "65f551b716afb9bbd90758c0",
      paidTo: prevTransaction.paidBy,
      unitCost: prevTransaction.unitCost,
      distance: prevTransaction.distance,
      seats: prevTransaction.seats,
      codeVerified: false,
      rideCancelled: true,
      rideId: prevTransaction.rideId,
      driverName: prevTransaction.driverName,
      source: prevTransaction.source,
      destination: prevTransaction.destination,
    });

    await newTransaction.save();

    const pastRide = await PastRide.findById(bookedRide.pastRideId);
    pastRide.rideCancelled = true;
    await pastRide.save();

    // Send success message
    return res.status(200).json({ message: "Ride cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling ride:", error);
    // Handle other errors
    return res.status(500).json({ message: "Internal server error" });
  }
};

const cancelPublishedRide = async (req, res) => {
  const { rideId } = req.body;
  try {
    const ride = await AvailableRide.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    // Delete the ride
    await ride.deleteOne();

    const bookedRides = await BookedRide.find({ rideId: rideId.toString() });
    for (const bookedRide of bookedRides) {
      if (bookedRide.codeVerified || bookedRide.rideCancelled) {
        // Skip if code is verified or ride is already cancelled
        continue;
      }

      const prevTransaction = await Transaction.findById(
        bookedRide.transactionId
      );

      const refund = await stripe.refunds.create({
        charge: prevTransaction.latest_charge,
      });

      if (refund.status !== "succeeded") {
        // Skip if refund failed
        continue;
      }

      bookedRide.rideCancelled = true;
      await bookedRide.save();

      const newTransaction = new Transaction({
        intentId: refund.payment_intent,
        amountPaid: refund.amount,
        latest_charge: refund.charge,
        paidBy: "65f551b716afb9bbd90758c0",
        paidTo: prevTransaction.paidBy,
        unitCost: prevTransaction.unitCost,
        distance: prevTransaction.distance,
        seats: prevTransaction.seats,
        codeVerified: false,
        rideCancelled: true,
        rideId: prevTransaction.rideId,
        driverName: prevTransaction.driverName,
        source: prevTransaction.source,
        destination: prevTransaction.destination,
      });

      await newTransaction.save();

      const pastRide = await PastRide.findById(bookedRide.pastRideId);
      pastRide.rideCancelled = true;
      await pastRide.save();
    }

    // Send success message
    return res.status(200).json({ message: "Ride cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling ride:", error);
    // Handle other errors
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  postRide,
  getRequests,
  postRequests,
  getAcceptedRides,
  postDeclinePayment,
  getBookedRides,
  getCoRiders,
  postRatings,
  getDriverRides,
  rideRequest,
  verifyCode,
  getPastRides,
  cancelRide,
  cancelPublishedRide,
  findRides,
};
