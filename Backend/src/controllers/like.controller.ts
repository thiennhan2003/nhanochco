import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import likeService from '../services/like.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';
import Like from '../models/like.model';
import Post from '../models/post.model';
import jwt from 'jsonwebtoken';

const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;
        const userId = req.user?._id; // Lấy user_id từ token đã được xác thực

        if (!userId) {
            throw createError(401, 'Vui lòng đăng nhập để thực hiện thao tác này');
        }

        const result = await likeService.toggleLike(postId, userId);
        sendJsonSuccess(res, result, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
};

const getLikesByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const likes = await likeService.getLikesByUser(userId);
        sendJsonSuccess(res, likes, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
};

const getLikeCount = async (req: Request, res: Response) => {
    try {
        const { post_id } = req.params;
        const likeCount = await Like.countDocuments({ post_id });
        return res.status(httpStatus.OK.statusCode).json({
            statusCode: httpStatus.OK.statusCode,
            message: 'Lấy số lượng like thành công',
            data: { count: likeCount }
        });
    } catch (error) {
        console.error('Error in getLikeCount:', error);
        return res.status(httpStatus.SERVER_ERROR.statusCode).json({
            statusCode: httpStatus.SERVER_ERROR.statusCode,
            message: 'Có lỗi xảy ra khi lấy số lượng like',
            data: null
        });
    }
};

const likePost = async (req: Request, res: Response) => {
    try {
        const { post_id, user_id } = req.body;

        if (!post_id || !user_id) {
            return res.status(httpStatus.BAD_REQUEST.statusCode).json({
                statusCode: httpStatus.BAD_REQUEST.statusCode,
                message: 'Thiếu post_id hoặc user_id',
                data: null
            });
        }

        // Kiểm tra xem user đã like post này chưa
        const existingLike = await Like.findOne({ post_id, user_id });

        if (existingLike) {
            // Nếu đã like rồi thì unlike
            await Like.findByIdAndDelete(existingLike._id);
            
            // Giảm số lượng like trong post
            await Post.findByIdAndUpdate(
                post_id, 
                { $inc: { likeCount: -1 } }
            );

            const updatedPost = await Post.findById(post_id);
            return res.status(httpStatus.OK.statusCode).json({
                statusCode: httpStatus.OK.statusCode,
                message: 'Unlike thành công',
                data: {
                    likeCount: updatedPost?.likeCount || 0,
                    isLiked: false
                }
            });
        }

        // Nếu chưa like thì tạo like mới
        const newLike = await Like.create({ post_id, user_id });

        // Tăng số lượng like trong post
        await Post.findByIdAndUpdate(
            post_id, 
            { $inc: { likeCount: 1 } }
        );

        const updatedPost = await Post.findById(post_id);
        return res.status(httpStatus.OK.statusCode).json({
            statusCode: httpStatus.OK.statusCode,
            message: 'Like thành công',
            data: {
                likeCount: updatedPost?.likeCount || 0,
                isLiked: true,
                like: newLike
            }
        });
    } catch (error) {
        console.error('Error in likePost:', error);
        return res.status(httpStatus.SERVER_ERROR.statusCode).json({
            statusCode: httpStatus.SERVER_ERROR.statusCode,
            message: 'Có lỗi xảy ra khi xử lý like',
            data: null
        });
    }
};

const getLikesByPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const likes = await Like.find({ post: postId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Lấy danh sách like thành công',
            data: likes
        });
    } catch (error) {
        console.error('Error in getLikesByPost:', error);
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy danh sách like',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export default {
    toggleLike,
    getLikesByPost,
    getLikesByUser,
    getLikeCount,
    likePost
}; 