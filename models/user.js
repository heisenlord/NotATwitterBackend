const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
  },
  profilePic: { 
    type: String, 
    required: true, 
  },
  password: {
    type: String,
    required: true, // Ensure password is provided
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
