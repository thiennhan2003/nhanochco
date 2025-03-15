import { Request, Response ,NextFunction} from 'express';
import createError from 'http-errors';
import categoryRestaurantService from '../services/categoryRestaurant.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';


const getAllcategoryRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryRestaurants = await categoryRestaurantService.getAllcategoryRestaurants(req.query); 
        sendJsonSuccess(res, categoryRestaurants, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const getcategoryRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const categoryRestaurant = await categoryRestaurantService.getcategoryRestaurantById(id);
        sendJsonSuccess(res, categoryRestaurant, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const createcategoryRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const payload = req.body;
        const categoryRestaurant = await categoryRestaurantService.createcategoryRestaurant(payload);
        sendJsonSuccess(res, categoryRestaurant, httpStatus.CREATED.message, httpStatus.CREATED.statusCode);
    } catch (error) {
        next(error);
    }
}
const updatecategoryRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const updatedcategoryRestaurant = await categoryRestaurantService.updatecategoryRestaurantById(id, payload);
        sendJsonSuccess(res, updatedcategoryRestaurant, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const deletecategoryRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedcategoryRestaurant = await categoryRestaurantService.deletecategoryRestaurantById(id);
        sendJsonSuccess(res, deletedcategoryRestaurant, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
export default {
    getAllcategoryRestaurants,
    getcategoryRestaurantById,
    createcategoryRestaurant,
    updatecategoryRestaurant,
    deletecategoryRestaurant,
}
