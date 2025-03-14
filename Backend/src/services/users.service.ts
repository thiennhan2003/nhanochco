import createError from 'http-errors';
import { Request, Response } from 'express';
import userModel from '../models/user.model';
import { IUserCreate } from '../types/model';
import { ObjectId } from 'mongoose';

const getAllUsers = async () => {
  const users = await userModel.find();
  return users;
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
  const user = await new userModel(payload)
  await user.save();
  return user; 
}
const updateUserById = async(id: string, payload: any) => {
  const user = await getUserById(id);

  if (payload.username !== user.username) {
      const userExist = await userModel.findOne({ username: payload.username });
      if (userExist) {
          throw createError(400, 'User already exists');
      }
  }

  Object.assign(user, payload); 
  await user.save();
  return user;
}
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
