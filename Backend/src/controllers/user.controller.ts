import { Request, Response ,NextFunction} from 'express';
import createError from 'http-errors';
import usersService from '../services/users.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';
import userModel from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await usersService.getAllUsers(req.query); 
        sendJsonSuccess(res, users, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await usersService.getUserById(id);
        sendJsonSuccess(res, user, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const payload = req.body;
        const user = await usersService.createUser(payload);
        sendJsonSuccess(res, user, httpStatus.CREATED.message, httpStatus.CREATED.statusCode);
    } catch (error) {
        next(error);
    }
}
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const updatedUser = await usersService.updateUserById(id, payload);
        sendJsonSuccess(res, updatedUser, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedUser = await usersService.deleteUserById(id);
        sendJsonSuccess(res, deletedUser, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        console.log("Login attempt with email:", email); // Debug log
        const user = await userModel.findOne({ email });
        console.log("User found:", user); // Debug log

        if (!user) {
            throw createError(404, 'User not found');
        }

        console.log("Password provided:", password); // Debug log
        console.log("Password in database:", user.password); // Debug log

        const isMatch = bcrypt.compareSync(password, user.password);
        console.log("Password match result:", isMatch); // Debug log

        if (!isMatch) {
            throw createError(401, 'Invalid credentials');
        }

        // Tạo accessToken
        const accessToken = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Access token expires in 15 minutes
        );

        // Tạo refreshToken
        const refreshToken = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' } // Refresh token expires in 7 days
        );

        res.json({ accessToken, refreshToken }); // Trả về cả accessToken và refreshToken
    } catch (err) {
        next(err);
    }
};

const getProfile = async (req, res, next) => {
    try {
        console.log("Fetching profile for user ID:", req.user._id); // Debug log
        const user = await userModel.findById(req.user._id);
        console.log("User profile found:", user); // Debug log

        if (!user) {
            throw createError(404, 'User not found');
        }

        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err); // Debug log
        next(err);
    }
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login,
    getProfile,
}
