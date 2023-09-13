import { Router } from "express";
import { prisma } from "../client";
import { authMiddleWare } from "../utils";

const layoutRouter = Router();

layoutRouter.get("/", authMiddleWare, async (req, res) => {
  const layouts = await prisma.level.findMany({
    // select: {
    //   layout: true,
    // },
  });

  res.status(200).send(layouts);
});

export { layoutRouter };
