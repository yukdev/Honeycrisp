import { Router } from 'express';
import { validate } from 'jsonschema';
import prisma from '../db';
import { BadRequestError } from '../expressErrors';
import { calculateBill } from '../helpers/bill';

const router = Router();

/**
 * PUT /items/:id
 *
 * Updates an item in the database.
 */
router.put('/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { name, price } = req.body;

    const item = await prisma.item.update({
      where: { id: itemId },
      data: { name, price },
    });

    if (!item) throw new BadRequestError('Item not found');

    const session = await prisma.session.findUnique({
      where: { id: item.sessionId! },
      include: { items: true },
    });

    if (!session) throw new BadRequestError('Session not found');

    await prisma.session.update({
      where: { id: session.id },
      data: {
        bill: calculateBill(
          session.items,
          session.tax,
          session.tip,
          session.tipType,
        ),
      },
    });

    return res.json({ item });
  } catch (err) {
    return next(err);
  }
});

export default router;
