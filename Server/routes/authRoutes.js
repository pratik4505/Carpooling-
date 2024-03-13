const router = require("express").Router();
const authController = require("../controllers/authController");
const {login,signUp} = require("../controllers/auth");
const { body } = require('express-validator');
const User=require("../models/User");
// router.post("/", authController.login);
router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.post('/signUp',[
    body("userName").trim().notEmpty(),

    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((email, { req }) => {
        return User.findOne({ emailId: email }).then((us) => {
          if (us) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),

    body("password").trim().isLength({ min: 8 }),
    
  ],signUp);
router.post('/login', login);

module.exports = router;
