import express from 'express';
import { entrepreneurController } from '../controllers/entrepreneurController';
import { auth } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validate';
import { projectValidation } from '../validations';

const router = express.Router();

router.use(auth);
// router.use(checkRole('ENTREPRENEUR'));

router.post('/ideas', validateRequest(projectValidation.create), entrepreneurController.createIdea);
router.put('/ideas/:id', validateRequest(projectValidation.update), entrepreneurController.updateIdea);
router.delete('/ideas/:id', entrepreneurController.deleteIdea);
router.get('/ideas', entrepreneurController.listIdeas);
router.put('/ideas/:id/status', validateRequest(projectValidation.updateStatus), entrepreneurController.updateStatus);
router.get('/notifications', entrepreneurController.getNotifications);
router.get('/chats', entrepreneurController.getChats);

export default router;