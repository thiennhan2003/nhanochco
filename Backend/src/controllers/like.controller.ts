import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import mongoose from 'mongoose';
import likeService from '../services/like.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';
import Like from '../models/like.model';
import Post from '../models/post.model';
import { Types } from 'mongoose';

interface IUser {
    _id: Types.ObjectId;
    username: string;
    avatar: string;
}

interface IPost {
    _id: Types.ObjectId;
    title: string;
    content: string;
}

interface ILikePopulated {
    _id: Types.ObjectId;
    post_id: IPost;
    user_id: IUser;
    createdAt: Date;
    updatedAt: Date;
}

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
        console.log('Request body:', req.body);

        if (!post_id || !user_id) {
            console.log('Missing post_id or user_id:', { post_id, user_id });
            return res.status(httpStatus.BAD_REQUEST.statusCode).json({
                statusCode: httpStatus.BAD_REQUEST.statusCode,
                message: 'Thiếu post_id hoặc user_id',
                data: null
            });
        }

        // Kiểm tra ObjectId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(post_id) || !mongoose.Types.ObjectId.isValid(user_id)) {
            console.log('Invalid ObjectId:', { post_id, user_id });
            return res.status(httpStatus.BAD_REQUEST.statusCode).json({
                statusCode: httpStatus.BAD_REQUEST.statusCode,
                message: 'post_id hoặc user_id không hợp lệ',
                data: null
            });
        }

        // Kiểm tra post có tồn tại không
        const post = await Post.findById(post_id);
        console.log('Found post:', post);

        if (!post) {
            return res.status(httpStatus.NOT_FOUND.statusCode).json({
                statusCode: httpStatus.NOT_FOUND.statusCode,
                message: 'Không tìm thấy bài viết',
                data: null
            });
        }

        // Kiểm tra xem user đã like post này chưa
        const existingLike = await Like.findOne({ post_id, user_id });
        console.log('Existing like:', existingLike);

        let action;
        if (existingLike) {
            // Nếu đã like thì xóa like
            await Like.deleteOne({ _id: existingLike._id });
            action = "unliked";
        } else {
            // Nếu chưa like thì tạo like mới
            await Like.create({ post_id, user_id });
            action = "liked";
        }

        // Cập nhật số lượng like trong post
        const likeCount = await Like.countDocuments({ post_id });
        await Post.findByIdAndUpdate(post_id, { likeCount });

        return res.status(httpStatus.OK.statusCode).json({
            statusCode: httpStatus.OK.statusCode,
            message: action === "liked" ? 'Đã thích bài viết' : 'Đã bỏ thích bài viết',
            data: {
                action,
                likeCount,
                post_id,
                user_id
            }
        });
    } catch (error) {
        console.error('Error in likePost:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            body: req.body
        });
        return res.status(httpStatus.SERVER_ERROR.statusCode).json({
            statusCode: httpStatus.SERVER_ERROR.statusCode,
            message: `Có lỗi xảy ra khi xử lý like: ${error instanceof Error ? error.message : 'Unknown error'}`,
            data: null
        });
    }
};

const getLikesByPost = async (req: Request, res: Response) => {
    try {
        const { post_id } = req.params;

        // Kiểm tra post có tồn tại không
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(httpStatus.NOT_FOUND.statusCode).json({
                statusCode: httpStatus.NOT_FOUND.statusCode,
                message: 'Không tìm thấy bài viết',
                data: null
            });
        }

        // Lấy danh sách user đã like post này
        const likes = await Like.find({ post_id })
            .populate<{ user_id: IUser }>('user_id', 'username avatar')
            .select('user_id createdAt') as ILikePopulated[];

        return res.status(httpStatus.OK.statusCode).json({
            statusCode: httpStatus.OK.statusCode,
            message: 'Lấy danh sách người like thành công',
            data: {
                post_id,
                likeCount: post.likeCount,
                users: likes.map(like => ({
                    user_id: like.user_id._id,
                    username: like.user_id.username,
                    avatar: like.user_id.avatar,
                    likedAt: like.createdAt
                }))
            }
        });
    } catch (error) {
        console.error('Error in getLikesByPost:', error);
        return res.status(httpStatus.SERVER_ERROR.statusCode).json({
            statusCode: httpStatus.SERVER_ERROR.statusCode,
            message: 'Có lỗi xảy ra khi lấy danh sách like',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

const getAllLikes = async (req: Request, res: Response) => {
    try {
        const likes = await Like.find()
            .populate<{ user_id: IUser }>({
                path: 'user_id',
                select: 'username avatar',
                model: 'User'
            })
            .populate<{ post_id: IPost }>({
                path: 'post_id',
                select: 'title content',
                model: 'Post'
            })
            .sort({ createdAt: -1 }) as unknown as ILikePopulated[];

        return res.status(httpStatus.OK.statusCode).json({
            statusCode: httpStatus.OK.statusCode,
            message: 'Lấy danh sách like thành công',
            data: {
                total: likes.length,
                likes: likes.map(like => ({
                    _id: like._id.toString(),
                    post: {
                        id: like.post_id._id.toString(),
                        title: like.post_id.title,
                        content: like.post_id.content
                    },
                    user: {
                        id: like.user_id._id.toString(),
                        username: like.user_id.username,
                        avatar: like.user_id.avatar
                    },
                    createdAt: like.createdAt,
                    updatedAt: like.updatedAt
                }))
            }
        });
    } catch (error) {
        console.error('Error in getAllLikes:', error);
        return res.status(httpStatus.SERVER_ERROR.statusCode).json({
            statusCode: httpStatus.SERVER_ERROR.statusCode,
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
    likePost,
    getAllLikes
};