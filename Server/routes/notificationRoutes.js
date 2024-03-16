const router = require("express").Router();
const {getNotifications}=require('../controllers/notificationController')
const verifyJWT = require("../middleware/verifyJWT");
router.get("/getNotifications", verifyJWT, getNotifications);

module.exports = router;
