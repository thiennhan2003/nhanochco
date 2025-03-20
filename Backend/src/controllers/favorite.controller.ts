import { Request, Response ,NextFunction} from 'express';
import createError from 'http-errors';
import favoritesService from '../services/favorite.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';


const getAllfavorites = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const favorites = await favoritesService.getAllfavorites(req.query); 
        sendJsonSuccess(res, favorites, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const getfavoriteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const favorite = await favoritesService.getfavoriteById(id);
        sendJsonSuccess(res, favorite, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const createfavorite = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const payload = req.body;
        const favorite = await favoritesService.createfavorite(payload);
        sendJsonSuccess(res, favorite, httpStatus.CREATED.message, httpStatus.CREATED.statusCode);
    } catch (error) {
        next(error);
    }
}
const updatefavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const updatedfavorite = await favoritesService.updatefavoriteById(id, payload);
        sendJsonSuccess(res, updatedfavorite, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const deletefavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedfavorite = await favoritesService.deletefavoriteById(id);
        sendJsonSuccess(res, deletedfavorite, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
export default {
    getAllfavorites,
    getfavoriteById,
    createfavorite,
    updatefavorite,
    deletefavorite,
}
