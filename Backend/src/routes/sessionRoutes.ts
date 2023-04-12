import { Router } from 'express';
import { validate } from 'jsonschema';
import prisma from '../db';
import { requireAdmin } from '../middleware/auth';
import { BadRequestError, NotFoundError } from 'expressErrors';
import calculateBill from 'helpers/calculateBill';

const router = Router();

interface Item {
  name: string;
  quantity: number;
  price: number;
  eatenBy?: string[];
}

/**
 * GET /session
 *
 * Returns a list of all sessions
 */
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const sessions = await prisma.session.findMany({
      include: { items: true },
    });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /session
 *
 * Creates a new session
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, items, tax, tip } = req.body;

    const newSession = await prisma.session.create({
      data: {
        name,
        items: {
          create: items.map((item: Item) => ({ ...item })),
        },
        tax,
        tip,
      },
      include: { items: true },
    });
    res.json(newSession);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /sessions/:sessionId
 *
 * Returns details for a single session by ID
 */
router.get('/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { items: true },
    });

    if (!session) {
      throw new NotFoundError(`Session not found with id ${sessionId}`);
    }

    res.json(session);
  } catch (err) {
    next(err);
  }
});

// TODO: mock user data - deprecate later
const user = {
  id: '1',
  name: 'John',
};

/**
 * PUT /sessions/:sessionId
 *
 * Marks items as eaten for a session.
 */
router.put('/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { items } = req.body;
    const userId = user.id;
    // figure this out later
    // const { userId } = req.user;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { items: true },
    });

    if (!session) {
      throw new NotFoundError(`Session not found with id ${sessionId}`);
    }

    // Find all items that the user ate
    const eatenItems = session.items.filter((item) => items.includes(item.id));

    // Create a UserItem record for each eaten item
    await Promise.all(
      eatenItems.map((item) =>
        prisma.userItem.create({
          data: {
            userId,
            itemId: item.id,
          },
        }),
      ),
    );

    res.json({
      message: `Successfully updated session with ID ${sessionId}`,
      user: user.name,
      eatenItems: eatenItems.map((item) => item.name),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:sessionId/finalize', async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { items: true },
    });

    if (!session) {
      throw new NotFoundError(`Session not found with id ${sessionId}`);
    }

    // Check if session has already been finalized
    if (session.finalized) {
      throw new BadRequestError(
        `Session with id ${sessionId} has already been finalized`,
      );
    }

    // Finalize the session
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { finalized: true },
      include: { items: true },
    });

    const { items, tax, tip } = updatedSession;
    const bill = calculateBill(items, tax, tip);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /sessions/:sessionId
 *
 * Deletes a session by ID
 */
router.delete('/:sessionId', requireAdmin, async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    await prisma.session.delete({
      where: { id: sessionId },
    });

    res.sendStatus(204); // 204 No Content response indicates the deletion was successful
  } catch (err) {
    next(err);
  }
});

export default router;
