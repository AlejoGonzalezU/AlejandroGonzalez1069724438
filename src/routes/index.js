import express from 'express';
import profileController from '../controllers/profileController.js';
import productRoutes from './productRoutes.js';

const router = express.Router();

// Home route
router.get('/', profileController.home);

// Profile routes
router.get('/profile', profileController.profile);
router.get('/profile/edit', profileController.editForm);
router.post('/profile/edit', profileController.updateProfile);

// Product routes (all under /products)
router.use('/products', productRoutes);

export default router;
