const router = require("express").Router();
const { getTransactions } = require("../controllers/transactions");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", verifyJWT, getTransactions);

module.exports = router;
