import express from 'express';
import likeController from '../controllers/like.controller';

const router = express.Router();

// Like/unlike a post
router.post('/likePost', likeController.likePost);

// Get like count for a post
router.get('/count/:post_id', likeController.getLikeCount);

export default router;