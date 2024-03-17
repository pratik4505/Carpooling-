const router = require("express").Router();
const {checkout,} = require('../controllers/paymentController');
const verifyJWT=require('../middleware/verifyJWT')
router.post("/create-checkout-session", checkout);


module.exports = router;
 