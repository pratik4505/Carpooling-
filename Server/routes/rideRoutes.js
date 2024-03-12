const router = require("express").Router();
const {
  postRide,
  getRequests,
  postRequest,
} = require("../controllers/rideController");
const { postRide,getRequests,postRequest,getAcceptedRides,postDeclinePayment,getBookedRides, postRatings,getDriverRides} = require("../controllers/rideController");
const { findRides } = require("../controllers/getRides");

router.post("/publishRide", postRide);
router.post("/getAvaliableRides", findRides);
router.get("/getRequests", getRequests);
router.get("/postRequests", postRequest);

router.get('/getAccepetedRides',getAcceptedRides)
router.post('/postDeclinePayment', postDeclinePayment)

router.get('/getBookedRides',getBookedRides);
router.get('/getCoRiders/:rideId',getCoRiders);
router.post('/postRatings',postRatings);
router.post('/getDriverRides',getDriverRides);
module.exports = router;
