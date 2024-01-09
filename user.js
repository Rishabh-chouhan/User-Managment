// user.js
const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    age: Number,
    location: String,
    interests: [String],
    income: Number,
});

// Create User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
