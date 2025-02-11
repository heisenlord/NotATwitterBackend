const express = require("express");
const { generateContent } = require("./gemini"); // Assuming this is your function to generate content
const Database = require("./models/mongo"); // Import the Database model
require("dotenv").config(); 
const router = express.Router();

// POST route to generate content
router.post("/", async (req, res) => {
  const SystemPrompt = process.env.SYSTEM_PROMPT;
  const { prompt, pid,name ,profilePic} = req.body;

  if (!prompt) {
    console.error("Prompt is missing in the request body");
    return res.status(400).json({ error: "Prompt is required" });
  }

  const fullPrompt = SystemPrompt + prompt;

  try {
    // Generate the sarcastic replies using your content generation function
    const content = await generateContent(fullPrompt);
    console.log("Content generated successfully:", content);
    console.log(pid);

    // Create a new post to save in the database
    const newPost = new Database({
      id: pid,
      profilePic:profilePic,
      name:name, // Replace with actual user ID if available
      handle: name, // Generate a unique ID for the post
      tweet: prompt, // Optional, replace with actual image URL if available
      replies: content, // This will be the sarcastic replies generated
    });

    // Save the post to MongoDB
    const savedPost = await newPost.save();
    console.log("Post saved to database:", savedPost);

    // Respond with the saved post data, including the sarcastic replies
    res.status(201).json({
      message: "Content generated and saved successfully",
      post: savedPost, // Return the full saved post object
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Error generating content" });
  }
});

module.exports = router;
