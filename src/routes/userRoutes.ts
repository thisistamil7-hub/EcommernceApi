import express from "express";
const router = express.Router();
import { userController } from "../controllers/userController"
import authMiddleware from "../middleware/authMiddleware"
router.use(authMiddleware);

// User routes
router.get('/', userController.getAllUsers);
router.get('/profile', userController.getUserProfile);
router.get('/:id', userController.getUserById);
router.put('/profile', userController.updateUserProfile);
router.delete('/:id', userController.deleteUser);

export default router