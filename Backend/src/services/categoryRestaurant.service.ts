import createError from 'http-errors';
import { Request, Response } from 'express';
import categoryRestaurantModel from '../models/categoryRestaurant.model';
// import { IcategoryRestaurantCreate } from '../types/model';
import { ObjectId } from 'mongoose';

const getAllcategoryRestaurants = async () => {
  const categoryRestaurants = await categoryRestaurantModel.find();
  return categoryRestaurants;
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
