import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Users
  await prisma.user.createMany({
    data: [
      {
        id: "c5751883-0106-4a58-864d-9fd4080ffecd",
        email: "12@gmail.com",
        username: "Anthony Okolie",
        password:
          "$2b$10$9j/P2lHFFFKh4enr8.MNnuV7o.GPZ2yFKUMfezI8cqRquk7e8GKiy",
        profilePic:
          "https://res.cloudinary.com/dz8dqpkso/image/upload/v1772881831/xschqnhiignettckc86k.jpg",
      },
      {
        id: "a7d32071-974f-4ea1-b44a-1b385d46f08d",
        email: "11@gmail.com",
        username: "Anthony Okolie",
        password:
          "$2b$10$M.2vNZHFhoM3gV9PITSgye7oqxterzaOt0UuHrt/KwoAlLTYr0Er6",
        profilePic:
          "https://res.cloudinary.com/dz8dqpkso/image/upload/v1773532251/hdo1jgch4jd8h5jav5tn.png",
      },
    ],
    skipDuplicates: true,
  });

  // Boards
  await prisma.board.createMany({
    data: [
      {
        id: "e2924db1-1c01-4c5d-a97b-6aaf812b5259",
        title: "test board $",
        ownerId: "c5751883-0106-4a58-864d-9fd4080ffecd",
        userId: "c5751883-0106-4a58-864d-9fd4080ffecd",
        progress: 100,
      },
    ],
    skipDuplicates: true,
  });

  // Columns
  await prisma.column.createMany({
    data: [
      {
        id: "780d135d-ccb6-40b6-9202-4c34673c38d2",
        boardId: "e2924db1-1c01-4c5d-a97b-6aaf812b5259",
        title: "To Do",
      },
    ],
    skipDuplicates: true,
  });

  // Cards
  await prisma.card.createMany({
    data: [
      {
        id: "c51cb4ba-69f3-440c-829c-745e10104d1e",
        columnId: "e3e061b6-85f3-4468-becb-6b6efb0084fb",
        title: "bygones",
        content: "let bygones be bygones",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
