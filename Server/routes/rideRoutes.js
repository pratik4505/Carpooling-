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
  verifyCode
} = require("../controllers/rideController");
const { findRides } = require("../controllers/getRides");
const verifyJWT=require('../middleware/verifyJWT')
router.post("/publishRide",verifyJWT, postRide);
router.post("/getAvaliableRides",verifyJWT, findRides);
router.get("/getRequests",verifyJWT, getRequests);
router.post("/postRequests",verifyJWT, postRequests);

router.get("/getAccepetedRides",verifyJWT, getAcceptedRides);
router.post("/postDeclinePayment",verifyJWT, postDeclinePayment);

router.get("/getBookedRides",verifyJWT, getBookedRides);
router.get("/getCoRiders/:rideId",verifyJWT, getCoRiders);
router.post("/postRatings", verifyJWT,postRatings);
router.get("/getDriverRides",verifyJWT, getDriverRides);
router.post("/rideRequest",verifyJWT,rideRequest);
router.post('/verifyCode',verifyCode);

module.exports = router;
