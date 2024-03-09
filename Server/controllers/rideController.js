const AvailableRide = require("../models/AvailableRide");

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

module.exports = { postRide };
