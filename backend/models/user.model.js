const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
