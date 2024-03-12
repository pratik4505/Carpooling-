const router = require("express").Router();
const { postRide,getRequests,postRequest,getAcceptedRides,postDeclinePayment,getBookedRides, postRatings} = require("../controllers/rideController");
const { findRides } = require("../controllers/getRides");

router.post("/publishRide", postRide);
router.post("/getAvaliableRides", findRides);
router.get('/getRequests',getRequests);
router.post('/postRequests',postRequest);

router.get('/getAccepetedRides',getAcceptedRides)
router.post('/postDeclinePayment', postDeclinePayment)

router.get('/getBookedRides',getBookedRides);
router.get('/getCoRiders/:rideId',getCoRiders);
router.post('/postRatings',getCoRiders);
module.exports = router;
