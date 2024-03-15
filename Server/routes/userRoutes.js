const router = require("express").Router();
const {getProfile}=require('../controllers/userController')
const verifyJWT=require('../middleware/verifyJWT')
router.post("/getProfile/:ownerId",verifyJWT, getProfile);

module.exports = router;
 