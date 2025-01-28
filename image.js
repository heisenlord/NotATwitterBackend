const express = require("express");
const router = express.Router();

// Define the mapping of user IDs to Google Image URLs
const GoogleImageUrls = {
  "@mkbhd": "https://yt3.googleusercontent.com/lkH37D712tiyphnu0Id0D5MwwQ7IRuwgQLVD05iMXlDWO-kDHut3uI4MgIEAQ9StK0qOST7fiA=s900-c-k-c0x00ffffff-no-rj",
  "@MrWhoseTheBoss": "https://www.google.com/search?q=MrWhoseTheBoss&tbm=isch",
  "@Casey": "https://www.google.com/search?q=Casey&tbm=isch",
  "@pewdiepie": "https://www.google.com/search?q=pewdiepie&tbm=isch",
  "@unboxtherapy": "https://www.google.com/search?q=unboxtherapy&tbm=isch",
  "@Dave2D": "https://www.google.com/search?q=Dave2D&tbm=isch",
  "@austinnotdave": "https://www.google.com/search?q=austinnotdave&tbm=isch",
  "@MrBeast": "https://www.google.com/search?q=MrBeast&tbm=isch",
  "@LinusTech": "https://www.google.com/search?q=LinusTech&tbm=isch",
  "@ijustine": "https://www.google.com/search?q=ijustine&tbm=isch",
  // Add more users as needed
};

// Route to handle requests for a specific user ID
router.get("/:userid", (req, res) => {
  const { userid } = req.params;
  const imageUrl = GoogleImageUrls[`@${userid}`]; // Find the URL for the given user ID

  if (imageUrl) {
    // Respond with the image URL if found
    console.log("found image url", imageUrl);
    res.json({
      success: true,
      message: `Image search link for user: @${userid}`,
      imageUrl,
    });
  } else {
    // Respond with an error if the user ID is not found
    res.status(404).json({
      success: false,
      message: `User ID "@${userid}" not found.`,
    });
  }
});

module.exports = router;
