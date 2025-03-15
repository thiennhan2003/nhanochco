import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model';
import { TUserEntity } from '../types/model';
import { env } from '../helpers/env.helper';
import { Response } from 'express';

const login = async({
    email,
    password
}:{
    email: string,
    password: string,
}) => {
    const users = await userModel.findOne({
        email
    })
    if(!users){
        throw createError(404, 'email or password invalid');
    }
    if(users.password !== password){
        throw createError(404, 'email or password invalid');
    }

    const accessToken = jwt.sign(
        { _id: users._id, email: users.email},
        env.JWT_SECRET as string,
        {
          expiresIn: '24h', // expires in 24 hours (24 x 60 x 60)
        }
      );

      const refreshToken  = jwt.sign(
        { _id: users._id, email: users.email},
        env.JWT_SECRET as string,
        {
          expiresIn: '365d', // expires in 24 hours (24 x 60 x 60)
        }
      );
      return {
        accessToken,
        refreshToken
      }
}

const getProfile = async(res: Response)=>{
    const {users} = res.locals;
    //return without password
    return users;
}
export default {
    login,
    getProfile
}