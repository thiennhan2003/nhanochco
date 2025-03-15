import createError from 'http-errors';
import { Request, Response } from 'express';
import categoryMenuItemModel from '../models/categoryMenuItem.model';
// import { IcategoryMenuItemCreate } from '../types/model';
import { ObjectId } from 'mongoose';

const getAllcategoryMenuItems = async (query:any) => {
  const { page = 1, limit = 10 ,sort_type = 'desc', sort_by='createdAt'} = query;
            
                let sortObject = {};
                let where = {};
                const sortType = query.sort_type || 'desc';
                const sortBy = query.sort_by || 'createdAt';
                sortObject = { ...sortObject, [sort_by]: sort_type === 'desc' ? -1 : 1 };
                const count = await categoryMenuItemModel.countDocuments(where);
  const categoryMenuItems = await categoryMenuItemModel.find(where)
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({...sortObject})
  // .populate('user_id', 'username fullname')
  return {
    categoryMenuItems,
    //Để phân trang
    pagination:{
        totalRecord: count,
        limit,
        page
    }
  };
};

const getcategoryMenuItemById = async (id: string) => {
    // const categoryMenuItem = categoryMenuItems.find((categoryMenuItem) => categoryMenuItem.id === id);
    const categoryMenuItem = await categoryMenuItemModel.findById(id);
    if (!categoryMenuItem) {
        throw createError(404, "categoryMenuItem not found");
    }
    return categoryMenuItem;
}
const createcategoryMenuItem = async (payload: any) => {
  const categoryMenuItem = await new categoryMenuItemModel(payload)
  await categoryMenuItem.save();
  return categoryMenuItem; 
}
const updatecategoryMenuItemById = async(id: string, payload: any) => {
  const categoryMenuItem = await getcategoryMenuItemById(id);

  if (payload.category_name !== categoryMenuItem.category_name) {
      const categoryMenuItemExist = await categoryMenuItemModel.findOne({ category_name: payload.category_name });
      if (categoryMenuItemExist) {
          throw createError(400, 'categoryMenuItem already exists');
      }
  }

  Object.assign(categoryMenuItem, payload); 
  await categoryMenuItem.save();
  return categoryMenuItem;
}
const deletecategoryMenuItemById = async (id: string) => {

    const categoryMenuItem = await getcategoryMenuItemById(id);
    await categoryMenuItemModel.deleteOne({ _id: categoryMenuItem._id });
    return categoryMenuItem;
}

export default {
    getAllcategoryMenuItems,
    getcategoryMenuItemById,
    createcategoryMenuItem,
    updatecategoryMenuItemById,
    deletecategoryMenuItemById,
}
