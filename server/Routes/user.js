const express = require('express');
const router = express.Router();

//importing the controllers
const { getUser, getAllUsers, updateUser, deleteUser, followUser, unfollowUser } = require('../controllers/userController');

//routing them

// User

router.get('/getUser/:id', getUser);
router.get('/getAllUsers', getAllUsers);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.put('/followUser/:id', followUser);
router.put('/unfollowUser/:id', unfollowUser);

module.exports = router; 