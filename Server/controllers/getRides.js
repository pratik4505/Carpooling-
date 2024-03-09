const AvailableRide = require("../models/AvailableRide");

const findRides = async (req, res) => {
  try {
    const { origin, destination, date } = req.body;
    const rides = await AvailableRide.find({ date: date });
    console.log("Filtered rides:", rides);
    res.status(200).json(rides);
  } catch (err) {
    console.error("Error fetching rides:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { findRides };
