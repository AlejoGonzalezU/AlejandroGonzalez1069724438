import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ProductService - Service layer for product CRUD operations
 * Handles CSV file operations with soft delete functionality
 * Implements sequential ID generation
 */
class ProductService {
  /**
   * Constructor - Initializes the product service with CSV file path
   */
  constructor() {
    this.csvPath = path.join(__dirname, '../../data/productos.csv');
    this.headers = ['id', 'nombre', 'descripcion', 'precio', 'cantidad', 'activo'];
  }

  /**
   * Reads all products from CSV file
   * Parses CSV content into array of product objects
   * 
   * @returns {Promise<Array>} Array of product objects
   * @throws {Error} If file read fails
   */
  async readProducts() {
    try {
      const content = await fs.readFile(this.csvPath, 'utf-8');
      const lines = content.trim().split('\n');
      
      // Skip header line
      if (lines.length <= 1) {
        return [];
      }

      const products = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = this.parseCSVLine(line);
        products.push({
          id: parseInt(values[0]),
          nombre: values[1],
          descripcion: values[2],
          precio: parseFloat(values[3]),
          cantidad: parseInt(values[4]),
          activo: parseInt(values[5]) === 1
        });
      }

      return products;
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error('Products could not be read');
    }
  }

  /**
   * Parses a CSV line handling quoted fields with commas
   * 
   * @param {string} line - CSV line to parse
   * @returns {Array<string>} Array of field values
   */
  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    return values;
  }

  /**
   * Escapes CSV field value by wrapping in quotes if contains comma
   * Also removes line breaks to prevent CSV corruption
   * 
   * @param {string} value - Value to escape
   * @returns {string} Escaped value
   */
  escapeCSVField(value) {
    if (value === null || value === undefined) {
      return '';
    }
    let stringValue = String(value);
    // Replace line breaks with spaces to prevent CSV corruption
    stringValue = stringValue.replace(/[\r\n]+/g, ' ');
    if (stringValue.includes(',') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  /**
   * Writes products array to CSV file
   * 
   * @param {Array} products - Array of product objects to write
   * @throws {Error} If file write fails
   */
  async writeProducts(products) {
    try {
      let content = this.headers.join(',') + '\n';
      
      for (const product of products) {
        const line = [
          product.id,
          this.escapeCSVField(product.nombre),
          this.escapeCSVField(product.descripcion),
          product.precio,
          product.cantidad,
          product.activo ? 1 : 0
        ].join(',');
        content += line + '\n';
      }

      await fs.writeFile(this.csvPath, content, 'utf-8');
      console.log('✅ Productos guardados exitosamente');
    } catch (error) {
      console.error('❌ Error escribiendo productos:', error.message);
      throw new Error('No se pudieron guardar los productos');
    }
  }

  /**
   * Gets all active products (activo = 1)
   * 
   * @returns {Promise<Array>} Array of active products
   */
  async getActiveProducts() {
    const products = await this.readProducts();
    return products.filter(p => p.activo);
  }

  /**
   * Gets a product by ID
   * 
   * @param {number} id - Product ID
   * @returns {Promise<Object|null>} Product object or null if not found
   */
  async getProductById(id) {
    const products = await this.readProducts();
    return products.find(p => p.id === parseInt(id)) || null;
  }

  /**
   * Generates next sequential ID
   * 
   * @returns {Promise<number>} Next available ID
   */
  async getNextId() {
    const products = await this.readProducts();
    if (products.length === 0) {
      return 1;
    }
    const maxId = Math.max(...products.map(p => p.id));
    return maxId + 1;
  }

  /**
   * Creates a new product
   * Validates data and assigns sequential ID
   * 
   * @param {Object} productData - Product data
   * @param {string} productData.nombre - Product name (min 3 chars)
   * @param {string} [productData.descripcion] - Product description (optional)
   * @param {number} productData.precio - Product price (must be positive)
   * @param {number} productData.cantidad - Product quantity (must be positive integer)
   * @returns {Promise<Object>} Created product object
   * @throws {Error} If validation fails or creation fails
   */
  async createProduct(productData) {
    // Validate
    const validation = this.validateProductData(productData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    try {
      const products = await this.readProducts();
      const newId = await this.getNextId();

      const newProduct = {
        id: newId,
        nombre: productData.nombre.trim(),
        descripcion: (productData.descripcion || '').trim(),
        precio: parseFloat(productData.precio),
        cantidad: parseInt(productData.cantidad),
        activo: true
      };

      products.push(newProduct);
      await this.writeProducts(products);

      console.log('✅ Producto creado:', newProduct);
      return newProduct;
    } catch (error) {
      console.error('❌ Error creando producto:', error.message);
      throw error;
    }
  }

  /**
   * Updates an existing product
   * 
   * @param {number} id - Product ID to update
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product object
   * @throws {Error} If validation fails, product not found, or update fails
   */
  async updateProduct(id, productData) {
    // Validate
    const validation = this.validateProductData(productData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    try {
      const products = await this.readProducts();
      const index = products.findIndex(p => p.id === parseInt(id));

      if (index === -1) {
        throw new Error('Producto no encontrado');
      }

      products[index] = {
        ...products[index],
        nombre: productData.nombre.trim(),
        descripcion: (productData.descripcion || '').trim(),
        precio: parseFloat(productData.precio),
        cantidad: parseInt(productData.cantidad)
      };

      await this.writeProducts(products);
      console.log('✅ Producto actualizado:', products[index]);
      return products[index];
    } catch (error) {
      console.error('❌ Error actualizando producto:', error.message);
      throw error;
    }
  }

  /**
   * Soft deletes a product by setting activo to false
   * 
   * @param {number} id - Product ID to delete
   * @returns {Promise<boolean>} True if deleted successfully
   * @throws {Error} If product not found or delete fails
   */
  async deleteProduct(id) {
    try {
      const products = await this.readProducts();
      const index = products.findIndex(p => p.id === parseInt(id));

      if (index === -1) {
        throw new Error('Producto no encontrado');
      }

      products[index].activo = false;
      await this.writeProducts(products);
      console.log('✅ Producto eliminado (soft delete):', id);
      return true;
    } catch (error) {
      console.error('❌ Error eliminando producto:', error.message);
      throw error;
    }
  }

  /**
   * Validates product data against business rules
   * 
   * @param {Object} productData - Product data to validate
   * @returns {Object} Validation result
   * @returns {boolean} return.isValid - True if all validations pass
   * @returns {string[]} return.errors - Array of error messages
   */
  validateProductData(productData) {
    const errors = [];

    // Validate nombre
    if (!productData.nombre || productData.nombre.trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    // Validate precio
    if (!productData.precio || parseFloat(productData.precio) <= 0) {
      errors.push('El precio debe ser mayor a 0');
    }

    // Validate cantidad
    if (!productData.cantidad || parseInt(productData.cantidad) < 0 || !Number.isInteger(parseFloat(productData.cantidad))) {
      errors.push('La cantidad debe ser un número entero positivo');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export default new ProductService();
