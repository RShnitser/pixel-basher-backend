import { Router } from "express";
import { prisma } from "../client";
import bcrypt from "bcrypt";
import { createToken } from "../utils";
import { z } from "zod";
import { validateRequestBody } from "zod-express-middleware";

const authRouter = Router();

authRouter.post(
  "/login",
  validateRequestBody(
    z.object({
      userName: z.string(),
      password: z.string(),
    })
  ),
  async (req, res) => {
    const body = req.body;

    const user = await prisma.user.findUnique({
      where: {
        userName: body.userName,
      },
    });

    if (!user) {
      return res.status(401).send({ message: "Invalid user or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).send({ message: "Invalid user or password" });
    }

    const token = createToken(user);

    return res.status(200).send({
      //userInfo: {
      userName: user.userName,
      //},
      token: token,
    });
  }
);

export { authRouter };
