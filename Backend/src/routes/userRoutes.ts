import prisma from '../db';
import { Router } from 'express';
import { validate } from 'jsonschema';
import { hashPassword, comparePassword } from '../helpers/auth';
import {
  mockSession1Items,
  mockSession2Items,
  mockSession3Items,
} from '../helpers/demo';
import { calculateSplit } from '../helpers/bill';
import { requireSecret } from '../middleware/auth';
import { BadRequestError } from '../expressErrors';
import { v4 as uuid } from 'uuid';
import userRegister from '../schemas/userRegister.json';
import userLogin from '../schemas/userLogin.json';
import userUpdate from '../schemas/userUpdate.json';
import guestUpdate from '../schemas/guestUpdate.json';
import { TipType } from '@prisma/client';
import { Session } from '@/lib/types';

const router = Router();

/**
 * GET /users
 *
 * Returns a list of all users
 */
router.get('/', requireSecret, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /users
 *
 * Creates a new user
 */
router.post('/register', async (req, res, next) => {
  try {
    const validator = validate(req.body, userRegister, { required: true });

    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack).join('\n');
      throw new BadRequestError(errors);
    }

    const { email, name, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestError(`Email: ${req.body.email} is already in use'`);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ user: newUser });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
  }
});

/**
 * POST /users/login
 *
 * Logs in a user
 */
router.post('/login', async (req, res, next) => {
  try {
    const validator = validate(req.body, userLogin, { required: true });

    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack).join('\n');
      throw new BadRequestError(errors);
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestError('There is no user associated with that email');
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      throw new BadRequestError('Invalid password');
    }

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
  }
});

/**
 * PUT /users/:id
 *
 * Updates a user's information
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { isGuest, name, email, paymentAddress, password, currentPassword } =
      req.body;

    let updatedUser;
    const { id } = req.params;

    if (isGuest) {
      const validator = validate(req.body, guestUpdate, { required: true });

      if (!validator.valid) {
        const errors = validator.errors.map((e) => e.stack).join('\n');
        throw new BadRequestError(errors);
      }

      updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          paymentAddress,
          password: await hashPassword(password),
          isGuest: false,
        },
      });
    } else {
      const validator = validate(req.body, userUpdate, { required: true });

      if (!validator.valid) {
        const errors = validator.errors.map((e) => e.stack).join('\n');
        throw new BadRequestError(errors);
      }

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new BadRequestError('User not found');
      }

      const validPassword = await comparePassword(
        currentPassword,
        user.password,
      );

      if (!validPassword) {
        throw new BadRequestError('Invalid password');
      }

      if (!password) {
        updatedUser = await prisma.user.update({
          where: { id },
          data: {
            name,
            email,
            paymentAddress,
          },
        });
      } else {
        updatedUser = await prisma.user.update({
          where: { id },
          data: {
            name,
            email,
            paymentAddress,
            password: await hashPassword(password),
          },
        });
      }
    }

    return res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

/**
 *
 * POST /users/guest-login
 *
 * Logs in a guest user
 */
router.post('/guest-login', async (req, res, next) => {
  try {
    const { name, email, password, sessionId } = req.body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        isGuest: true,
      },
    });

    if (!sessionId) {
      return res.status(200).json({ newUser });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new BadRequestError('Session not found');
    }

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        guests: Array.isArray(session.guests)
          ? session.guests.concat({ id: newUser.id, name: newUser.name })
          : [{ id: newUser.id, name: newUser.name }],
      },
    });

    return res.status(200).json({ newUser, updatedSession });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
  }
});

/**
 * GET /users/:id/sessions
 *
 * Returns a list of sessions associated with the given user id
 */
router.get('/:id/sessions', async (req, res, next) => {
  try {
    const { id } = req.params;

    const userSessions = await prisma.session.findMany({
      where: {
        OR: [
          { ownerId: id },
          {
            items: {
              some: {
                userItems: {
                  some: {
                    userId: id,
                  },
                },
              },
            },
          },
        ],
      },
    });

    return res.json(userSessions);
  } catch (err) {
    next(err);
  }
});

/**
 *
 * POST /users/demo-login
 *
 * Logs in a demo user
 */
router.post('/demo-login', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const demoUser = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        isDemo: true,
      },
    });

    const mockUsers = [];
    const mockUserNames = ['Aaron', 'Bobby', 'Cindy', 'Derek', 'Evan'];

    for (const name of mockUserNames) {
      const mockUser = await prisma.user.create({
        data: {
          name,
          email: `${uuid().slice(0, 8)}@guest.com`,
          password: await hashPassword(uuid().slice(0, 8)),
          isDemo: true,
        },
      });

      mockUsers.push(mockUser);
    }

    await prisma.session.create({
      data: {
        name: 'Golden Lotus Dim Sum',
        items: {
          create: mockSession1Items,
        },
        owner: {
          connect: {
            id: mockUsers[0].id,
          },
        },
        ownerName: mockUsers[0].name,
        subtotal: 18.94,
        tip: 5,
        tax: 0,
        tipType: TipType.PERCENTAGE,
        bill: 23.94,
        isDemo: true,
      },
    });

    await prisma.session.create({
      data: {
        name: 'Sahib Indian Cuisine',
        items: {
          create: mockSession2Items,
        },
        owner: {
          connect: {
            id: demoUser.id,
          },
        },
        ownerName: demoUser.name,
        subtotal: 133.95,
        bill: 172.63,
        isDemo: true,
      },
    });

    const unfinalizedSession = await prisma.session.create({
      data: {
        name: 'Tsunami Seafood Boil',
        items: {
          create: mockSession3Items,
        },
        owner: {
          connect: {
            id: demoUser.id,
          },
        },
        ownerName: demoUser.name,
        subtotal: 33.96,
        bill: 43.77,
        isDemo: true,
      },
    });

    const eatenItems = [
      {
        userId: mockUsers[0].id,
        itemId: mockSession1Items[0].id,
        isDemo: true,
      },
      {
        userId: mockUsers[1].id,
        itemId: mockSession1Items[0].id,
        isDemo: true,
      },
      {
        userId: mockUsers[0].id,
        itemId: mockSession1Items[1].id,
        isDemo: true,
      },
      {
        userId: mockUsers[1].id,
        itemId: mockSession1Items[1].id,
        isDemo: true,
      },
      {
        userId: mockUsers[0].id,
        itemId: mockSession1Items[3].id,
        isDemo: true,
      },
      {
        userId: mockUsers[1].id,
        itemId: mockSession1Items[4].id,
        isDemo: true,
      },
      {
        userId: demoUser.id,
        itemId: mockSession1Items[5].id,
        isDemo: true,
      },
      {
        userId: mockUsers[4].id,
        itemId: mockSession2Items[0].id,
        isDemo: true,
      },
      {
        userId: mockUsers[3].id,
        itemId: mockSession2Items[1].id,
        isDemo: true,
      },
      {
        userId: mockUsers[2].id,
        itemId: mockSession2Items[2].id,
        isDemo: true,
      },
      {
        userId: demoUser.id,
        itemId: mockSession2Items[3].id,
        isDemo: true,
      },
      {
        userId: mockUsers[4].id,
        itemId: mockSession2Items[5].id,
        isDemo: true,
      },
      {
        userId: mockUsers[3].id,

        itemId: mockSession2Items[5].id,
        isDemo: true,
      },
      {
        userId: mockUsers[2].id,

        itemId: mockSession2Items[5].id,
        isDemo: true,
      },
      {
        userId: demoUser.id,
        itemId: mockSession2Items[5].id,
        isDemo: true,
      },
      {
        userId: demoUser.id,
        itemId: mockSession3Items[0].id,
        isDemo: true,
      },
      {
        userId: mockUsers[0].id,
        itemId: mockSession3Items[1].id,
        isDemo: true,
      },
      {
        userId: mockUsers[3].id,
        itemId: mockSession3Items[2].id,
        isDemo: true,
      },
      {
        userId: demoUser.id,
        itemId: mockSession3Items[3].id,
        isDemo: true,
      },
      {
        userId: mockUsers[0].id,
        itemId: mockSession3Items[3].id,
        isDemo: true,
      },
      {
        userId: mockUsers[3].id,
        itemId: mockSession3Items[3].id,
        isDemo: true,
      },
      {
        userId: mockUsers[0].id,
        itemId: mockSession3Items[4].id,
        isDemo: true,
      },
      {
        userId: mockUsers[3].id,
        itemId: mockSession3Items[4].id,
        isDemo: true,
      },
    ];

    await Promise.all(
      eatenItems.map((userItem) => prisma.userItem.create({ data: userItem })),
    );

    const sessionToBeFinalized = await prisma.session.findUnique({
      where: { id: unfinalizedSession.id },
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

    const split = calculateSplit(sessionToBeFinalized as Session);

    await prisma.session.update({
      where: { id: unfinalizedSession.id },
      data: { split, finalized: true },
    });

    return res.status(200).json(demoUser);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
  }
});

export default router;
