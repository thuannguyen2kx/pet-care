import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";

import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import petRoutes from "./routes/pet.route";
import postRoutes from "./routes/post.route";

import "./config/passport.config";
import { passportAuthenticateJWT } from "./config/passport.config";
import commentRoutes from "./routes/comment.route";
import reactionRoutes from "./routes/reaction.route";
import serviceRoutes from "./routes/service.route";
import employeeRoutes from "./routes/employee.route";
import appointmentRoutes from "./routes/appointment.route";
import paymentRoutes from "./routes/payment.route";
// import webhookRoutes from "./routes/webhook.route";
import reportRoutes from "./routes/report.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

// app.use(`${BASE_PATH}/webhook`, webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/users`, passportAuthenticateJWT, userRoutes);
app.use(`${BASE_PATH}/pets`, passportAuthenticateJWT, petRoutes);
// app.use(`${BASE_PATH}`, passportAuthenticateJWT, commentRoutes);
// app.use(`${BASE_PATH}/posts`, passportAuthenticateJWT, postRoutes);
// app.use(`${BASE_PATH}/reactions`, passportAuthenticateJWT, reactionRoutes);
app.use(`${BASE_PATH}/services`, serviceRoutes);
app.use(`${BASE_PATH}/employees`, passportAuthenticateJWT, employeeRoutes);
// app.use(
//   `${BASE_PATH}/appointments`,
//   passportAuthenticateJWT,
//   appointmentRoutes
// );
// app.use(`${BASE_PATH}/payments`, passportAuthenticateJWT, paymentRoutes);
// app.use(`${BASE_PATH}/reports`, passportAuthenticateJWT, reportRoutes);
app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
