import { TipType } from '@prisma/client';
import prisma from '../src/db';
import { hashPassword } from '../src/helpers/auth';

async function seed() {
  await prisma.userItem.deleteMany();
  await prisma.item.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      id: '1',
      email: 'georgedeng@email.com',
      name: 'George',
      password: await hashPassword('georgedeng'),
      isAdmin: true,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      id: '2',
      email: 'ericbin@email.com',
      name: 'Eric',
      password: await hashPassword('ericbin'),
    },
  });
  const user3 = await prisma.user.create({
    data: {
      id: '3',
      email: 'bobslop@email.com',
      name: 'Bob',
      password: await hashPassword('bobslop'),
    },
  });
  const user4 = await prisma.user.create({
    data: {
      id: '4',
      email: 'kennyyu@email.com',
      name: 'Kenny',
      password: await hashPassword('kennyyu'),
    },
  });
  const user5 = await prisma.user.create({
    data: {
      id: '5',
      email: 'johndon@email.com',
      name: 'John',
      password: await hashPassword('johndon'),
    },
  });
  const user6 = await prisma.user.create({
    data: {
      id: '6',
      email: 'jasonsin@example.com',
      name: 'Jason',
      password: await hashPassword('jasonsin'),
    },
  });

  const italianSession = await prisma.session.create({
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
      owner: { connect: { id: user2.id } },
      ownerName: user2.name,
      subtotal: 127.5,
      bill: 164.32,
    },
    include: { items: true },
  });

  const koreanSession = await prisma.session.create({
    data: {
      name: 'BCD Tofu House',
      items: {
        create: [
          {
            name: 'Bulgogi',
            price: 15.5,
          },
          {
            name: 'Galbi',
            price: 20.0,
          },
          {
            name: 'Japchae',
            price: 12.5,
          },
          {
            name: 'Bibimbap',
            price: 11.0,
          },
          {
            name: 'Korean Fried Chicken',
            price: 18.0,
          },
          {
            name: 'Kimchi Stew',
            price: 13.5,
          },
          {
            name: 'Tteokbokki',
            price: 10.0,
          },
          {
            name: 'Haemul Pajeon',
            price: 14.0,
          },
        ],
      },
      owner: { connect: { id: user4.id } },
      ownerName: user4.name,
      subtotal: 114.5,
      bill: 147.56,
    },
    include: { items: true },
  });

  const bbqSession = await prisma.session.create({
    data: {
      name: "Mike's Bar-B-Que",
      items: {
        create: [
          {
            name: 'Hot Dogs',
            price: 4.5,
          },
          {
            name: 'Hamburgers',
            price: 6.5,
          },
          {
            name: 'Veggie Burgers',
            price: 7.5,
          },
        ],
      },
      owner: { connect: { id: user1.id } },
      ownerName: user1.name,
      subtotal: 18.5,
      bill: 25.14,
      tip: 5,
      tipType: TipType.FLAT,
    },
    include: { items: true },
  });

  const userItems = [
    { userId: user1.id, itemId: italianSession.items[0].id },
    { userId: user2.id, itemId: italianSession.items[0].id },
    { userId: user3.id, itemId: italianSession.items[0].id },
    { userId: user1.id, itemId: italianSession.items[1].id },
    { userId: user2.id, itemId: italianSession.items[1].id },
    { userId: user3.id, itemId: italianSession.items[1].id },
    { userId: user1.id, itemId: italianSession.items[2].id },
    { userId: user2.id, itemId: italianSession.items[2].id },
    { userId: user3.id, itemId: italianSession.items[2].id },
    { userId: user1.id, itemId: italianSession.items[3].id },
    { userId: user1.id, itemId: italianSession.items[4].id },
    { userId: user2.id, itemId: italianSession.items[4].id },
    { userId: user3.id, itemId: italianSession.items[4].id },
    { userId: user1.id, itemId: italianSession.items[5].id },
    { userId: user2.id, itemId: italianSession.items[6].id },
    { userId: user3.id, itemId: italianSession.items[7].id },
    { userId: user1.id, itemId: koreanSession.items[0].id },
    { userId: user2.id, itemId: koreanSession.items[1].id },
    { userId: user3.id, itemId: koreanSession.items[2].id },
    { userId: user4.id, itemId: koreanSession.items[3].id },
    { userId: user5.id, itemId: koreanSession.items[4].id },
    { userId: user6.id, itemId: koreanSession.items[5].id },
    { userId: user1.id, itemId: koreanSession.items[6].id },
    { userId: user2.id, itemId: koreanSession.items[7].id },
    { userId: user1.id, itemId: bbqSession.items[0].id },
    { userId: user2.id, itemId: bbqSession.items[0].id },
    { userId: user3.id, itemId: bbqSession.items[1].id },
    { userId: user4.id, itemId: bbqSession.items[1].id },
    { userId: user5.id, itemId: bbqSession.items[2].id },
    { userId: user6.id, itemId: bbqSession.items[2].id },
  ];

  await Promise.all(
    userItems.map((userItem) => prisma.userItem.create({ data: userItem })),
  );

  console.log({ italianSession, koreanSession, bbqSession });
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
