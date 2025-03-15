import { Request, Response ,NextFunction} from 'express';
import createError from 'http-errors';
import restaurantsService from '../services/restaurants.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';
import { Query } from 'mongoose';


const getAllRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurants = await restaurantsService.getAllRestaurants(req.query); 
        sendJsonSuccess(res, restaurants, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const restaurant = await restaurantsService.getRestaurantById(id);
        sendJsonSuccess(res, restaurant, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const payload = req.body;
        const restaurant = await restaurantsService.createrestaurant(payload);
        sendJsonSuccess(res, restaurant, httpStatus.CREATED.message, httpStatus.CREATED.statusCode);
    } catch (error) {
        next(error);
    }
}
const updateRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const updatedrestaurant = await restaurantsService.updaterestaurantById(id, payload);
        sendJsonSuccess(res, updatedrestaurant, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const deleteRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedrestaurant = await restaurantsService.deleterestaurantById(id);
        sendJsonSuccess(res, deletedrestaurant, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
export default {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
}
