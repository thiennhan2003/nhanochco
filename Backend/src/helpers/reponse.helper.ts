import { Response } from "express";

export const httpStatus = {
    OK: { statusCode: 200, message: 'Success' },
    CREATED: { statusCode: 201, message: 'Resource created successfully' },
    BAD_REQUEST: { statusCode: 400, message: 'Bad request' },
    UNAUTHORIZED: { statusCode: 401, message: 'Unauthorized' },
    FORBIDDEN: { statusCode: 403, message: 'Forbidden' },
    NOT_FOUND: { statusCode: 404, message: 'Resource not found' },
    SERVER_ERROR: { statusCode: 500, message: 'Internal server error' },
};



export const sendJsonSuccess = (res,data: any, message = "Success", statusCode = 200) => {
    res.status(statusCode).json ({
        statusCode,
        message,
        data,
    });
}
