import prisma from '../src/db';

async function purge() {
  try {
    await prisma.userItem.deleteMany({
      where: {
        isDemo: true,
      },
    });

    await prisma.session.deleteMany({
      where: {
        isDemo: true,
      },
    });

    await prisma.item.deleteMany({
      where: {
        isDemo: true,
      },
    });

    await prisma.user.deleteMany({
      where: {
        isDemo: true,
      },
    });

    console.log('Demo data purged successfully!');
  } catch (error) {
    console.error('Error purging demo data:', error);
    throw error;
  }
}

purge()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
