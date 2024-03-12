const router = require("express").Router();
<<<<<<< HEAD
const {
  postRide,
  getRequests,
  postRequest,
} = require("../controllers/rideController");
=======
const { postRide,getRequests,postRequest,getAcceptedRides,postDeclinePayment,getBookedRides, postRatings,getDriverRides} = require("../controllers/rideController");
>>>>>>> 7f07639813311fff449bd9ce5bb12148b0305d88
const { findRides } = require("../controllers/getRides");

router.post("/publishRide", postRide);
router.post("/getAvaliableRides", findRides);
<<<<<<< HEAD
router.get("/getRequests", getRequests);
router.get("/postRequests", postRequest);
=======
router.get('/getRequests',getRequests);
router.post('/postRequests',postRequest);

router.get('/getAccepetedRides',getAcceptedRides)
router.post('/postDeclinePayment', postDeclinePayment)

router.get('/getBookedRides',getBookedRides);
router.get('/getCoRiders/:rideId',getCoRiders);
router.post('/postRatings',postRatings);
router.post('/getDriverRides',getDriverRides);

>>>>>>> 7f07639813311fff449bd9ce5bb12148b0305d88
module.exports = router;
