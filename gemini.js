// gemini.js

require('dotenv').config();  // Load environment variables from the .env file

// Import GoogleGenerativeAI (assuming it's a valid package)
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API client using the API key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Select the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate content based on a prompt
const generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();  // Return the generated text
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;  // Rethrow to handle in the caller
  }
};

module.exports = { generateContent };
