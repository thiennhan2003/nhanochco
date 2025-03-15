import express from "express";
import usersController from "../../controllers/user.controller";
import authMiddleware from '../../middlewares/auth.middleware';
const router = express.Router();

router.get("/users", usersController.getAllUsers);

router.get("/users/:id", usersController.getUserById);

// Create new user
router.post("/users", usersController.createUser);

// Update user
router.put("/users/:id", usersController.updateUser);

// Delete user
router.delete("/users/:id", usersController.deleteUser);

// Route for login
router.post('/auth/login', usersController.login);

// Route for getting profile
router.get('/auth/get-profile', authMiddleware, usersController.getProfile);

export default router;
