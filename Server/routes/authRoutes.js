const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/", authController.login);
router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);

module.exports = router;
