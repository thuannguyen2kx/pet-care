import "dotenv/config";
import express, {NextFunction, Request, Response} from "express"
import cors from "cors"
import passport from "passport";

import { config } from "./config/app.config"
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware"
import authRoutes from "./routes/auth.route";

import "./config/passport.config";

const app = express()
const BASE_PATH = config.BASE_PATH

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(passport.initialize())
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Wellcome to PetCare"
  })
})
app.use(`${BASE_PATH}/auth`, authRoutes)

app.use(errorHandler)


app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`)
  await connectDatabase()
})