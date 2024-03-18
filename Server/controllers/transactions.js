// const AvailableRide = require("../models/AvailableRide");
// const User = require("../models/User");
// const BookedRide = require("../models/BookedRide");
// const PastRide = require("../models/PastRide");
// const Chat = require("../models/Chat");
// const uuid = require("uuid");
const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    // If userId is not provided, send a 400 Bad Request response
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Find transactions by paidBy userId
    const transactions = await Transaction.find({
      $or: [{ paidBy: userId }, { paidTo: userId }],
    }).sort({ createdAt: -1 });

    // Send transactions as the response
    return res.status(200).json(transactions);
  } catch (error) {
    // If an error occurs during database operation, send a 500 Internal Server Error response
    console.error("Error fetching Transactions :", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getTransactions };
