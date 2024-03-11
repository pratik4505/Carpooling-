const AvailableRide = require("../models/AvailableRide");
const User = require("../models/User");
const postRide = async (req, res) => {
  // Extract data from request body
  try {
    console.log("I come in postRide backend");
    const { source, destination, date, time, seats, overview_polyline } =
      req.body;

    // Create a new AvailableRide document
    const newAvailableRide = new AvailableRide({
      source,
      destination,
      date,
      time,
      seats,
      overview_polyline,
    });

    // Save the new AvailableRide to the database
    await newAvailableRide.save();

    res.status(201).json(newAvailableRide); // Status code 201: Created
  } catch (err) {
    console.error("Error saving AvailableRide:", err);
    res.status(500).json({ error: "Internal server error" }); // Status code 500: Internal Server Error
  }
};

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

const postRequest = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is extracted from authentication middleware

    // Check if action and key are provided in the request body
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

      requester.pendingPayments.set(key, requestData);
      await requester.save();
    }

    // Save the changes to the user
    await user.save();

    res.status(200).json({ message: "Request processed successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    return handleApiError(error, res);
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

const postDeclinePayment = async () => {
  try {
    const userId = req.userId; // Assuming userId is extracted from authentication middleware

    // Check if action and key are provided in the request body
    const {  key } = req.body;
    if ( !key) {
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
    return handleApiError(error, res);
  }
};

module.exports = {
  postRide,
  getRequests,
  postRequest,
  getAcceptedRides,
  postDeclinePayment,
};
