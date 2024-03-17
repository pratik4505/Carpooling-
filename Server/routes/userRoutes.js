const router = require("express").Router();
const {getProfile,getRatings,updateProfile,contactUs}=require('../controllers/userController')
const verifyJWT=require('../middleware/verifyJWT')
router.get("/getProfile/:ownerId",verifyJWT, getProfile);
router.get("/getRatings/:ownerId",verifyJWT, getRatings);
router.post("/updateProfile",verifyJWT, updateProfile);
router.post("/contactUs",verifyJWT, contactUs);
module.exports = router;
 