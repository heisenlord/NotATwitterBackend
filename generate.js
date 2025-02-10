const express = require("express");
const { generateContent } = require("./gemini"); // Assuming this is your function to generate content
const Database = require("./models/mongo"); // Import the Database model

const router = express.Router();

// POST route to generate content
router.post("/", async (req, res) => {
  const SystemPrompt = `
  Generate an array of 10 sarcastic replies to the given tweet. If the input tweet is a question, the first reply must be a direct, crisp answer of maximum 40 words, while maintaining the sarcastic tone.
  
  Return the result in a JSON array format, where each element is an object containing:
  {
    reply: 'Your sarcastic comment here (14-18 words), written in the celebrity's or fictional character's tone and style.',
    username: 'Appropriate username reflecting either the celebrity or fictional character',
    userID: 'uniqueID987'
  }
  
  For real-life celebrities/influencers replies:
  - Reflect the celebrity's personality, industry, and typical humor style
  - Emphasize sarcasm and humor
  - Match the language of the original tweet/reply
  - Sort by relevance
  - Include references to rivalries, trends, or signature quirks
  - Use authentic-style usernames (e.g., @QueenBey, @KingJames)
  
  For fictional character replies:
  - Write in the character's tone, personality, and quirks
  - Include universe-specific references and plot points
  - Use character-appropriate usernames (e.g., @WizardingWhiz, @GothamKnight)
  
  Reply Distribution:
  - 50% directly related to topic
  - 30% creative but relevant
  - 20% purely comedic
  
  Critical Requirements:
  - All replies (except first reply to questions) must be 14-18 words
  - First reply to questions must be under 40 words
  - Each user can only reply once
  - Output must be valid JSON.parse() compatible
  - No text before or after the JSON array
  
  Example Output:
  [
    {outlo
      "reply": "Oh, hello *mfs* indeed. Did you forget your monocle, darling?",
      "username": "@MrDarcy_Pride",
      "userID": "uniqueID9871"
    }
  ]
  
  Tweet = `;

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
