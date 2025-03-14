import express from "express";
import categoryMenuItemController from "../../controllers/categoryMenuItem.controller";
const router = express.Router();


  router.get("/categoryMenuItem", categoryMenuItemController.getAllcategoryMenuItems);

  router.get("/categoryMenuItem/:id", categoryMenuItemController.getcategoryMenuItemById);
  
  // Create new user
  router.post("/categoryMenuItem", categoryMenuItemController.createcategoryMenuItem);
  
  // Update user
  router.put("/categoryMenuItem/:id", categoryMenuItemController.updatecategoryMenuItem);
  
  // Delete user
  router.delete("/categoryMenuItem/:id", categoryMenuItemController.deletecategoryMenuItem);
  
export default router;
