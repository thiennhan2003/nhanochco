import createError from 'http-errors';
import { Request, Response } from 'express';
import categoryRestaurantModel from '../models/categoryRestaurant.model';
// import { IcategoryRestaurantCreate } from '../types/model';
import { ObjectId } from 'mongoose';

const getAllcategoryRestaurants = async (query:any) => {
  const { page = 1, limit = 10 ,sort_type = 'desc', sort_by='createdAt'} = query;
          
              let sortObject = {};
              let where = {};
              const sortType = query.sort_type || 'desc';
              const sortBy = query.sort_by || 'createdAt';
              sortObject = { ...sortObject, [sort_by]: sort_type === 'desc' ? -1 : 1 };
              const count = await categoryRestaurantModel.countDocuments(where);
  const categoryRestaurants = await categoryRestaurantModel
  .find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({...sortObject})
    // .populate('user_id', 'username fullname')
    return {
      categoryRestaurants,
      //Để phân trang
      pagination:{
          totalRecord: count,
          limit,
          page
      }
    };
};

const getcategoryRestaurantById = async (id: string) => {
    // const categoryRestaurant = categoryRestaurants.find((categoryRestaurant) => categoryRestaurant.id === id);
    const categoryRestaurant = await categoryRestaurantModel.findById(id);
    if (!categoryRestaurant) {
        throw createError(404, "categoryRestaurant not found");
    }
    return categoryRestaurant;
}
const createcategoryRestaurant = async (payload: any) => {
  const categoryRestaurant = await new categoryRestaurantModel(payload)
  await categoryRestaurant.save();
  return categoryRestaurant; 
}
const updatecategoryRestaurantById = async(id: string, payload: any) => {
  const categoryRestaurant = await getcategoryRestaurantById(id);

  if (payload.category_name !== categoryRestaurant.category_name) {
      const categoryRestaurantExist = await categoryRestaurantModel.findOne({ category_name: payload.category_name });
      if (categoryRestaurantExist) {
          throw createError(400, 'categoryRestaurant already exists');
      }
  }

  Object.assign(categoryRestaurant, payload); 
  await categoryRestaurant.save();
  return categoryRestaurant;
}
const deletecategoryRestaurantById = async (id: string) => {

    const categoryRestaurant = await getcategoryRestaurantById(id);
    await categoryRestaurantModel.deleteOne({ _id: categoryRestaurant._id });
    return categoryRestaurant;
}

export default {
    getAllcategoryRestaurants,
    getcategoryRestaurantById,
    createcategoryRestaurant,
    updatecategoryRestaurantById,
    deletecategoryRestaurantById,
}
