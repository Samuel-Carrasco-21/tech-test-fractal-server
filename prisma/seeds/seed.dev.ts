import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.warn('🌱 Iniciando el proceso de seeding...');

  console.warn('🗑️  Limpiando datos existentes...');
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  console.warn('✅ Datos existentes eliminados.');

  console.warn('💻 Creando productos...');
  const laptop = await prisma.product.create({
    data: {
      name: 'Laptop Gamer Pro 16"',
      unitPrice: 1899.99,
    },
  });

  const mouse = await prisma.product.create({
    data: {
      name: 'Mouse Inalámbrico Ergonómico',
      unitPrice: 79.5,
    },
  });

  const keyboard = await prisma.product.create({
    data: {
      name: 'Teclado Mecánico RGB',
      unitPrice: 125.0,
    },
  });

  const monitor = await prisma.product.create({
    data: {
      name: 'Monitor Curvo Ultrawide 34"',
      unitPrice: 850.0,
    },
  });
  console.warn('✅ Productos creados.');

  console.warn('🛒 Creando pedidos...');
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2025-001',
      status: OrderStatus.COMPLETED,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2025-002',
      status: OrderStatus.IN_PROGRESS,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2025-003',
      status: OrderStatus.PENDING,
    },
  });
  console.warn('✅ Pedidos creados.');

  console.warn('🔗 Asociando productos a los pedidos...');

  // --- Items para el Pedido 1 (Completado) ---
  await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: laptop.id,
      quantity: 1,
      priceAtOrder: laptop.unitPrice,
    },
  });
  await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: mouse.id,
      quantity: 1,
      priceAtOrder: mouse.unitPrice,
    },
  });

  // --- Items para el Pedido 2 (En Progreso) ---
  await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: monitor.id,
      quantity: 1,
      priceAtOrder: monitor.unitPrice,
    },
  });
  await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: keyboard.id,
      quantity: 2,
      priceAtOrder: keyboard.unitPrice,
    },
  });

  // --- Items para el Pedido 3 (Pendiente) ---
  await prisma.orderItem.create({
    data: {
      orderId: order3.id,
      productId: laptop.id,
      quantity: 1,
      priceAtOrder: laptop.unitPrice,
    },
  });
  console.warn('✅ Productos asociados correctamente.');
}

// Ejecución del script principal
main()
  .then(async () => {
    console.warn('🎉 Seeding completado exitosamente!');
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error('❌ Error durante el proceso de seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
