import productService from '../services/productService.js';

/**
 * ProductController - Controller layer for product CRUD operations
 * Handles HTTP requests for product management
 */
class ProductController {
  /**
   * Displays the products list page
   * Only accessible to authenticated users
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.oidc - Auth0 OIDC data
   * @param {Object} res - Express response object
   */
  async listProducts(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.redirect('/');
      }

      res.render('products', {
        title: 'Productos',
        user: req.oidc.user,
        currentPage: 'products',
        isAuthenticated: true
      });
    } catch (error) {
      console.error('Error cargando productos:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar los productos',
        error: { status: 500 }
      });
    }
  }

  /**
   * Gets all active products as JSON (AJAX endpoint for DataTables)
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProductsAPI(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const products = await productService.getActiveProducts();
      res.json({ products });
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  /**
   * Gets product data by ID (AJAX endpoint)
   * Returns JSON with product data for editing
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.params - Route parameters
   * @param {string} req.params.id - Product ID
   * @param {Object} res - Express response object
   */
  async getProduct(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      if (!product.activo) {
        return res.status(404).json({ error: 'Producto no disponible' });
      }

      res.json(product);
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
  }

  /**
   * Creates a new product (AJAX endpoint)
   * Validates and saves product data
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.body - Product data
   * @param {string} req.body.nombre - Product name
   * @param {string} req.body.descripcion - Product description
   * @param {number} req.body.precio - Product price
   * @param {number} req.body.cantidad - Product quantity
   * @param {Object} res - Express response object
   */
  async createProduct(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const { nombre, descripcion, precio, cantidad } = req.body;
      
      const newProduct = await productService.createProduct({
        nombre,
        descripcion,
        precio,
        cantidad
      });

      res.json({
        success: true,
        message: 'Producto creado exitosamente',
        product: newProduct
      });
    } catch (error) {
      console.error('Error creando producto:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Updates an existing product (AJAX endpoint)
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.params - Route parameters
   * @param {string} req.params.id - Product ID
   * @param {Object} req.body - Updated product data
   * @param {Object} res - Express response object
   */
  async updateProduct(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const { id } = req.params;
      const { nombre, descripcion, precio, cantidad } = req.body;

      const updatedProduct = await productService.updateProduct(id, {
        nombre,
        descripcion,
        precio,
        cantidad
      });

      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        product: updatedProduct
      });
    } catch (error) {
      console.error('Error actualizando producto:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Soft deletes a product (AJAX endpoint)
   * Sets activo field to false
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.params - Route parameters
   * @param {string} req.params.id - Product ID
   * @param {Object} res - Express response object
   */
  async deleteProduct(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const { id } = req.params;
      await productService.deleteProduct(id);

      res.json({
        success: true,
        message: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando producto:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new ProductController();
