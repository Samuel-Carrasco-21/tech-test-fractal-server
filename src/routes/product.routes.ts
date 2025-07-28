import { Router } from 'express';
import { ProductController } from '../controllers';
import { ProductRepository } from '../repositories';
import { ProductService } from '../services/product.service';

const router = Router();

// --- Inyección de Dependencias ---

// 1. Instanciar el Repositorio (Capa de Infraestructura)
const productRepository = new ProductRepository();

// 2. Instanciar el Servicio, inyectando el Repositorio (Capa de Aplicación)
const productService = new ProductService(productRepository);

// 3. Instanciar el Controlador, inyectando el Servicio (Capa de Presentación/HTTP)
const productController = new ProductController(productService);

// --- Definición de Rutas ---
// El .bind() es crucial para asegurar que el 'this' dentro de los métodos del controlador
// apunte a la instancia de productController.

// GET /products -> Obtener todos los productos
router.get('/', productController.getAllProducts.bind(productController));

// GET /products/:id -> Obtener un producto por su ID
router.get('/:id', productController.getProductById.bind(productController));

// POST /products -> Crear un nuevo producto
router.post('/', productController.createProduct.bind(productController));

// PATCH /products/:id -> Actualizar un producto existente (PATCH es ideal para actualizaciones parciales)
router.patch('/:id', productController.updateProduct.bind(productController));

// DELETE /products/:id -> Eliminar un producto
router.delete('/:id', productController.deleteProduct.bind(productController));

export default router;
