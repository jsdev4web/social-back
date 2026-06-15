import { prisma } from "./lib/prisma.config.js";

// i need to make a fake user to test here

const user = await prisma.user.create({
    data: {
      name: "Alice",
      password: "alice@prisma.io",
    },
  });
  console.log("Created user:", user);


  const allUsers = await prisma.user.findMany();
  console.log("All users:", JSON.stringify(allUsers, null, 2));