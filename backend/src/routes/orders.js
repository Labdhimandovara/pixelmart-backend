const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');
const { withAuth, withAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management (JWT required)
 */

router.post('/', withAuth, async (req, res) => {
  const { address, paymentMethod = 'card' } = req.body;
  if (!address || !address.name || !address.street || !address.city || !address.country || !address.zip) {
    return res.status(400).json({
      error: 'Complete address (name, street, city, country, zip) is required',
      data: null,
    });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty', data: null });
  }

  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for "${item.product.name}". Only ${item.product.stock} available.`,
        data: null,
      });
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: req.userId,
        total,
        address,
        paymentMethod,
        status: 'PENDING',
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId: req.userId } });

    return newOrder;
  });

  res.status(201).json({ data: order, message: 'Order placed successfully' });
});

router.get('/', withAuth, async (req, res) => {
  const where = req.userRole === 'ADMIN' ? {} : { userId: req.userId };
  const orders = await prisma.order.findMany({
    where,
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: orders, message: 'Success' });
});

router.get('/:id', withAuth, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
  if (!order) return res.status(404).json({ error: 'Order not found', data: null });
  if (req.userRole !== 'ADMIN' && order.userId !== req.userId) {
    return res.status(403).json({ error: 'Access denied', data: null });
  }
  res.json({ data: order, message: 'Success' });
});

router.patch('/:id/status', withAdmin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Valid status required: ${validStatuses.join(', ')}`, data: null });
  }
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
    include: { items: { include: { product: true } } },
  });
  res.json({ data: order, message: 'Order status updated' });
});

module.exports = router;
