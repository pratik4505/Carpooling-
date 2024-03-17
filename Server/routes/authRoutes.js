const router = require("express").Router();

const {
  login,
  signUp,
  dlVerified,
  getDlVerified,
  signUpOTP,
  forgotOTP,
  changePassword,
} = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../models/User");
const verifyJWT = require("../middleware/verifyJWT");



router.post(
  "/signUp",
  [
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
  ],
  signUp
);
router.post("/login", login);
router.post("/dlVerified", verifyJWT, dlVerified);
router.get("/getDlVerified", verifyJWT, getDlVerified);

router.post(
  "/signUpOTP",
  [
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
  ],
  signUpOTP
);

router.post(
  "/forgotOTP",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .custom((email, { req }) => {
        return User.findOne({ emailId: email }).then((user) => {
          if (!user) {
            return Promise.reject("User with this email does not exist.");
          }
        });
      }),
  ],
  forgotOTP
);

router.post(
  "/changePassword",
  [
    body("password")
      .trim()
      .isLength({ min: 8 })
      // .withMessage("Password must be at least 8 characters long")
      // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
      // .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  ],
  changePassword
);
module.exports = router;
