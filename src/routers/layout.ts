import { Router } from "express";
import { prisma } from "../client";

const layoutRouter = Router();

layoutRouter.get("/", async (req, res) => {
  const layouts = await prisma.level.findMany({
    // select: {
    //   layout: true,
    // },
  });

  res.status(200).send(layouts);
});

export { layoutRouter };
