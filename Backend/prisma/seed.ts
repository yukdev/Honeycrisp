import prisma from '../src/db';
import bcrypt from 'bcrypt';
import { hashPassword } from '../src/helpers/auth';

async function seed() {
  // Delete all existing data
  await prisma.userItem.deleteMany();
  await prisma.item.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      id: '1',
      email: 'georgeweng@example.com',
      name: 'George',
      password: await hashPassword('yukiho'),
      isAdmin: true,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      id: '2',
      email: 'ericlin@example.com',
      name: 'Eric',
      password: await hashPassword('yooks'),
    },
  });
  const user3 = await prisma.user.create({
    data: {
      id: '3',
      email: 'williechoi@example.com',
      name: 'Bob',
      password: await hashPassword('bob'),
    },
  });

  const session = await prisma.session.create({
    data: {
      name: 'Sotto le Stelle',
      items: {
        create: [
          {
            name: 'Bruschetta',
            price: 8.5,
          },
          {
            name: 'Angel and Devil',
            price: 19.5,
          },
          {
            name: 'Star Pizza',
            price: 21.5,
          },
          {
            name: 'Star Pizza',
            price: 21.5,
          },
          {
            name: 'Crema di Funghi E Tartufo',
            price: 22.5,
          },
          {
            name: 'Motoguzzi',
            price: 12.0,
          },
          {
            name: 'Milano',
            price: 12.0,
          },
          {
            name: 'Whisky',
            price: 10.0,
          },
        ],
      },
      owner: { connect: { id: user1.id } },
    },
    include: { items: true },
  });

  const userItems = [
    { userId: user1.id, itemId: session.items[0].id },
    { userId: user2.id, itemId: session.items[0].id },
    { userId: user3.id, itemId: session.items[0].id },
    { userId: user1.id, itemId: session.items[1].id },
    { userId: user2.id, itemId: session.items[1].id },
    { userId: user3.id, itemId: session.items[1].id },
    { userId: user1.id, itemId: session.items[2].id },
    { userId: user2.id, itemId: session.items[2].id },
    { userId: user3.id, itemId: session.items[2].id },
    { userId: user1.id, itemId: session.items[3].id },
    { userId: user1.id, itemId: session.items[4].id },
    { userId: user2.id, itemId: session.items[4].id },
    { userId: user3.id, itemId: session.items[4].id },
    { userId: user1.id, itemId: session.items[5].id },
    { userId: user2.id, itemId: session.items[6].id },
    { userId: user3.id, itemId: session.items[7].id },
  ];

  await Promise.all(
    userItems.map((userItem) => prisma.userItem.create({ data: userItem })),
  );

  console.log({ user1, user2, user3, session, userItems });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
