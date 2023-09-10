import express from "express";
import cors from "cors";
import { User } from "@prisma/client";
import { userRouter } from "./routers/user";
import { authRouter } from "./routers/auth";
import { layoutRouter } from "./routers/layout";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }

  namespace NodeJS {
    export interface ProcessEnv {
      DATABASE_URL: string;
      JWT_KEY: string;
    }
  }
}

for (const key of ["DATABASE_URL", "JWT_KEY"]) {
  if (process.env[key] === undefined) {
    throw new Error(`Missing environment key variable ${key}`);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/layout", layoutRouter);

app.listen(3000);
