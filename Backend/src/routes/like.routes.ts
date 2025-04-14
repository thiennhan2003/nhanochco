import express from 'express';
import { RequestHandler } from 'express';
import likeController from '../controllers/like.controller';

const router = express.Router();

// Like/unlike a post
router.post('/likePost', likeController.likePost);

// Get like count for a post
router.get('/count/:post_id', likeController.getLikeCount);

// Get all likes for a post
router.get('/post/:post_id', likeController.getLikesByPost);

// Get all likes in system
router.get('/all', likeController.getAllLikes);

export default router;