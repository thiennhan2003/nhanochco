import { Request, Response ,NextFunction} from 'express';
import createError from 'http-errors';
import postsService from '../services/post.service';
import { sendJsonSuccess, httpStatus } from '../helpers/reponse.helper';


const getAllposts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await postsService.getAllposts(req.query); 
        sendJsonSuccess(res, posts, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const getpostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const post = await postsService.getpostById(id);
        sendJsonSuccess(res, post, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const createpost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Request body:', req.body);
        const payload = req.body;
        
        // Validate required fields
        if (!payload.title || !payload.content || !payload.user_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Title, content and user_id are required'
            });
        }

        const post = await postsService.createpost(payload);
        console.log('Created post:', post);
        sendJsonSuccess(res, post, httpStatus.CREATED.message, httpStatus.CREATED.statusCode);
    } catch (error) {
        console.error('Error in createpost:', error);
        if (error instanceof Error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message
            });
        }
        next(error);
    }
}
const updatepost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const updatedpost = await postsService.updatepostById(id, payload);
        sendJsonSuccess(res, updatedpost, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
const deletepost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedpost = await postsService.deletepostById(id);
        sendJsonSuccess(res, deletedpost, httpStatus.OK.message, httpStatus.OK.statusCode);
    } catch (error) {
        next(error);
    }
}
export default {
    getAllposts,
    getpostById,
    createpost,
    updatepost,
    deletepost,
}
