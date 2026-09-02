const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');
const { withAuth, withAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog endpoints (public & admin)
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List all products with optional filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (Clothing, Tech)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: List of products with pagination
 */
router.get('/', async (req, res) => {
  const { search, category, page = 1, limit = 12 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (category) where.category = { equals: category, mode: 'insensitive' };
  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.product.count({ where }),
  ]);
  res.json({
    data: {
      products,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
    message: 'Success',
  });
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ error: 'Product not found', data: null });
  res.json({ data: product, message: 'Success' });
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, category]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 *       403:
 *         description: Admin only
 */
router.post('/', withAdmin, async (req, res) => {
  const { name, description, price, stock = 0, category, imageUrl } = req.body;
  if (!name || !description || price === undefined || !category) {
    return res.status(400).json({ error: 'name, description, price and category are required', data: null });
  }
  const product = await prisma.product.create({
    data: { name, description, price: Number(price), stock: Number(stock), category, imageUrl },
  });
  res.status(201).json({ data: product, message: 'Product created' });
});

module.exports = router;
