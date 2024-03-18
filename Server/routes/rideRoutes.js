const router = require("express").Router();
const {
  postRide,
  getRequests,
  postRequests,
  getAcceptedRides,
  postDeclinePayment,
  getBookedRides,
  postRatings,
  getDriverRides,
  getCoRiders,
  rideRequest,
  verifyCode,
  getPastRides,
  cancelRide,
  cancelPublishedRide,
  findRides,
} = require("../controllers/rideController");
const verifyJWT = require("../middleware/verifyJWT");
router.post("/publishRide", verifyJWT, postRide);
router.post("/getAvaliableRides", verifyJWT, findRides);
router.get("/getRequests", verifyJWT, getRequests);
router.post("/postRequests", verifyJWT, postRequests);

router.get("/getAccepetedRides", verifyJWT, getAcceptedRides);
router.post("/postDeclinePayment", verifyJWT, postDeclinePayment);

router.get("/getBookedRides", verifyJWT, getBookedRides);
router.get("/getCoRiders/:rideId", verifyJWT, getCoRiders);
router.post("/postRatings", verifyJWT, postRatings);
router.get("/getDriverRides", verifyJWT, getDriverRides);
router.post("/rideRequest", verifyJWT, rideRequest);
router.post("/verifyCode", verifyJWT, verifyCode);
router.get("/pastrides", verifyJWT, getPastRides);
router.post("/cancelRide", verifyJWT, cancelRide);
router.post("/cancelPublishedRide", verifyJWT, cancelPublishedRide);
module.exports = router;
