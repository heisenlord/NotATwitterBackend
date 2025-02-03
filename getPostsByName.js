const express = require("express");
const Post = require("./models/mongo"); // Import your Mongoose Post model

const router = express.Router();

// Fetch all posts by name
router.get("/byname/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const posts = await Post.find({ name: new RegExp(name, "i") }); // Case-insensitive search
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts by name:", error);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
});

module.exports = router;
