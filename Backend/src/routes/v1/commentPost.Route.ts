import express from "express";
import commentsController from "../../controllers/commentPost.controller";
const router = express.Router();


  router.get("/commentPost", commentsController.getAllcomments);

  router.get("/commentPost/:id", commentsController.getcommentById);
  
  // Create new comment
  router.post("/commentPost", commentsController.createcomment);
  
  // Update comment
  router.put("/commentPost/:id", commentsController.updatecomment);
  
  // Delete comment
  router.delete("/commentPost/:id", commentsController.deletecomment);
  
export default router;
