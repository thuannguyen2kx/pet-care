import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";

import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import petRoutes from "./routes/pet.route"
import postRoutes from "./routes/post.route"

import "./config/passport.config";
import { passportAuthenticateJWT } from "./config/passport.config";
import { authorizeRoles } from "./middlewares/auth.middleware";
import { Roles } from "./enums/role.enum";
import commentRoutes from "./routes/comment.route";
import reactionRoutes from "./routes/reaction.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Wellcome to PetCare",
  });
});
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJWT, userRoutes);
app.use(`${BASE_PATH}/pets`, passportAuthenticateJWT, petRoutes);
app.use(`${BASE_PATH}`, passportAuthenticateJWT, commentRoutes);
app.use(`${BASE_PATH}/posts`, passportAuthenticateJWT, postRoutes);
app.use(`${BASE_PATH}`, passportAuthenticateJWT, reactionRoutes);
app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
