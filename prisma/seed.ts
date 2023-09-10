import { prisma } from "../src/client";
import { encryptPassword } from "../src/utils";

const clearDB = async () => {
  await prisma.user.deleteMany();
  await prisma.level.deleteMany();
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
};

const seedLayouts = async () => {
  const result = [];
  for (const layout of layouts) {
    const newLayout = await prisma.level.create({
      data: {
        width: 0,
        height: 0,
        layout: Buffer.from(layout.data),
      },
    });
    result.push(newLayout.id);
  }

  return result;
};

const seedDb = async () => {
  await clearDB();
  await seedUsers();
  await seedLayouts();
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
