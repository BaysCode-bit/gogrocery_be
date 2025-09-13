import { prisma } from "../src/lib/prisma.js";
import * as bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("SuperAdminPassword123!", 10);

  await prisma.user.deleteMany({ where: { role: "SUPER_ADMIN" } });

  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@grocery.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });

  console.log({ superAdmin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
