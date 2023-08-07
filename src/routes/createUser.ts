import { Action, io } from "@interval/sdk";
import prisma from "../utils/db";

export default new Action({
  name: "Create User",
  description: "Create a new user",
  handler: async () => {
    const { name, email } = await io.group({
      name: io.input.text("Name"),
      email: io.input.email("Email").validate(async (email) => {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser) {
          return "This email is already in use.";
        }
      }),
    });

    await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    await io.display.markdown("User created successfully");
  },
});
