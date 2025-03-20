import express from "express";
import favoritesController from "../../controllers/favorite.controller";
const router = express.Router();


  router.get("/favorites", favoritesController.getAllfavorites);

  router.get("/favorites/:id", favoritesController.getfavoriteById);
  
  // Create new favorite
  router.post("/favorites", favoritesController.createfavorite);
  
  // Update favorite
  router.put("/favorites/:id", favoritesController.updatefavorite);
  
  // Delete favorite
  router.delete("/favorites/:id", favoritesController.deletefavorite);
  
export default router;
