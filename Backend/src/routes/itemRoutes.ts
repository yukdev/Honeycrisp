import { Router } from 'express';
import { validate } from 'jsonschema';
import prisma from '../db';
import { BadRequestError } from '../expressErrors';

const router = Router();

/**
 * PUT /items/:id
 *
 * Updates an item in the database.
 */
router.put('/:itemId', async (req, res, next) => {
  console.log('body', req.body);
  try {
    const { itemId } = req.params;
    const { name, price } = req.body;

    const item = await prisma.item.update({
      where: { id: itemId },
      data: { name, price },
    });

    if (!item) throw new BadRequestError('Item not found');

    return res.json({ item });
  } catch (err) {
    return next(err);
  }
});

export default router;
