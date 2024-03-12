const router = require("express").Router();
const {
  postRide,
  getRequests,
  postRequest,
} = require("../controllers/rideController");
const { findRides } = require("../controllers/getRides");

router.post("/publishRide", postRide);
router.post("/getAvaliableRides", findRides);
router.get("/getRequests", getRequests);
router.get("/postRequests", postRequest);
module.exports = router;
