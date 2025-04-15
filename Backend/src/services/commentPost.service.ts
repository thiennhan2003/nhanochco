import createError from 'http-errors';
import { Request, Response } from 'express';

import { ObjectId } from 'mongoose';
import restaurantModel from '../models/restaurant.model';
import commentPostModel from '../models/commentPost.model';
import postModel from '../models/post.model';

const getAllcomments = async (query:any) => {
    const { page = 1, limit = 10 ,sort_type = 'desc', sort_by='createdAt'} = query;
    
        let sortObject = {};
        let where = {};
        const sortType = query.sort_type || 'desc';
        const sortBy = query.sort_by || 'createdAt';
        sortObject = { ...sortObject, [sort_by]: sort_type === 'desc' ? -1 : 1 };
        const count = await commentPostModel.countDocuments(where);
    const comments = await commentPostModel
    .find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({...sortObject})
    .populate('post_id')
    .populate('user_id', 'username fullname avatar')
//     .populate({
//       path: 'comments',
//       select: 'content createdAt target_type'
//   });
return {
    comments,
    //Để phân trang
    pagination:{
        totalRecord: count,
        limit,
        page
    }
  };
  };
  
  const getcommentById = async (id: string) => {
      const comment = await commentPostModel.findById(id)
    //   .populate({
    //     path: 'comments',
    //     select: 'content createdAt target_type'
    // });
      if (!comment) {
          throw createError(404, "comment not found");
      }
      return comment;
  }
  const createCommentPost = async (payload: any) => {
    try {
        // Kiểm tra post có tồn tại không
        const post = await postModel.findById(payload.post_id);
        if (!post) {
            throw createError(404, "Post not found");
        }

        // Tạo comment mới
        const comment = await new commentPostModel(payload);
        await comment.save();
        
        console.log('Created comment:', comment); // Log để debug

        // Cập nhật mảng comments trong Post
        const updatedPost = await postModel.findByIdAndUpdate(
            payload.post_id,
            { $push: { comments: comment._id } },
            { new: true }
        );
        
        console.log('Updated post:', updatedPost); // Log để debug

        // Trả về comment đã populate
        const populatedComment = await commentPostModel.findById(comment._id)
            .populate('post_id')
            // .populate('user_id', 'username fullname');
        
        return populatedComment;
    } catch (error) {
        console.error('Error in createCommentPost:', error);
        throw error;
    }
}
const updatecommentById = async(id: string, payload: any) => {
  const comment = await getcommentById(id);

//   if (payload.menuItemname !== menuItem.menuItemname) {
//       const menuItemExist = await menuItemModel.findOne({ menuItemname: payload.menuItemname });
//       if (menuItemExist) {
//           throw createError(400, 'menuItem already exists');
//       }
//   }

  Object.assign(comment, payload); 
  await comment.save();
  return comment;
}
const deletecommentById = async (id: string) => {

    const comment = await getcommentById(id);
    await commentPostModel.deleteOne({ _id: comment._id });
    return comment;
}

export default {
    getAllcomments,
    getcommentById,
    createCommentPost,
    updatecommentById,
    deletecommentById,
}
