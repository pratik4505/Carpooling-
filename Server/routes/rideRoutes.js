const router = require("express").Router();
const { postRide,getRequests,postRequest,getAcceptedRides,postDeclinePayment } = require("../controllers/rideController");
const { findRides } = require("../controllers/getRides");

router.post("/publishRide", postRide);
router.post("/getAvaliableRides", findRides);
router.get('/getRequests',getRequests);
router.get('/postRequests',postRequest);

router.get('/getAccepetedRides',getAcceptedRides)
router.post('/postDeclinePayment', postDeclinePayment)
module.exports = router;
