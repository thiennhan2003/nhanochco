import createError from 'http-errors';
import { Request, Response } from 'express';
import postModel from '../models/post.model';

import { ObjectId } from 'mongoose';

const getAllposts = async (query:any) => {
  const { page = 1, limit = 10 ,sort_type = 'desc', sort_by='createdAt'} = query;

  let sortObject = {};
  let where = {};
  const sortType = query.sort_type || 'desc';
  const sortBy = query.sort_by || 'createdAt';
  sortObject = { ...sortObject, [sort_by]: sort_type === 'desc' ? -1 : 1 };
    const posts = await postModel
    .find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({...sortObject})
    .populate('user_id', 'username fullname')
    .populate({
        path: 'comments',
        select: 'content createdAt target_type'
    });
    const count = await postModel.countDocuments(where);
        return {
          posts,
          //Để phân trang
          pagination:{
              totalRecord: count,
              limit,
              page
          }
        };
  };
  
  const getpostById = async (id: string) => {
    const post = await postModel.findById(id)
        .populate('user_id', 'username fullname')
        .populate({
            path: 'comments',
            select: 'content createdAt target_type'
        });
    if (!post) {
        throw createError(404, "post not found");
    }
    return post;
}
const createpost = async (payload: any) => {
  const post = await new postModel(payload)
  await post.save();
  return post; 
}
const updatepostById = async(id: string, payload: any) => {
  const post = await getpostById(id);

//   if (payload.postname !== post.postname) {
//       const postExist = await postModel.findOne({ postname: payload.postname });
//       if (postExist) {
//           throw createError(400, 'post already exists');
//       }
//   }

  Object.assign(post, payload); 
  await post.save();
  return post;
}
const deletepostById = async (id: string) => {

    const post = await getpostById(id);
    await postModel.deleteOne({ _id: post._id });
    return post;
}

export default {
    getAllposts,
    getpostById,
    createpost,
    updatepostById,
    deletepostById,
}
