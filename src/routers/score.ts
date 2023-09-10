import { Router } from "express";
import { prisma } from "../client";
import { authMiddleWare } from "../utils";
import { z } from "zod";
import { validateRequestBody } from "zod-express-middleware";
//import { validateParams } from "../utils";

const scoreRouter = Router();

scoreRouter.post(
  "/get",
  //function(req, res, next) {next()},
  //validateParams(z.object({ level: z.number() })),
  //validateParams(z.object({ level: z.number() }),
  authMiddleWare,
  validateRequestBody(z.object({ levelId: z.number() })),

  async (req, res) => {
    const scores = await prisma.score.findMany({
      where: {
        levelId: req.body.levelId,
      },
      orderBy: {
        value: "asc",
      },
      select: {
        user: {
          select: {
            userName: true,
          },
        },
        value: true,
      },
      take: 10,
    });

    res.status(200).send(
      scores.map((score) => ({
        name: score.user.userName,
        score: score.value,
      }))
    );
  }
);

scoreRouter.post(
  "/add",
  authMiddleWare,
  validateRequestBody(
    z.object({
      levelId: z.number(),
      score: z.number(),
    })
  ),
  async (req, res) => {
    if (req.user === undefined) {
      return res.status(401).json({ message: "User not found" });
    }

    try {
      const layouts = await prisma.score.create({
        data: {
          userId: req.user.id,
          levelId: req.body.levelId,
          value: req.body.score,
        },
      });

      res.status(200).send(layouts);
    } catch {
      return res.status(500).send({ message: "Invalid data" });
    }
  }
);

export { scoreRouter };
