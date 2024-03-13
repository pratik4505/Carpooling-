const router = require("express").Router();
const {checkout,paymentWebhook} = require('../controllers/paymentController');
const verifyJWT=require('../middleware/verifyJWT')
router.get("/create-checkout-session",verifyJWT, checkout);
router.post("/confirmPaymentWebhook", paymentWebhook);

module.exports = router;
