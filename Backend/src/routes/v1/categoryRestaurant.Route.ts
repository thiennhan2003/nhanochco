import express from "express";
import categoryRestaurantController from "../../controllers/categoryRestaurant.controller";
const router = express.Router();


  router.get("/categoryRestaurant", categoryRestaurantController.getAllcategoryRestaurants);

  router.get("/categoryRestaurant/:id", categoryRestaurantController.getcategoryRestaurantById);
  
  // Create new user
  router.post("/categoryRestaurant", categoryRestaurantController.createcategoryRestaurant);
  
  // Update user
  router.put("/categoryRestaurant/:id", categoryRestaurantController.updatecategoryRestaurant);
  
  // Delete user
  router.delete("/categoryRestaurant/:id", categoryRestaurantController.deletecategoryRestaurant);
  
export default router;
