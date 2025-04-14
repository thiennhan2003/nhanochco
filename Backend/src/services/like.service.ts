import createError from 'http-errors';
import likeModel from '../models/like.model';

const toggleLike = async (postId: string, userId: string) => {
  try {
    // Kiểm tra xem user đã like post này chưa
    const existingLike = await likeModel.findOne({
      post_id: postId,
      user_id: userId
    });

    if (existingLike) {
      // Nếu đã like thì xóa like
      await likeModel.deleteOne({ _id: existingLike._id });
      return { message: "Unlike thành công" };
    } else {
      // Nếu chưa like thì thêm like
      const newLike = await likeModel.create({
        post_id: postId,
        user_id: userId
      });
      return { message: "Like thành công", like: newLike };
    }
  } catch (error) {
    throw createError(500, "Không thể thực hiện like/unlike");
  }
};

const getLikesByPost = async (postId: string) => {
  try {
    const likes = await likeModel.find({ post_id: postId })
      .populate('user_id', 'username fullname');
    return likes;
  } catch (error) {
    throw createError(500, "Không thể lấy danh sách likes");
  }
};

const getLikesByUser = async (userId: string) => {
  try {
    const likes = await likeModel.find({ user_id: userId })
      .populate('post_id', 'title content');
    return likes;
  } catch (error) {
    throw createError(500, "Không thể lấy danh sách likes của user");
  }
};

const getLikeCount = async (postId: string) => {
  try {
    const count = await likeModel.countDocuments({ post_id: postId });
    return count;
  } catch (error) {
    throw createError(500, "Không thể đếm số lượng likes");
  }
};

export default {
  toggleLike,
  getLikesByPost,
  getLikesByUser,
  getLikeCount
}; 