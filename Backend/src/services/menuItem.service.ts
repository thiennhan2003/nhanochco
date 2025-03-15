import createError from 'http-errors';
import { Request, Response } from 'express';
import menuItemModel from '../models/menuItem.model';

import { ObjectId } from 'mongoose';
import restaurantModel from '../models/restaurant.model';
import categoryMenuItemModel from '../models/categoryMenuItem.model';
const getAllmenu_Item = async (query:any) => {
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

  if (query.category_name && query.category_name.length > 0) {
      const categories = await categoryMenuItemModel.find({
        category_name: { $regex: query.category_name, $options: 'i' },
      });
  
      const categoryIds = categories.map((category) => category._id);
      where = { ...where, category_id: { $in: categoryIds } };
    }
    const count = await menuItemModel.countDocuments(where);
    const menu_Item = await menuItemModel
    .find(where)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({...sortObject})
    .populate({
      path: 'comments',
      select: 'content createdAt target_type'
  }).populate('category_id');
  return {
    menu_Item,
    //Để phân trang
    pagination:{
        totalRecord: count,
        limit,
        page
    }
  };
  };
  
  const getmenuItemById = async (id: string) => {
      const menuItem = await menuItemModel.findById(id)
      .populate({
        path: 'comments',
        select: 'content createdAt target_type'
    }).populate('category_id');
      if (!menuItem) {
          throw createError(404, "menuItem not found");
      }
      return menuItem;
  }
  const createmenuItem = async (payload: any) => {
    const menuItem = await new menuItemModel(payload);
    await menuItem.save();
    
    // Cập nhật menu_id trong restaurant
    await restaurantModel.findByIdAndUpdate(
      payload.restaurant_id,
      { $push: { menu_id: menuItem._id } },
      { new: true }
    );
    
    return menuItem; 
  }
const updatemenuItemById = async(id: string, payload: any) => {
  const menuItem = await getmenuItemById(id);

//   if (payload.menuItemname !== menuItem.menuItemname) {
//       const menuItemExist = await menuItemModel.findOne({ menuItemname: payload.menuItemname });
//       if (menuItemExist) {
//           throw createError(400, 'menuItem already exists');
//       }
//   }

  Object.assign(menuItem, payload); 
  await menuItem.save();
  return menuItem;
}
const deletemenuItemById = async (id: string) => {

    const menuItem = await getmenuItemById(id);
    await menuItemModel.deleteOne({ _id: menuItem._id });
    return menuItem;
}

export default {
    getAllmenu_Item,
    getmenuItemById,
    createmenuItem,
    updatemenuItemById,
    deletemenuItemById,
}
