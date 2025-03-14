import { Request, Response ,NextFunction} from 'express';
import createError from 'http-errors';
import categoryMenuItemservice from '../services/categoryMenuItem.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';


const getAllcategoryMenuItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryMenuItems = await categoryMenuItemservice.getAllcategoryMenuItems(); 
        sendJsonSuccess(res, categoryMenuItems, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const getcategoryMenuItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const categoryMenuItem = await categoryMenuItemservice.getcategoryMenuItemById(id);
        sendJsonSuccess(res, categoryMenuItem, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const createcategoryMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const payload = req.body;
        const categoryMenuItem = await categoryMenuItemservice.createcategoryMenuItem(payload);
        sendJsonSuccess(res, categoryMenuItem, httpStatus.CREATED.message, httpStatus.CREATED.statusCode);
    } catch (error) {
        next(error);
    }
}
const updatecategoryMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const updatedcategoryMenuItem = await categoryMenuItemservice.updatecategoryMenuItemById(id, payload);
        sendJsonSuccess(res, updatedcategoryMenuItem, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const deletecategoryMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedcategoryMenuItem = await categoryMenuItemservice.deletecategoryMenuItemById(id);
        sendJsonSuccess(res, deletedcategoryMenuItem, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
export default {
    getAllcategoryMenuItems,
    getcategoryMenuItemById,
    createcategoryMenuItem,
    updatecategoryMenuItem,
    deletecategoryMenuItem,
}
