import { PrismaClient } from "../src/generated/prisma/client";
import { SYSTEM_SENDER_ID } from "../src/utils/strings";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
const connectionString = `${process.env.POSTGRES_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Users
  await prisma.users.upsert({
    where: {
      id: SYSTEM_SENDER_ID,
    },
    update: {},
    create: {
      id: SYSTEM_SENDER_ID,
      username: "System",
      email: "system@collabboard.local",
      password: "", // not used
      profilepic: null,
    },
  });
  console.log("✓ System user seeded");
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
