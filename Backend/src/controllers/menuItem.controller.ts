import { Request, Response ,NextFunction} from 'express';
import createError from 'http-errors';
import menuItemService from '../services/menuItem.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';


const getAllmenu_Item = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const menu_Item = await menuItemService.getAllmenu_Item(); 
        sendJsonSuccess(res, menu_Item, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const getmenu_ItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const menuItem = await menuItemService.getmenuItemById(id);
        sendJsonSuccess(res, menuItem, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const createmenu_Item = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const payload = req.body;
        const menuItem = await menuItemService.createmenuItem(payload);
        sendJsonSuccess(res, menuItem, httpStatus.CREATED.message, httpStatus.CREATED.statusCode);
    } catch (error) {
        next(error);
    }
}
const updatemenu_Item = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const updatedmenuItem = await menuItemService.updatemenuItemById(id, payload);
        sendJsonSuccess(res, updatedmenuItem, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const deletemenu_Item = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedmenuItem = await menuItemService.deletemenuItemById(id);
        sendJsonSuccess(res, deletedmenuItem, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
export default {
    getAllmenu_Item,
    getmenu_ItemById,
    createmenu_Item,
    updatemenu_Item,
    deletemenu_Item,
}
