const express = require("express");
const router = express.Router();
const User = require("./models/user"); // Assuming you have a User model

// Route to save a new user
router.post("/saveuser/u", async (req, res) => {
  try {
    const { username, profilePic, password } = req.body;

    // Ensure all required fields are provided
    if (!username || !profilePic || !password) {
      return res.status(400).json({ success: false, message: "Username, password, and profile picture are required" });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username is already taken" });
    }

    // Create a new user
    const newUser = new User({
      username,
      profilePic,
      password, // Store password securely in a real-world scenario (e.g., bcrypt hash)
    });

    // Save user to database
    await newUser.save();

    res.json({ success: true, message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route to check if a username exists and validate password
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({
        success: true,
        message: "Username found",
        password: existingUser.password, // Returning stored password for frontend validation
        profilePic: existingUser.profilePic,
      });
    }

    return res.json({ success: false, message: "Username is available" });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
