const router = require("express").Router();
const { postRide } = require("../controllers/rideController");
const { findRides } = require("../controllers/getRides");

router.post("/publishRide", postRide);
router.post("/getAvaliableRides", findRides);

module.exports = router;
