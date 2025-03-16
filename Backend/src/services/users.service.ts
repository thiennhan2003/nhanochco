import createError from 'http-errors';
import { Request, Response } from 'express';
import userModel from '../models/user.model';
import { IUserCreate } from '../types/model';
import { ObjectId } from 'mongoose';
import bcrypt from 'bcryptjs'; // Replace 'bcrypt' with 'bcryptjs'



const getAllUsers = async (query: any) => {
  const { page = 1, limit = 10 ,sort_type = 'desc', sort_by='createdAt'} = query;

  let sortObject = {};
  let where = {};
  const sortType = query.sort_type || 'desc';
  const sortBy = query.sort_by || 'createdAt';
  sortObject = { ...sortObject, [sort_by]: sort_type === 'desc' ? -1 : 1 };

  // Search by username
  if (query.username && query.username.length > 0) {
      where = { ...where, username: { $regex: query.username, $options: 'i' } };
  }

  const users = await userModel
    .find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({...sortObject});
    const count = await userModel.countDocuments(where);
    return {
      users,
      //Để phân trang
      pagination:{
          totalRecord: count,
          limit,
          page
      }
    };
};

const getUserById = async (id: string) => {
    // const user = users.find((user) => user.id === id);
    const user = await userModel.findById(id);
    if (!user) {
        throw createError(404, "User not found");
    }
    return user;
}
const createUser = async (payload: any) => {
    // Tạo người dùng mới
    const user = new userModel(payload);

    // Lưu người dùng, middleware sẽ tự động mã hóa mật khẩu
    await user.save();

    return user;
};
const updateUserById = async (id: string, payload: any) => {
  const user = await getUserById(id);

  // Check if username is being updated and ensure it's unique
  if (payload.username && payload.username !== user.username) {
    const userExist = await userModel.findOne({ username: payload.username });
    if (userExist) {
      throw createError(400, 'Username already exists');
    }
  }

  // Check if email is being updated and ensure it's unique
  if (payload.email && payload.email !== user.email) {
    const emailExist = await userModel.findOne({ email: payload.email });
    if (emailExist) {
      throw createError(400, 'Email already exists');
    }
  }

  // Only update fields that are provided in the payload
  Object.keys(payload).forEach((key) => {
    if (payload[key] !== undefined) {
      user[key] = payload[key];
    }
  });

  await user.save();
  return user;
};
const deleteUserById = async (id: string) => {

    const user = await getUserById(id);
    await userModel.deleteOne({ _id: user._id });
    return user;
}

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
}
