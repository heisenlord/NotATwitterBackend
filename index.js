require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import route handlers
const generateRouter = require("./generate"); // /generate route
const getPostRouter = require("./getPost"); // /post/:id route
const testGemini = require("./testGemini"); // /testgemini route
const imageRouter = require("./image"); // /image route
const checkUsernameRouter = require("./checkusername"); // /checkusername route
const getPostsByName=require("./getPostsByName")
const getReply=require("./generateReply");

// Initialize Express app
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Use route handlers
app.use("/generate", generateRouter);  // Mount the /generate route
app.use("/post", getPostRouter);  // Mount the /post/:id route
app.use("/testgemini", testGemini);  // Mount the /testgemini route
app.use("/image", imageRouter);  // Mount the /image route
app.use("/check", checkUsernameRouter);  // Mount the /checkusername route
app.use("/posts/",getPostsByName)
app.use("/generatereply",getReply)
// Global error handler (catch all errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
