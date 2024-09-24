const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  // Add any other fields you want to store
});

module.exports = mongoose.model('User', userSchema);