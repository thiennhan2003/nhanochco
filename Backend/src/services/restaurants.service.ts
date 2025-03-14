import createError from 'http-errors';
import { Request, Response } from 'express';
import restaurantModel from '../models/restaurant.model';

import { ObjectId } from 'mongoose';

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

const getAllRestaurants = async () => {
  const restaurants = await restaurantModel
      .find()
      .populate('menu_id') // Thêm dòng này để nạp thông tin menu items
      .populate('owner_id')
      .populate('category_id')
      .populate('comments');
  return restaurants;
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
