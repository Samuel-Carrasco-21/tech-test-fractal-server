import { Router } from 'express';
import { OrderController } from '../controllers';
import { OrderRepository, ProductRepository } from '../repositories';
import { OrderService } from '../services/order.service';

const router = Router();

// --- Inyección de Dependencias ---

// 1. Instanciar los Repositorios
const orderRepository = new OrderRepository();
const productRepository = new ProductRepository(); // Necesario para el OrderService

// 2. Instanciar el Servicio, inyectando todas sus dependencias
const orderService = new OrderService(orderRepository, productRepository);

// 3. Instanciar el Controlador, inyectando el Servicio
const orderController = new OrderController(orderService);

// --- Definición de Rutas ---

// GET /orders -> Obtener todos los pedidos (vista de lista)
router.get('/', orderController.getAllOrders.bind(orderController));

// GET /orders/:id -> Obtener un pedido específico (vista de detalle)
router.get('/:id', orderController.getOrderById.bind(orderController));

// POST /orders -> Crear un nuevo pedido
router.post('/', orderController.createOrder.bind(orderController));

// PATCH /orders/:id -> Actualizar el estado de un pedido
router.patch('/:id', orderController.updateOrderStatus.bind(orderController));

// DELETE /orders/:id -> Eliminar un pedido
router.delete('/:id', orderController.deleteOrder.bind(orderController));

export default router;
