import jwt from 'jsonwebtoken';
import createError from 'http-errors';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(createError(401, 'Authorization token is missing or invalid'));
    }

    const token = authHeader.split(' ')[1];

    try {
        console.log("Authorization token:", token); // Debug log
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Debug log
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        console.error("Token verification failed:", err); // Debug log
        return next(createError(401, 'Invalid token'));
    }
};

export default authMiddleware;
