import express from "express";
import postsController from "../../controllers/post.controller";
const router = express.Router();


  router.get("/posts", postsController.getAllposts);

  router.get("/posts/:id", postsController.getpostById);
  
  // Create new post
  router.post("/posts", postsController.createpost);
  
  // Update post
  router.put("/posts/:id", postsController.updatepost);
  
  // Delete post
  router.delete("/posts/:id", postsController.deletepost);
  
export default router;
