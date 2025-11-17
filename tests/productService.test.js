import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import productService from '../src/services/productService.js';

const originalCsvPath = productService.getCSVPath();
let tempCsvPath;

// Used to describe what will happen before and after each test
describe('ProductService - CRUD Operations', () => {
  
  // A mocked csv file will be created before each test
  beforeEach(async () => {
    tempCsvPath = path.join(
      os.tmpdir(),
      `productos_test_${Date.now()}_${Math.random().toString(16).slice(2)}.csv`
    );

    const testData = `id,nombre,descripcion,precio,cantidad,activo
        1,Producto Test 1,Descripción test 1,1000,10,1
        2,Producto Test 2,Descripción test 2,2000,20,1
        3,Producto Inactivo,Descripción inactiva,3000,30,0`;

    await fs.writeFile(tempCsvPath, testData, 'utf-8');
    productService.setCSVPath(tempCsvPath);
  });

  afterEach(async () => {
    try {
      await fs.unlink(tempCsvPath);
    } catch (e) {
      // Not needed
    }
    productService.setCSVPath(originalCsvPath);
  });

  describe('CREATE - createProduct()', () => {
    
    it('Success case: A valid product must be created', async () => {
      // Arrange
      const newProduct = {
        nombre: 'Nuevo Producto',
        descripcion: 'Descripción del nuevo producto',
        precio: 5000,
        cantidad: 50
      };

      // Act
      const result = await productService.createProduct(newProduct);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(4); // Next sequential ID since original mock has 3 products
      expect(result.nombre).toBe('Nuevo Producto');
      expect(result.precio).toBe(5000);
      expect(result.cantidad).toBe(50);
      expect(result.activo).toBe(true);
    });

    it('Error case: Should fail with invalid name (less than 3 characters)', async () => {
      // Arrange
      const invalidProduct = {
        nombre: 'AB',
        descripcion: 'Descripción',
        precio: 1000,
        cantidad: 10
      };

      // Act & Assert
      await expect(productService.createProduct(invalidProduct))
        .rejects
        .toThrow('El nombre debe tener al menos 3 caracteres');
    });

    it('Error case: Should fail with invalid price (less than or equal to 0)', async () => {
      // Arrange
      const invalidProduct = {
        nombre: 'Producto Test',
        descripcion: 'Descripción',
        precio: 0,
        cantidad: 10
      };

      // Act & Assert
      await expect(productService.createProduct(invalidProduct))
        .rejects
        .toThrow('El precio debe ser mayor a 0');
    });

    it('Error case: Should fail with invalid quantity (negative number)', async () => {
      // Arrange
      const invalidProduct = {
        nombre: 'Producto Test',
        descripcion: 'Descripción',
        precio: 1000,
        cantidad: -5
      };

      // Act & Assert
      await expect(productService.createProduct(invalidProduct))
        .rejects
        .toThrow('La cantidad debe ser un número entero positivo');
    });
  });
  
  describe('READ - getProductById()', () => {
    
    it('Success case: Should get an existing product', async () => {
      // Arrange
      const productId = 1;

      // Act
      const result = await productService.getProductById(productId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.nombre).toBe('Producto Test 1');
      expect(result.precio).toBe(1000);
      expect(result.cantidad).toBe(10);
      expect(result.activo).toBe(true);
    });

    it('Error case: Should return null for non-existent product', async () => {
      // Arrange
      const nonExistentId = 9999;

      // Act
      const result = await productService.getProductById(nonExistentId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('READ - getActiveProducts()', () => {
    
    it('Success case: Should return only active products', async () => {
      // Act
      const result = await productService.getActiveProducts();

      // Assert
      expect(result).toHaveLength(2); // Only products with activo = 1
      expect(result.every(p => p.activo === true)).toBe(true);
      expect(result.find(p => p.id === 3)).toBeUndefined(); // The inactive product should not be present
    });
  });

  describe('UPDATE - updateProduct()', () => {
    
    it('Success case: Should update an existing product', async () => {
      // Arrange
      const productId = 1;
      const updatedData = {
        nombre: 'Producto Actualizado',
        descripcion: 'Nueva descripción',
        precio: 1500,
        cantidad: 15
      };

      // Act
      const result = await productService.updateProduct(productId, updatedData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.nombre).toBe('Producto Actualizado');
      expect(result.precio).toBe(1500);
      expect(result.cantidad).toBe(15);
      expect(result.activo).toBe(true); // No debe cambiar
    });

    it('Error case: Should fail when updating a non-existent product', async () => {
      // Arrange
      const nonExistentId = 9999;
      const updatedData = {
        nombre: 'Producto Actualizado',
        descripcion: 'Nueva descripción',
        precio: 1500,
        cantidad: 15
      };

      // Act & Assert
      await expect(productService.updateProduct(nonExistentId, updatedData))
        .rejects
        .toThrow('Producto no encontrado');
    });

    it('Error case: Should fail with invalid data', async () => {
      // Arrange
      const productId = 1;
      const invalidData = {
        nombre: 'AB', // Nombre muy corto
        descripcion: 'Descripción',
        precio: 1000,
        cantidad: 10
      };

      // Act & Assert
      await expect(productService.updateProduct(productId, invalidData))
        .rejects
        .toThrow('El nombre debe tener al menos 3 caracteres');
    });
  });

  describe('DELETE - deleteProduct() [Soft Delete]', () => {
    
    it('Success case: Should soft delete an existing product', async () => {
      // Arrange
      const productId = 1;

      // Act
      const result = await productService.deleteProduct(productId);

      // Assert
      expect(result).toBe(true);
      
      // Verify product is marked as inactive
      const deletedProduct = await productService.getProductById(productId);
      expect(deletedProduct).toBeDefined();
      expect(deletedProduct.activo).toBe(false);
    });

    it('Error case: Should fail when deleting a non-existent product', async () => {
      // Arrange
      const nonExistentId = 9999;

      // Act & Assert
      await expect(productService.deleteProduct(nonExistentId))
        .rejects
        .toThrow('Producto no encontrado');
    });
  });

  describe('VALIDATION - validateProductData()', () => {
    
    it('Success case: Should validate correct data', () => {
      // Arrange
      const validData = {
        nombre: 'Producto Válido',
        descripcion: 'Descripción válida',
        precio: 1000,
        cantidad: 10
      };

      // Act
      const result = productService.validateProductData(validData);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('Error case: Should detect multiple validation errors', () => {
      // Arrange
      const invalidData = {
        nombre: 'AB', // Too short
        descripcion: 'Description',
        precio: -100, // Negative
        cantidad: 5.5 // Not an integer
      };

      // Act
      const result = productService.validateProductData(invalidData);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('El nombre debe tener al menos 3 caracteres');
      expect(result.errors).toContain('El precio debe ser mayor a 0');
    });
  });
});
