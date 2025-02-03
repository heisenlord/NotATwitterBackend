const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  postid: {
    type: String,
  },
  username: { 
    type: [String], // This should be an array of strings
  },
  profilePic: { 
    type: [String], // This should be an array of strings as well
  },
  post: {
    type: String,
  },
  Replies: {
    type: [{ // This is an array of objects
      userID: String, 
      reply: String,
      profilePic: String
    }],
  }
}, { 
  collection: "Replies",
  timestamps: true 
});

const Replies = mongoose.model('Replies', replySchema);

module.exports = Replies;
