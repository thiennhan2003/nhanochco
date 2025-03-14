import express from "express";
import menuItemController from "../../controllers/menuItem.controller";
const router = express.Router();


  router.get("/menu_Item", menuItemController.getAllmenu_Item);

  router.get("/menu_Item/:id", menuItemController.getmenu_ItemById);
  
  // Create new restaurant
  router.post("/menu_Item", menuItemController.createmenu_Item);
  
  // Update restaurant
  router.put("/menu_Item/:id", menuItemController.updatemenu_Item);
  
  // Delete restaurant
  router.delete("/menu_Item/:id", menuItemController.deletemenu_Item);
  
export default router;
