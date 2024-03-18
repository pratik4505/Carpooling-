const Notification = require("../models/Notification");
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    // Extracting notification IDs
    const notificationIds = notifications.map(
      (notification) => notification._id
    );

    // Update seen to true for notifications fetched
    await Notification.bulkWrite(
      notificationIds.map((id) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { seen: true } },
        },
      }))
    );

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Error fetching notifications" });
  }
};
const getLatestNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.userId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Extracting notification IDs
    const notificationIds = notifications.map(
      (notification) => notification._id
    );

    // Update seen to true for notifications fetched
    await Notification.bulkWrite(
      notificationIds.map((id) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { seen: true } },
        },
      }))
    );

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching latest notifications:", err);
    res.status(500).json({ error: "Error fetching latest notifications" });
  }
};

module.exports = {
  getLatestNotifications,
  getNotifications,
};
