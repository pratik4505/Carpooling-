const router = require("express").Router();
const {
  getNotifications,
  getLatestNotifications,
} = require("../controllers/notificationController");
const verifyJWT = require("../middleware/verifyJWT");
router.get("/getLatest");
router.get("/getNotifications", verifyJWT, getNotifications);
router.get("/getLatestNotifications", verifyJWT, getLatestNotifications);

module.exports = router;
