import express from "express";
import restaurantsController from "../../controllers/restaurant.controller";
const router = express.Router();


  router.get("/restaurants", restaurantsController.getAllRestaurants);

  router.get("/restaurants/:id", restaurantsController.getRestaurantById);
  
  // Create new restaurant
  router.post("/restaurants", restaurantsController.createRestaurant);
  
  // Update restaurant
  router.put("/restaurants/:id", restaurantsController.updateRestaurant);
  
  // Delete restaurant
  router.delete("/restaurants/:id", restaurantsController.deleteRestaurant);
  
export default router;
