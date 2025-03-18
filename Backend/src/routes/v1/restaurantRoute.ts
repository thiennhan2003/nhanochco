import express from "express";
import restaurantController from "../../controllers/restaurant.controller";

const router = express.Router();

router.get("/restaurants", restaurantController.getAllRestaurants);
router.get("/restaurants/:id", restaurantController.getRestaurantById);
router.post("/restaurants", restaurantController.createRestaurant);
router.put("/restaurants/:id", restaurantController.updateRestaurant);
router.delete("/restaurants/:id", restaurantController.deleteRestaurant);

export default router;
