const express = require("express");
const { generateContent } = require("./gemini"); // Assuming this is your function to generate content
const { v4: uuidv4 } = require("uuid");
const Database = require("./models/mongo"); // Import the Database model

const router = express.Router();

// POST route to generate content
router.post("/", async (req, res) => {
    const SystemPrompt = `
    Generate an array of 10 sarcastic replies to the given tweet. Return the result in a JSON array format, where each element is an object containing:
    {
      reply: 'Your sarcastic comment here (14-18 words), written in the celebrity's or fictional character's tone and style.',
      username: 'Appropriate username reflecting either the celebrity or fictional character',
      userID: 'uniqueID987'
    }
    If the tweet is related to **real-life celebrities/influencers**, ensure:
    - The replies reflect the celebrity's personality, industry, and typical humor or sarcasm style.
    - Make sure tweet more sarcastic and funny.
    - sort the replies which are more relevant to less relevant.
    - Incorporate relevant topics like rivalries, trends, or their signature quirks.
    - Use usernames resembling their public persona (e.g., @QueenBey, @KingJames).
    If the tweet is related to **fictional characters**, ensure:
    - Replies are written in the tone, personality, and quirks of the character.
    - Include references to their universe, rivalries, or significant plot points.
    - Use usernames reflective of the character (e.g., @WizardingWhiz for Harry Potter, @GothamKnight for Batman).
    Make sure the replies are heavily sarcastic, 14-18 words long, and match the tweet's context.
    Additional Constraints:
    - 50% of replies should directly relate to the topic.
    - 30% should be out-of-the-box replies that sync with the topic.
    - 20% should be comedic replies designed to make people laugh.
    - Ensure user IDs appear authentic and mimic real social media accounts.
    - CRITICAL NEW RULE: Return the entire output as a valid JSON array that can be directly parsed by JSON.parse()
    --Output should exactly look like example below don't add anything before and after--
    --IMPORTANT--Make sure same user shouldn't reply more than once.
    Output Format Example:
    '[
      {
        reply: "Oh, hello *mfs* indeed. Did you forget your monocle, darling?",
        username: "@MrDarcy_Pride",
        userID: "uniqueID9871"
      },
      {
        reply: "Greetings, mortals. Is the apocalypse upon us, or just another Tuesday?",
        username: "@DrStrange_616",
        userID: "uniqueID9872"
      }
      // ... remaining replies
    ]'
    
    Tweet =
  `; 

  const { prompt, pid } = req.body;

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
      profilePic: "tt1.jpg",
      name: "some_user_name", // Replace with actual user ID if available
      handle: "some_user_id", // Generate a unique ID for the post
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
