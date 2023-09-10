import { prisma } from "../src/client";
import { encryptPassword } from "../src/utils";

const clearDB = async () => {
  await Promise.all([
    prisma.user.deleteMany(),
    prisma.level.deleteMany(),
    prisma.score.deleteMany(),
  ]);
  //await prisma.user.deleteMany();
  //await prisma.level.deleteMany();
  //await prisma.score.deleteMany();
};

const users = [
  {
    userName: "EZGG",
    password: "12345",
  },
  {
    userName: "pewpew",
    password: "scoobydoo",
  },
];

const layouts = [
  {
    data: new Uint8Array([
      1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
      0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ]),
  },
  {
    data: new Uint8Array([
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ]),
  },
];

const scores = [
  {
    user: 0,
    level: 0,
    score: 10,
  },
  {
    user: 0,
    level: 0,
    score: 20,
  },
  {
    user: 0,
    level: 0,
    score: 30,
  },
  {
    user: 1,
    level: 0,
    score: 10,
  },
  {
    user: 1,
    level: 0,
    score: 20,
  },
  {
    user: 1,
    level: 0,
    score: 30,
  },
  {
    user: 0,
    level: 1,
    score: 10,
  },
  {
    user: 0,
    level: 1,
    score: 20,
  },
  {
    user: 0,
    level: 1,
    score: 30,
  },
  {
    user: 1,
    level: 1,
    score: 10,
  },
  {
    user: 1,
    level: 1,
    score: 20,
  },
  {
    user: 1,
    level: 1,
    score: 30,
  },
];

const seedUsers = async () => {
  const result = [];
  for (const user of users) {
    const newUser = await prisma.user.create({
      data: {
        userName: user.userName,
        password: await encryptPassword(user.password),
      },
    });
    result.push(newUser.id);
  }
  return result;
  // const userData = await Promise.all(
  //   users.map(async (user) => ({
  //     userName: user.userName,
  //     password: await encryptPassword(user.password),
  //   }))
  // );
  // const result = await prisma.user.createMany({
  //   data: userData,
  // });
  //return result;
};

const seedLayouts = async () => {
  const result = [];
  for (const layout of layouts) {
    const newLayout = await prisma.level.create({
      data: {
        layout: Buffer.from(layout.data),
      },
    });
    result.push(newLayout.id);
  }

  return result;
};

const seedScores = async (users: number[], layouts: number[]) => {
  const result = [];
  for (const score of scores) {
    const newScore = await prisma.score.create({
      data: {
        userId: users[score.user],
        levelId: layouts[score.level],
        value: score.score,
      },
    });
    result.push(newScore.id);
  }
  return result;
};

const seedDb = async () => {
  await clearDB();
  //await Promise.all([seedUsers(), seedLayouts(), seedScores()])
  const users = await seedUsers();
  const layouts = await seedLayouts();
  await seedScores(users, layouts);
};

seedDb()
  .then(() => {
    console.log("Database seeded");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
