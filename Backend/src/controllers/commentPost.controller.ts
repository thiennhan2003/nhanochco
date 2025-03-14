import { Request, Response ,NextFunction} from 'express';
import createError from 'http-errors';
import commentsService from '../services/commentPost.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';


const getAllcomments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comments = await commentsService.getAllcomments(); 
        sendJsonSuccess(res, comments, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const getcommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const comment = await commentsService.getcommentById(id);
        sendJsonSuccess(res, comment, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const createcomment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const payload = req.body;
        const comment = await commentsService.createCommentPost(payload);
        sendJsonSuccess(res, comment, httpStatus.CREATED.message, httpStatus.CREATED.statusCode);
    } catch (error) {
        next(error);
    }
}
const updatecomment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const updatedcomment = await commentsService.updatecommentById(id, payload);
        sendJsonSuccess(res, updatedcomment, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const deletecomment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedcomment = await commentsService.deletecommentById(id);
        sendJsonSuccess(res, deletedcomment, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
export default {
    getAllcomments,
    getcommentById,
    createcomment,
    updatecomment,
    deletecomment,
}
