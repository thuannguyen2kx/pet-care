import { Router } from "express";

const webhookRoutes = Router();
import { stripeWebhook } from "../controllers/payment.controller";
import { rawBodyMiddleware } from "../middlewares/rawBody.middleware";

webhookRoutes.post("/stripe", rawBodyMiddleware, stripeWebhook);

export default webhookRoutes;
