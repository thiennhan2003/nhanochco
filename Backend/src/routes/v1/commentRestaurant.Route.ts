import express from "express";
import commentsController from "../../controllers/commentRestaurant.controller";
const router = express.Router();


  router.get("/commentRestaurant", commentsController.getAllcomments);

  router.get("/commentRestaurant/:id", commentsController.getcommentById);
  
  // Create new comment
  router.post("/commentRestaurant", commentsController.createcomment);
  
  // Update comment
  router.put("/commentRestaurant/:id", commentsController.updatecomment);
  
  // Delete comment
  router.delete("/commentRestaurant/:id", commentsController.deletecomment);
  
export default router;
