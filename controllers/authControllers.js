//import { prisma } from "../lib/prisma.config";

import { prisma } from "../lib/prisma.config.js";
import bcrypt from "bcryptjs";

async function authHome(req, res) {
    res.send("Sign up back end Home Page")
}

async function signUp(req, res) {
  try {
    console.log("backend data received", req.body);

    const { user, password } = req.body;

    // 🔥 HASH PASSWORD HERE
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: user,
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      success: true,
      message: "data received",
      user: newUser,
    });

  } catch (error) {
    console.error("signup error", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export { authHome, signUp}