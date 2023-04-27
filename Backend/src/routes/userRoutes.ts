import { Router } from 'express';
import { validate } from 'jsonschema';
import prisma from '../db';
import { BadRequestError } from '../expressErrors';
import userRegister from '../schemas/userRegister.json';
import userLogin from '../schemas/userLogin.json';
import userUpdate from '../schemas/userUpdate.json';
import guestUpdate from '../schemas/guestUpdate.json';
import { hashPassword, comparePassword } from '../helpers/auth';

const router = Router();

/**
 * GET /users
 *
 * Returns a list of all users
 */
router.get('/', async (req, res, next) => {
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
    const { isGuest, name, email, password, currentPassword } = req.body;

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
          },
        });
      } else {
        updatedUser = await prisma.user.update({
          where: { id },
          data: {
            name,
            email,
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

export default router;
