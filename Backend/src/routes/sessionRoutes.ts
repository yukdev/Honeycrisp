import { Router } from 'express';
import { validate } from 'jsonschema';
import prisma from '../db';
import { requireAdmin } from '../middleware/auth';
import { BadRequestError, NotFoundError } from '../expressErrors';
import sessionCreate from '../schemas/sessionCreate.json';
import sessionItemsEaten from '../schemas/sessionItemsEaten.json';
import sessionItemAdd from '../schemas/sessionItemAdd.json';
import { calculateBill } from '../helpers/bill';

const router = Router();

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
    return res.status(200).json(sessions);
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
    const { ownerId, ownerName, name, items, tax, tip } = req.body;

    const validator = validate(req.body, sessionCreate, { required: true });

    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack).join('\n');
      throw new BadRequestError(errors);
    }

    const bill = calculateBill(items, tax, tip);

    const itemsWithQuantity = [];

    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        itemsWithQuantity.push({
          name: item.name,
          price: item.price,
        });
      }
    }

    const newSession = await prisma.session.create({
      data: {
        ownerId,
        ownerName,
        name,
        items: {
          create: itemsWithQuantity,
        },
        tax,
        tip,
        bill,
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
      include: {
        items: {
          include: {
            userItems: {
              include: {
                user: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundError(`Session not found with id ${sessionId}`);
    }

    const itemsEaten: {
      [key: string]: { name: string; eatenBy: string[] };
    } = {};
    for (const item of session.items) {
      const key = `${item.name}`;
      const eatenBy = item.userItems.map((ui) => ui.user.name);
      if (!itemsEaten[key]) {
        itemsEaten[key] = { name: item.name, eatenBy };
      } else {
        itemsEaten[key].eatenBy = [...itemsEaten[key].eatenBy, ...eatenBy];
      }
    }

    const sessionWithItemsEaten = {
      ...session,
      items: session.items.map((item) => {
        const { userItems, ...rest } = item;
        return rest;
      }),
      itemsEaten: Object.values(itemsEaten).map(({ name, eatenBy }) => ({
        name,
        eatenBy,
      })),
    };

    res.json(sessionWithItemsEaten);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /sessions/:sessionId/add
 *
 * Updates the items eaten for a session
 */
router.post('/:sessionId/add', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { items } = req.body;

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

    const validator = validate(req.body, sessionItemAdd, { required: true });

    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack).join('\n');
      throw new BadRequestError(errors);
    }

    const itemsWithQuantity = [];

    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        itemsWithQuantity.push({
          name: item.name,
          price: item.price,
        });
      }
    }

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      include: { items: true },
      data: {
        items: {
          create: itemsWithQuantity,
        },
      },
    });

    res.json(updatedSession);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /sessions/:sessionId
 *
 * Marks items as eaten for a session.
 */
router.put('/:sessionId/eat', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { items, userId, userName } = req.body;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { items: true },
    });

    if (!session) {
      throw new NotFoundError(`Session not found with id ${sessionId}`);
    }

    // Check if session has already been finalized
    // if (session.finalized) {
    //   throw new BadRequestError(
    //     `Session with id ${sessionId} has already been finalized`,
    //   );
    // }

    // Validate request body
    const validator = validate(req.body, sessionItemsEaten, { required: true });

    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack).join('\n');
      throw new BadRequestError(errors);
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
      user: userName,
      eatenItems: eatenItems.map((item) => item.name),
    });
  } catch (err) {
    next(err);
  }
});

// router.post('/:sessionId/finalize', async (req, res, next) => {
//   try {
//     const { sessionId } = req.params;

//     const session = await prisma.session.findUnique({
//       where: { id: sessionId },
//       include: { items: true },
//     });

//     if (!session) {
//       throw new NotFoundError(`Session not found with id ${sessionId}`);
//     }

//     // Check if session has already been finalized
//     // if (session.finalized) {
//     //   throw new BadRequestError(
//     //     `Session with id ${sessionId} has already been finalized`,
//     //   );
//     // }

//     // Check if it's the owner finalizing the session
//     // if (session.ownerId !== user.id) {
//     //   throw new BadRequestError(
//     //     `Only the owner of the session can finalize it`,
//     //   );
//     // }

//     const { items, tax, tip } = session;
//     const bill = calculateBill(items, tax, tip);
//     const { total } = bill;

//     await prisma.session.update({
//       where: { id: sessionId },
//       data: { finalized: true, bill: total },
//       include: { items: true },
//     });

//     res.json({ bill });
//   } catch (err) {
//     next(err);
//   }
// });

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

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
