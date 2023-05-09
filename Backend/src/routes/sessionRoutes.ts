import { Router } from 'express';
import { validate } from 'jsonschema';
import prisma from '../db';
import { requireAdmin } from '../middleware/auth';
import { BadRequestError, NotFoundError } from '../expressErrors';
import sessionCreate from '../schemas/sessionCreate.json';
import sessionEdit from '../schemas/sessionEdit.json';
import sessionItemsEaten from '../schemas/sessionItemsEaten.json';
import sessionItemAdd from '../schemas/sessionItemAdd.json';
import { Session, calculateBill, calculateSplit } from '../helpers/bill';

const router = Router();

interface SplitUser {
  id: string;
  name: string;
  split: number;
  paid: boolean;
}

interface EditItem {
  id: string;
  name: string;
  price: number;
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
    const { ownerId, ownerName, name, items, tax, tip, tipType } = req.body;

    const validator = validate(req.body, sessionCreate, { required: true });

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

    const bill = calculateBill(itemsWithQuantity, tax, tip, tipType);

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
        tipType,
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
                  select: { name: true, id: true },
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
      [key: string]: {
        itemId: string;
        name: string;
        eatenBy: { id: string; name: string }[];
      };
    } = {};
    for (const item of session.items) {
      const { id: itemId, name: itemName } = item;
      const key = `${itemId}`;
      const eatenBy = item.userItems.map((ui) => ({
        id: ui.user.id,
        name: ui.user.name,
      }));
      if (!itemsEaten[key]) {
        itemsEaten[key] = { itemId, name: itemName, eatenBy };
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
      itemsEaten: Object.values(itemsEaten).map(
        ({ itemId, name, eatenBy }) => ({
          itemId,
          name,
          eatenBy: eatenBy.sort((a, b) => a.name.localeCompare(b.name)),
        }),
      ),
    };

    res.json(sessionWithItemsEaten);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /sessions/:sessionId/
 *
 * Updates a session
 */
router.put('/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { name, tax, tip, tipType, items } = req.body;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { items: true },
    });

    if (!session) {
      throw new NotFoundError(`Session not found with id ${sessionId}`);
    }

    if (session.finalized) {
      throw new BadRequestError(
        `Session with id ${sessionId} has already been finalized`,
      );
    }

    const validator = validate(req.body, sessionEdit, { required: true });

    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack).join('\n');
      throw new BadRequestError(errors);
    }

    const deletedItemIds = session.items
      .map((item) => item.id)
      .filter((itemId) => !items.some((item: EditItem) => item.id === itemId));
    await prisma.item.deleteMany({ where: { id: { in: deletedItemIds } } });

    const updatedItems = await Promise.all(
      items.map(async (item: EditItem) => {
        if (session.items.some((sessionItem) => sessionItem.id === item.id)) {
          return await prisma.item.update({
            where: { id: item.id },
            data: {
              name: item.name,
              price: item.price,
            },
          });
        } else {
          return await prisma.item.create({
            data: {
              name: item.name,
              price: item.price,
              sessionId,
            },
          });
        }
      }),
    );

    const bill = calculateBill(items, tax, tip, tipType);

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        name,
        tax,
        tip,
        tipType,
        bill,
        items: {
          connect: updatedItems.map((item) => ({ id: item.id })),
        },
      },
      include: { items: true },
    });

    res.json(updatedSession);
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
 * POST /sessions/:sessionId/eat
 *
 * Marks items as eaten for a session.
 */
router.post('/:sessionId/eat', async (req, res, next) => {
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

    if (session.finalized) {
      throw new BadRequestError(
        `Session with id ${sessionId} has already been finalized`,
      );
    }

    const validator = validate(req.body, sessionItemsEaten, { required: true });

    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack).join('\n');
      throw new BadRequestError(errors);
    }

    await prisma.userItem.deleteMany({
      where: {
        userId: userId,
        itemId: {
          in: session.items.map((item) => item.id),
        },
      },
    });

    const eatenItems = session.items.filter((item) => items.includes(item.id));

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

/**
 * POST /sessions/:sessionId/finalize
 *
 * Finalizes a session
 */
router.post('/:sessionId/finalize', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        items: {
          include: {
            userItems: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
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

    if (session.finalized) {
      throw new BadRequestError(
        `Session with id ${sessionId} has already been finalized`,
      );
    }

    if (session.ownerId !== userId) {
      throw new BadRequestError(
        `Only the owner of the session can finalize it`,
      );
    }

    const split = calculateSplit(session as Session);

    await prisma.session.update({
      where: { id: sessionId },
      data: { split, finalized: true },
    });

    res.json({ split });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /sessions/:sessionId/unfinalize
 *
 * Unfinalizes a session
 */
router.post('/:sessionId/unfinalize', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { owner: true },
    });

    if (!session) {
      throw new NotFoundError(`Session not found with id ${sessionId}`);
    }

    if (!session.finalized) {
      throw new BadRequestError(
        `Session with id ${sessionId} has not been finalized`,
      );
    }

    if (session.ownerId !== userId) {
      throw new BadRequestError(
        `Only the owner of the session can unfinalize it`,
      );
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: { finalized: false },
    });

    res.json({
      message: `Successfully unfinalized session with ID ${sessionId}`,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /sessions/:sessionId/paid
 *
 * Marks a user as paid for a session
 */
router.post('/:sessionId/paid', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { owner: true },
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const split = JSON.parse(JSON.stringify(session.split));

    const updatedSplit = split.map((user: SplitUser) => {
      if (user.id === userId) {
        return { ...user, paid: !user.paid };
      }
      return user;
    });

    await prisma.session.update({
      where: { id: sessionId },
      data: { split: updatedSplit },
    });

    const user = updatedSplit.find((user: SplitUser) => user.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found in split' });
    }

    const message = user.paid
      ? `${user.name} marked as paid`
      : `${user.name} marked as unpaid`;

    res.status(200).json({ message });
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

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
