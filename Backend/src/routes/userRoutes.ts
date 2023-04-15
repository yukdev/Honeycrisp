import { Router } from 'express';
import { validate } from 'jsonschema';
import prisma from '../db';
import { BadRequestError } from '../expressErrors';
import userRegister from '../schemas/userRegister.json';
import userLogin from '../schemas/userLogin.json';
import { hashPassword, comparePassword, generateToken } from '../helpers/auth';

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
      throw new BadRequestError(`Email ${req.body.email} already in use'`);
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
    next(error);
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
    next(error);
  }
});

export default router;
