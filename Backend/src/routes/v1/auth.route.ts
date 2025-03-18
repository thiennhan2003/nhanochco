import express from 'express';
import authController from '../../controllers/auth.controller';
// import {loginSchema} from '../../validations/auth.validation';

import {authenticateToken} from "../../middleware/auth.middleware";



// Define routes for authentication endpoints
const router = express.Router();
router.get('/login', authController.login);
router.get('/get-profile', authenticateToken, authController.getProfile);

