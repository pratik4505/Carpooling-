const AvailableRide = require("../models/AvailableRide");
const User = require("../models/User");
const BookedRide = require("../models/BookedRide");
const PastRide = require("../models/PastRide");
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
      driverId:userId,
      totalSeats,
      totalTime,
      speed,
      pastRideId:'abc'
    });

    // Save the new AvailableRide to the database
    await newAvailableRide.save();

    const pastRide=new PastRide({
      rideId:newAvailableRide._id,
      userId:userId,
      source,
      destination,
      user:'driver',
      rating:{},
      overview_polyline
    });

    await pastRide.save();
    newAvailableRide.pastRideId=pastRide._id;
    await newAvailableRide.save();
    
    
    console.log("I am here");

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
    return handleApiError(error, res);
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
    for (const [pastRideId, ratingValue] of Object.entries(req.body)) {
      // Find the document of PastRide schema for the given pastRideId
      const pastRide = await PastRide.findById(pastRideId);

      // Check if the pastRide exists
      if (!pastRide) {
        return res
          .status(404)
          .json({
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
        "pastRideId passengerId passengerName passengerImageUrl seats pickUp destination pickUpAddress destinationAddress pickUpDate pickUpTime distance rideCancelled unitCost"
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

const rideRequest = (req, res) => {}

module.exports = {
  postRide,
  getRequests,
  postRequest,
  getAcceptedRides,
  postDeclinePayment,
  getBookedRides,
  getCoRiders,
  postRatings,
  getDriverRides,
  rideRequest
};