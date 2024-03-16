const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let loadedUser = await User.findOne({ emailId: email });
    if (!loadedUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isEqual = await bcrypt.compare(password, loadedUser.password);

    if (!isEqual) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        emailId: loadedUser.emailId,
        userId: loadedUser._id.toString(),
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    var isDlVerified = false;

    if (loadedUser.dlNumber && loadedUser.dob) {
      isDlVerified = true;
    }

    res.status(200).json({
      data: {
        accessToken: token,
        userId: loadedUser._id.toString(),
        emailId: loadedUser.emailId,
        name: loadedUser.name,
        imageUrl: loadedUser.imageUrl,
      },
      isDlVerified,
    });
  } catch (err) {
    // Handle other errors
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const userName = req.body.userName;

  try {
    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      emailId: email,
      password: hashedPassword,
      name: userName,
    });

    // Save the user to the database
    const result = await user.save();

    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    // Handle other errors
    console.error("Error during sign up:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = signUp;

const dlVerified = async (req, res) => {
  const { dlNumber, dob } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.dob = dob;
    user.dlNumber = dlNumber;

    await user.save();

    res
      .status(200)
      .json({ success: "Driving license verified and updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  login,
  signUp,
  dlVerified,
};
