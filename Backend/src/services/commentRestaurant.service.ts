import createError from 'http-errors';
import { Request, Response } from 'express';

import { ObjectId } from 'mongoose';
// import restaurantModel from '../models/restaurant.model';
import commentRestaurantModel from '../models/commentRestaurant.model';
import restaurantModel from '../models/restaurant.model';
// import postModel from '../models/post.model';

const getAllcomments = async (query:any) => {
    const { page = 1, limit = 10 ,sort_type = 'desc', sort_by='createdAt'} = query;

    let sortObject = {};
    let where = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'createdAt';
    sortObject = { ...sortObject, [sort_by]: sort_type === 'desc' ? -1 : 1 };
    const count = await commentRestaurantModel.countDocuments(where);
    const comments = await commentRestaurantModel
    .find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({...sortObject})
    .populate('user_id', 'username fullname')
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
      const comment = await commentRestaurantModel.findById(id)
    //   .populate({
    //     path: 'comments',
    //     select: 'content createdAt target_type'
    // });
      if (!comment) {
          throw createError(404, "comment not found");
      }
      return comment;
  }
  const createCommentRestaurant = async (payload: any) => {
    try {
        // Kiểm tra post có tồn tại không
        const restaurant = await restaurantModel.findById(payload.restaurant_id);
        if (!restaurant) {
            throw createError(404, "Restaurant not found");
        }

        // Tạo comment mới
        const comment = await new commentRestaurantModel(payload);
        await comment.save();
        
        console.log('Created comment:', comment); // Log để debug

        // Cập nhật mảng comments trong Post
        const updatedPost = await restaurantModel.findByIdAndUpdate(
            payload.restaurant_id,
            { $push: { comments: comment._id } },
            { new: true }
        );
        
        console.log('Updated post:', updatedPost); // Log để debug

        // Trả về comment đã populate
        const populatedComment = await commentRestaurantModel.findById(comment._id)
            .populate('restaurant_id')
            // .populate('user_id', 'username fullname');
        
        return populatedComment;
    } catch (error) {
        console.error('Error in createCommentRestaurant:', error);
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
    await commentRestaurantModel.deleteOne({ _id: comment._id });
    return comment;
}

export default {
    getAllcomments,
    getcommentById,
    createCommentRestaurant,
    updatecommentById,
    deletecommentById,
}
