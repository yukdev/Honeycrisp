import prisma from '../src/db';

async function seed() {
  const user1 = await prisma!.user.upsert({
    where: { email: 'johndoe@example.com' },
    update: {},
    create: {
      email: 'johndoe@example.com',
      name: 'John',
      password: 'password',
    },
  });

  const user2 = await prisma!.user.upsert({
    where: { email: 'janedoe@example.com' },
    update: {},
    create: {
      email: 'janedoe@example.com',
      name: 'Jane',
      password: 'password',
    },
  });

  const session = await prisma!.session.create({
    data: {
      name: 'Lunch at the park',
      items: {
        create: [
          {
            name: 'Hamburger',
            quantity: 2,
            price: 10.99,
            eatenBy: { connect: { id: user1.id } },
          },
          {
            name: 'Fries',
            quantity: 1,
            price: 4.99,
            eatenBy: { connect: [{ id: user1.id }, { id: user2.id }] },
          },
        ],
      },
    },
    include: { items: true },
  });

  console.log({ user1, user2, session });
}

seed()
  .then(async () => {
    await prisma!.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma!.$disconnect();
    process.exit(1);
  });
