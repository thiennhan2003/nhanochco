import { Types } from 'mongoose';

// Định nghĩa cấu trúc của đối tượng user
export interface IUser {
  _id: Types.ObjectId;
  username: string;
  avatar: string;
  email?: string;
  role?: string;
  active?: boolean;
}

// Định nghĩa cấu trúc của đối tượng post
export interface IPost {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author_id: Types.ObjectId;
  likeCount: number;
}

// Định nghĩa cấu trúc của like
export interface ILike {
  _id: Types.ObjectId;
  post_id: Types.ObjectId;
  user_id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa cấu trúc của like đã được populate
export interface ILikePopulated {
  _id: Types.ObjectId;
  post_id: IPost;
  user_id: IUser;
  createdAt: Date;
  updatedAt: Date;
}

// Mở rộng giao diện Request của Express
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
    [key: string]: any;
  }
}

// Định nghĩa các interface cho các route parameters
declare module 'express-serve-static-core' {
  interface RequestParams {
    postId?: string;
    userId?: string;
    post_id?: string;
    user_id?: string;
  }
}