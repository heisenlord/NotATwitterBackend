require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const generateRouter = require("./generate"); // For the /generate route
const getPostRouter = require("./getPost"); // For the /post/:id route
const testGemini = require("./testGemini"); // For the /testgemini route
const imageRouter = require("./Image");
const app = express();

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Use the route files
app.use("/generate", generateRouter); // Mount /generate routes
app.use("/post", getPostRouter); // Mount /post/:id routes
app.use("/testgemini", testGemini); // Mount /testgemini routes
 // Import the image route
app.use("/image", imageRouter); // Mount the /image routes

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
