import express from 'express';
import profileController from '../controllers/profileController.js';

const router = express.Router();

router.get('/', profileController.home);

router.get('/profile', profileController.profile);
router.get('/edit', profileController.editForm);
router.post('/edit', profileController.updateProfile);

export default router;