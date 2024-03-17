const User = require("../models/User");
const PastRide = require("../models/PastRide");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const clearImage = (filePath) => {
  filePath = path.join(__dirname, filePath);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error clearing image:", err);
      }
    });
  }
};
const getProfile = async (req, res) => {
  const openerId = req.userId;
  const ownerId = req.params.ownerId;
  try {
    const user = await User.findById(ownerId).select("name about imageUrl");

    res.status(200).json(user);
  } catch (error) {
    // Handle errors
    console.error("Error retrieving user details", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getRatings = async (req, res) => {
  const ownerId = req.params.ownerId;

  try {
    // Retrieve the documents with the `ratings` field where userId is equal to ownerId
    const pastRides = await PastRide.find({
      userId: ownerId,
      ratings: { $exists: true, $ne: null }, // Filter out documents where the ratings field does not exist or is null
    }).select("ratings"); // Select only the ratings field

    // If pastRides is not empty, return the documents
    res.status(200).json(pastRides);
  } catch (error) {
    // Handle errors
    console.error("Error retrieving past rides:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    // Extract the updated profile data from the request body
    const userId = req.userId;
    const { name, about } = req.body;
    const image = req.files["image"] ? req.files["image"][0].path : null;
    console.log(req);
    // Find the user by userId
    const user = await User.findById(userId);
    if (user?.imageUrl) clearImage(user.imageUrl);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user object with the new profile data
    user.name = name;
    user.about = about;
    if (image) {
      user.imageUrl = image;
    }

    // Save the updated user object
    await user.save();

    // Return the updated profile data as response
    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

const contactUs = async (req,res) => {
  try {
    const { name, email, contactNo, message } = req.body;

   
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const info = transporter.sendMail({
      to: process.env.EMAIL,
      subject: "New Message from Contact Form",
      text: `
          Name: ${name}
          Email: ${email}
          Contact No: ${contactNo}
          Message: ${message}
        `,
    });
    res.status(200).json({message:"Email sent successfully"});
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
};

module.exports = {
  getProfile,
  getRatings,
  updateProfile,
  contactUs,
};
