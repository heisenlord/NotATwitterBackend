const express = require("express");
const { generateContent } = require("./gemini");
const Database = require("./models/replies");

const router = express.Router();
router.get("/getreplies/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the post by its ID (pid)
      const post = await Database.findOne({ postid: id });
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      // Return the replies for the post
      res.status(200).json({
        message: "Replies fetched successfully!",
        replies: post.Replies, // Return the replies array
      });
    } catch (error) {
      console.error("Error fetching replies:", error);
      res.status(500).json({ error: "Failed to fetch replies" });
    }
  });
router.post("/", async (req, res) => {
  const { prompt, pid, name, profilePic, postReply } = req.body;

  // Validate input
  if (!prompt || !postReply) {
    return res.status(400).json({ error: "Tweet and reply text are required!" });
  }

  // Prepare prompt for sarcasm generation
 const replyPrompt = `
  Generate a reply based on this user reply: "${postReply}" to the original tweet: "${prompt}".
  
  If the original tweet contains a question mark (?), make the reply:
  - More focused on providing a helpful answer
  - Maintain a light touch of wit but prioritize being informative
  - Maximum 40 words
  
  If the original tweet does NOT contain a question mark, make the reply:
  - 14-18 words
  - Witty and sarcastic
  - Mimic the tone of a social media reply
  
  General rules:
  - If the user reply or the original post is in a specific language, respond in that language
  - Return the response in JSON format like:
  '[{
    reply: "Your response here",
    username: "${name[1]}",
    userID: "${name[1]}"
  }]'
`

  try {
    // Generate sarcastic reply
    let generatedReplies = await generateContent(replyPrompt);
    console.log("Generated Replies:", generatedReplies);

    // Clean up the generated reply string by removing markdown formatting
    let revised = generatedReplies.replace(/^\s*```json\s*/, "").replace(/```\s*$/, "").trim();

    // Parse the cleaned-up string into JSON
    try {
      generatedReplies = JSON.parse(revised);  // Parse the cleaned JSON string
      console.log("Generated Replies:", generatedReplies[0].reply);  // Log the reply from the first object in the array
    } catch (error) {
      console.error("Invalid replies JSON:", error);
      return res.status(500).json({ error: "Failed to parse generated reply" });
    }

    // Find the post in the database
    let post = await Database.findOne({ postid: pid });
    console.log({ prompt, pid, name, profilePic, postReply });

    // If post doesn't exist, create a new one
    if (!post) {
      post = new Database({
        postid: pid,
        username: [name[0], name[1]],  // Correct way to assign individual strings
        profilePic: [profilePic[0], profilePic[1]],  // Correct way to assign individual strings
        post: prompt,
        Replies: [] // Initialize an empty Replies array
      });
    }

    // Push the user reply and the generated reply to the Replies array
    post.Replies.push({
      userID: name[0],
      reply: postReply,
      profilePic: profilePic[0]
    });
    post.Replies.push({
      userID: name[1],  // Using individual strings for userID
      reply: generatedReplies[0].reply, // Use the generated reply
      profilePic: profilePic[1]  // Using the correct profile picture string
    });

    // Save the updated post with replies
    const savedPost = await post.save();

    // Send the updated post with replies as part of the response
    res.status(201).json({
      message: "Reply generated and saved successfully!",
      replies: post.Replies, // Send the replies from the post in the response
      post: savedPost,
    });
  } catch (error) {
    console.error("Error generating reply:", error);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

// Fetch replies for a specific post


module.exports = router;
