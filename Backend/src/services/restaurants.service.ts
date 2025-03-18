import createError from 'http-errors';
import { Request, Response } from 'express';
import restaurantModel from '../models/restaurant.model';

import { ObjectId } from 'mongoose';
import categoryRestaurantModel from '../models/categoryRestaurant.model';

const getRestaurantById = async (id: string) => {
  const restaurant = await restaurantModel
      .findById(id)
      .populate('menu_id') // Thêm dòng này để nạp thông tin menu items
      .populate('owner_id')
      .populate('category_id')
      .populate('comments');
  
  if (!restaurant) {
      throw createError(404, "Restaurant not found");
  }
  return restaurant;
}

const getAllRestaurants = async (query:any) => {
console.log("Fetching restaurants with query:", query);
  const { page = 1, limit = 10 ,sort_type = 'desc', sort_by='createdAt'} = query;

  let sortObject = {};
  let where = {};
  const sortType = query.sort_type || 'desc';
  const sortBy = query.sort_by || 'createdAt';
  sortObject = { ...sortObject, [sort_by]: sort_type === 'desc' ? -1 : 1 };

  // Search by username
  if (query.name && query.name.length > 0) {
      where = { ...where, name: { $regex: query.name, $options: 'i' } };
  }
  //tim kiem theo category
  if (query.category_name && query.category_name.length > 0) {
    const categories = await categoryRestaurantModel.find({
      category_name: { $regex: query.category_name, $options: 'i' },
    });

    const categoryIds = categories.map((category) => category._id);
    where = { ...where, category_id: { $in: categoryIds } };
  }
  const count = await restaurantModel.countDocuments(where);
  const restaurants = await restaurantModel
      .find(where)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({...sortObject})
      .populate('menu_id') // Thêm dòng này để nạp thông tin menu items
      .populate('owner_id')
      .populate('category_id')
      .populate('comments');
      return {
        restaurants,
        //Để phân trang
        pagination:{
            totalRecord: count,
            limit,
            page
        }
      };
}
const createrestaurant = async (payload: any) => {
  try {
      // Tạo nhà hàng mới trực tiếp
      const restaurant = new restaurantModel(payload);
      await restaurant.save();
      
      // Populate các thông tin cần thiết
      const populatedRestaurant = await restaurantModel.findById(restaurant._id)
          .populate('menu_id')
          .populate('owner_id')
          .populate('category_id')
          .populate('comments');
      
      return populatedRestaurant;
  } catch (error) {
      console.error('Error in createrestaurant:', error);
      throw error;
  }
}
const updaterestaurantById = async(id: string, payload: any) => {
  const restaurant = await getRestaurantById(id);

//   if (payload.restaurantname !== restaurant.restaurantname) {
//       const restaurantExist = await restaurantModel.findOne({ restaurantname: payload.restaurantname });
//       if (restaurantExist) {
//           throw createError(400, 'restaurant already exists');
//       }
//   }
  Object.assign(restaurant, payload); 
  await restaurant.save();
  return restaurant;
}
const deleterestaurantById = async (id: string) => {

    const restaurant = await getRestaurantById(id);
    await restaurantModel.deleteOne({ _id: restaurant._id });
    return restaurant;
}

export default {
    getAllRestaurants,
    getRestaurantById,
    createrestaurant,
    updaterestaurantById,
    deleterestaurantById,
}
