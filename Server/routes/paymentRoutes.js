const router = require("express").Router();
const {checkout} = require('../controllers/paymentController');

router.post("/create-checkout-session", checkout);

module.exports = router;
