const router = require("express").Router();
const {checkout,paymentWebhook} = require('../controllers/paymentController');

router.get("/create-checkout-session", checkout);
router.post("/confirmPaymentWebhook", paymentWebhook);

module.exports = router;
