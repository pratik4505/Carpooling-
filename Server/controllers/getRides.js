const AvailableRide = require("../models/AvailableRide");

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
