import express from "express";
import commentsController from "../../controllers/commentMenu.controller";
const router = express.Router();


  router.get("/commentMenu", commentsController.getAllcomments);

  router.get("/commentMenu/:id", commentsController.getcommentById);
  
  // Create new comment
  router.post("/commentMenu", commentsController.createcomment);
  
  // Update comment
  router.put("/commentMenu/:id", commentsController.updatecomment);
  
  // Delete comment
  router.delete("/commentMenu/:id", commentsController.deletecomment);
  
export default router;
