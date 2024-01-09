// redis.js i have used a dp array to demonstrate redis
const cache = [];

// Function to set user data in the cache
const setUserDataInCache = (userId, userData) => {
    const cachedUser = cache.find((item) => item.userId === userId);

    if (cachedUser) {
        // Update existing cache entry
        cachedUser.userData = userData;
    } else {
        // Add new cache entry
        cache.push({ userId, userData });
    }
};

// Function to get user data from the cache
const getUserDataFromCache = (userId) => {
    const cachedUser = cache.find((item) => item.userId === userId);

    return cachedUser ? cachedUser.userData : null;
};

// Function to remove user data from the cache
const removeUserDataFromCache = (userId) => {
    const index = cache.findIndex((item) => item.userId === userId);

    if (index !== -1) {
        // Remove cache entry
        cache.splice(index, 1);
    }
};

module.exports = {
    setUserDataInCache,
    getUserDataFromCache,
    removeUserDataFromCache,
};
