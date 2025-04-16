import bodyParser from "body-parser";

export const rawBodyMiddleware = bodyParser.raw({ type: 'application/json' });