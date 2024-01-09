// app.js
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const fs = require('fs');
const User = require('./user'); // Import User Schema
const app = express();
const { userSchemaValidation, validatePayload } = require('./schema');
const AUTH_KEY = 'rishabh';
const PORT = 3000;
app.use(express.json());
const { setUserDataInCache, getUserDataFromCache, removeUserDataFromCache } = require('./redis');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/user_management_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware for Authentication
const authenticate = (req, res, next) => {
    const authHeader = req.headers['auth'];

    if (!authHeader || authHeader !== AUTH_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};


app.post('/api/users', authenticate, validatePayload(userSchemaValidation), async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        // Update Redis-like cache with user data
        setUserDataInCache(user._id, user);

        res.json(user); // Return the entire user object
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Get All Users API
app.get('/api/users', authenticate, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/users/:id', authenticate, async (req, res) => {
    const userId = req.params.id;

    // Check if user data is in the cache
    const cachedUserData = getUserDataFromCache(userId);

    if (cachedUserData !== null) {
        // User data found in the cache
        res.json(cachedUserData);
    } else {
        // User data not found in the cache, fetch from MongoDB
        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update Redis-like cache with user data
            setUserDataInCache(user._id, user);

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
// Update User by ID API
app.put('/api/users/:id', authenticate, validatePayload(userSchemaValidation), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete User by ID API
app.delete('/api/users/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
