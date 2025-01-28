const express = require("express");
const Database = require("./models/mongo"); // Import the Database model

const router = express.Router();

// GET route to fetch a specific post by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the post by ID in the database
    const post = await Database.findOne({ id });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Return the found post
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Error fetching post" });
  }
});

module.exports = router;
