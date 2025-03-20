import createError from 'http-errors';
import { Request, Response } from 'express';
import favoriteModel from '../models/favorite.model';

import { ObjectId } from 'mongoose';

const getAllfavorites = async (query:any) => {
  const { page = 1, limit = 10 ,sort_type = 'desc', sort_by='createdAt'} = query;

  let sortObject = {};
  let where = {};
  const sortType = query.sort_type || 'desc';
  const sortBy = query.sort_by || 'createdAt';
  sortObject = { ...sortObject, [sort_by]: sort_type === 'desc' ? -1 : 1 };
    const favorites = await favoriteModel
    .find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({...sortObject})
    .populate('user_id', 'username fullname')
    .populate("restaurant_id", "name");
    const count = await favoriteModel.countDocuments(where);
        return {
          favorites,
          //Để phân trang
          pagination:{
              totalRecord: count,
              limit,
              page
          }
        };
  };
  
  const getfavoriteById = async (id: string) => {
    const favorite = await favoriteModel.findById(id)
        .populate('user_id', 'username fullname')
        .populate("restaurant_id", "name");
    if (!favorite) {
        throw createError(404, "favorite not found");
    }
    return favorite;
}
const createfavorite = async (payload: any) => {
  const favorite = await new favoriteModel(payload)
  await favorite.save();
  return favorite; 
}
const updatefavoriteById = async(id: string, payload: any) => {
  const favorite = await getfavoriteById(id);

//   if (payload.favoritename !== favorite.favoritename) {
//       const favoriteExist = await favoriteModel.findOne({ favoritename: payload.favoritename });
//       if (favoriteExist) {
//           throw createError(400, 'favorite already exists');
//       }
//   }

  Object.assign(favorite, payload); 
  await favorite.save();
  return favorite;
}
const deletefavoriteById = async (id: string) => {

    const favorite = await getfavoriteById(id);
    await favoriteModel.deleteOne({ _id: favorite._id });
    return favorite;
}

export default {
    getAllfavorites,
    getfavoriteById,
    createfavorite,
    updatefavoriteById,
    deletefavoriteById,
}
