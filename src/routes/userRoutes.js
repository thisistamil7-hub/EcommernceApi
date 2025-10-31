const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// User routes
router.get('/', userController.getAllUsers);
router.get('/profile', userController.getUserProfile);
router.get('/:id', userController.getUserById);
router.put('/profile', userController.updateUserProfile);
router.delete('/:id', userController.deleteUser);

module.exports = router;