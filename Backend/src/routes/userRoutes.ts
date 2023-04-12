import { Router } from 'express';
import { validate } from 'jsonschema';
import prisma from '../db';
import { BadRequestError } from '../expressErrors';
import userRegister from '../schemas/userRegister.json';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const validator = validate(req.body, userRegister, { required: true });

    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack).join('\n');
      throw new BadRequestError(errors);
    }

    const { email, name, password } = req.body;

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

export default router;
