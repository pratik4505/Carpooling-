const router = require("express").Router();
const { postRide } = require("../controllers/rideController");

router.post("/publishRide", postRide);

module.exports = router;
