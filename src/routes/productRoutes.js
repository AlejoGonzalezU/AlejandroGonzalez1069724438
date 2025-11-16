import { Router } from 'express';
import productController from '../controllers/productController.js';

const router = Router();

/**
 * Product routes
 * All routes require authentication (checked in controller)
 */

// Display products list page
router.get('/', productController.listProducts.bind(productController));

// API endpoint for DataTables to fetch products
router.get('/api/list', productController.getProductsAPI.bind(productController));

// Get single product data (AJAX)
router.get('/:id', productController.getProduct.bind(productController));

// Create new product (AJAX)
router.post('/', productController.createProduct.bind(productController));

// Update product (AJAX)
router.put('/:id', productController.updateProduct.bind(productController));

// Delete product (soft delete) (AJAX)
router.delete('/:id', productController.deleteProduct.bind(productController));

export default router;
