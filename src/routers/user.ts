import { Router } from "express";
import { prisma } from "../client";
import { Prisma } from "@prisma/client";
import { encryptPassword, createToken } from "../utils";
import { z } from "zod";
import { validateRequestBody } from "zod-express-middleware";

const userRouter = Router();

userRouter.post(
  "/",
  validateRequestBody(
    z.object({
      userName: z.string(),
      password: z.string(),
    })
  ),
  async (req, res) => {
    const body = req.body;

    try {
      const user = await prisma.user.create({
        data: {
          userName: body.userName,
          password: await encryptPassword(body.password),
        },
      });

      const token = createToken(user);
      return res.status(200).send({
        userName: user.userName,
        token: token,
      });
    } catch (error) {
      console.error(error);
      let message = "Could not create user";
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          message = `User with name ${body.userName} already exists`;
        }
      }
      return res.status(500).send({ message: message });
    }
  }
);

export { userRouter };
