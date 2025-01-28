const express = require('express');
const { generateContent } = require('./gemini');
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        // Assuming the request body contains the necessary data for Gemini content generation
        const {prompt} = req.body;

        // Call the generateContent function with the data
        const content = await generateContent(prompt);

        // Send the generated content back as a response
        res.status(200).json({ success: true, content });
    } catch (error) {
        // Handle any errors that occur
        console.error("Error generating content:", error);
        res.status(500).json({ success: false, message: "An error occurred while generating content." });
    }
});

module.exports = router;
