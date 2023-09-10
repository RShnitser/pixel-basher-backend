import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";
//import { ParamsDictionary } from "express-serve-static-core";
import { prisma } from "./client";

export const encryptPassword = (password: string) => {
  const saltRounds = 11;
  return bcrypt.hash(password, saltRounds);
};

export const createToken = (user: User) => {
  const userInfo = {
    userName: user.userName,
  };

  return jwt.sign(userInfo, process.env.JWT_KEY);
};

const jwtInfoSchema = z.object({
  userName: z.string(),
  iat: z.number(),
});

export const getDataFromToken = (token: string) => {
  // if (!token) {
  //   return null;
  // }

  try {
    return jwtInfoSchema.parse(jwt.verify(token, process.env.JWT_KEY));
  } catch (e) {
    console.error(e);
    return null;
  }
};

// export const validateBody = <T>(
//   data: ZodSchema<T>
// ): RequestHandler<ParamsDictionary, any, T, any> => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const result = data.safeParse(req.body);
//     if (!result.success) {
//       return res.status(401).json(result.error);
//     }
//     //req.body = result.data;
//     return next();
//   };
// };

// export const validateParams = <T>(
//   data: ZodSchema<T>
// ): RequestHandler<T, any, any, any> => {

//   return (req: Request, res: Response, next: NextFunction) => {
//     const result = data.safeParse(req.params);
//     if (!result.success) {
//       return res.status(401).json(result.error);
//     }
//     //req.params = result.data;
//     return next();
//   };
// };

export const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [, token] = req.headers.authorization?.split(" ") || ["", ""];
  const jwtData = getDataFromToken(token);
  if (!jwtData) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  const userFromJwt = await prisma.user.findUnique({
    where: {
      userName: jwtData.userName,
    },
  });

  if (!userFromJwt) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = userFromJwt;
  next();
};
