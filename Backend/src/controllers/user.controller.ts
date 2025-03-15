import { Request, Response ,NextFunction} from 'express';
import createError from 'http-errors';
import usersService from '../services/users.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';


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
export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}
