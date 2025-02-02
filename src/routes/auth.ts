import express from 'express';
import { authController } from '../controllers/authController';
import { validateRequest } from '../middlewares';
import { authValidation } from '../validations';

const router = express.Router();

router.post('/signup', validateRequest(authValidation.signup), authController.signup);
router.post('/login', validateRequest(authValidation.login), authController.login);
router.post('/refresh-token', authController.refreshToken);

export default router;
