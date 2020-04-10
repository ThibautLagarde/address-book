const ctrlAuth = require('../controllers/authentication');
const ctrlProfile = require('../controllers/profile');
const ctrlFriends = require('../controllers/friends');

const express = require('express');
const router = express.Router();

const jwt = require('express-jwt');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

// user management
router.get('/profile', auth, ctrlProfile.profileRead);
router.put('/profile/update', auth, ctrlProfile.profileUpdate);
router.delete('/profile/delete', ctrlProfile.deleteUser)

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// friends management
router.get('/users', ctrlFriends.getAllUsers);
router.put('/addFriend', auth, ctrlFriends.addFriend);
router.put('/removeFriend', auth, ctrlFriends.removeFriend);

module.exports = router;