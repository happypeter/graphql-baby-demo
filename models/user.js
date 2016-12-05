const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
);
module.exports = mongoose.model('User', userSchema);
