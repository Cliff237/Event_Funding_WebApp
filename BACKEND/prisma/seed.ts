// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("superAdmin237", 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: "superAdmin@gmail.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superAdmin@gmail.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Super Admin seeded:", superAdmin);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
