const router = require("express").Router();
const {checkout,paymentWebhook} = require('../controllers/paymentController');
const verifyJWT=require('../middleware/verifyJWT')
router.post("/create-checkout-session",verifyJWT, checkout);
router.post("/confirmPaymentWebhook", paymentWebhook);

module.exports = router;
