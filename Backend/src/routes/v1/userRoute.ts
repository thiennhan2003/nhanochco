import express from "express";
import usersController from "../../controllers/user.controller";
const router = express.Router();


  router.get("/users", usersController.getAllUsers);

  router.get("/users/:id", usersController.getUserById);
  
  // Create new user
  router.post("/users", usersController.createUser);
  
  // Update user
  router.put("/users/:id", usersController.updateUser);
  
  // Delete user
  router.delete("/users/:id", usersController.deleteUser);
  
export default router;
