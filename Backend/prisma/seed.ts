import prisma from '../src/db';
import bcrypt from 'bcrypt';

async function seed() {
  // Delete all existing data
  await prisma.user.deleteMany();
  await prisma.item.deleteMany();
  await prisma.session.deleteMany();
  await prisma.userItem.deleteMany();

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password', 10);

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'johndoe@example.com',
      name: 'John',
      password: hashedPassword,
      isAdmin: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'janedoe@example.com',
      name: 'Jane',
      password: hashedPassword,
    },
  });

  // Create session
  const session = await prisma.session.create({
    data: {
      name: 'Lunch at the park',
      items: {
        create: [
          {
            name: 'Hamburger',
            quantity: 1,
            price: 10.99,
          },
          {
            name: 'Fries',
            quantity: 1,
            price: 4.99,
          },
        ],
      },
    },
    include: { items: true },
  });

  // Create UserItems
  const userItem1 = await prisma.userItem.create({
    data: {
      user: { connect: { id: user1.id } },
      item: { connect: { id: session.items[0].id } },
    },
  });

  const userItem2 = await prisma.userItem.create({
    data: {
      user: { connect: { id: user1.id } },
      item: { connect: { id: session.items[1].id } },
    },
  });

  const userItem3 = await prisma.userItem.create({
    data: {
      user: { connect: { id: user2.id } },
      item: { connect: { id: session.items[1].id } },
    },
  });

  console.log({ user1, user2, session, userItem1, userItem2, userItem3 });
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
