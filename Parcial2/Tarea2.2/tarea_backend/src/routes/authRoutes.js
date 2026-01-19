import express from 'express';
import { AuthController } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Login de usuario
 */
router.post('/login', AuthController.login);

export default router;
