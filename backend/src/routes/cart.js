const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');
const { withAuth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management (JWT required)
 */

router.get('/', withAuth, async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.userId },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  });
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  res.json({ data: { items, total, count: items.length }, message: 'Success' });
});

router.post('/', withAuth, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId is required', data: null });
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: 'Product not found', data: null });
  if (product.stock < quantity) {
    return res.status(400).json({ error: `Insufficient stock. Only ${product.stock} available`, data: null });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: req.userId, productId } },
  });

  let item;
  if (existing) {
    item = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + Number(quantity) },
      include: { product: true },
    });
  } else {
    item = await prisma.cartItem.create({
      data: { userId: req.userId, productId, quantity: Number(quantity) },
      include: { product: true },
    });
  }
  res.status(201).json({ data: item, message: 'Item added to cart' });
});

router.patch('/:id', withAuth, async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1', data: null });
  }
  const item = await prisma.cartItem.findFirst({
    where: { id: req.params.id, userId: req.userId },
    include: { product: true },
  });
  if (!item) return res.status(404).json({ error: 'Cart item not found', data: null });
  if (item.product.stock < quantity) {
    return res.status(400).json({ error: `Only ${item.product.stock} items in stock`, data: null });
  }
  const updated = await prisma.cartItem.update({
    where: { id: req.params.id },
    data: { quantity: Number(quantity) },
    include: { product: true },
  });
  res.json({ data: updated, message: 'Cart updated' });
});

router.delete('/:id', withAuth, async (req, res) => {
  const item = await prisma.cartItem.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!item) return res.status(404).json({ error: 'Cart item not found', data: null });
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ data: null, message: 'Item removed from cart' });
});

router.delete('/', withAuth, async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.userId } });
  res.json({ data: null, message: 'Cart cleared' });
});

module.exports = router;
