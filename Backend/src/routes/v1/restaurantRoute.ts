import express from "express";
import restaurantsController from "../../controllers/restaurant.controller"; // Fixed import
const router = express.Router();

router.get("/restaurants", restaurantsController.getAllRestaurants);

router.get("/restaurants/:id", restaurantsController.getRestaurantById); // Fixed method name

// Create new restaurant
router.post("/restaurants", restaurantsController.createRestaurant); // Fixed method name

// Update restaurant
router.put("/restaurants/:id", restaurantsController.updateRestaurant); // Fixed method name

// Delete restaurant
router.delete("/restaurants/:id", restaurantsController.deleteRestaurant); // Fixed method name

export default router;
 