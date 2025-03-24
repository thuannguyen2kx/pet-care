import "dotenv/config";
import express, {NextFunction, Request, Response} from "express"
import cors from "cors"

import { config } from "./config/app.config"
import { errorHandler } from "./middlewares/errorHandler.middleware"
import connectDatabase from "./config/database.config";
import authRouter from "./routes/auth.route";

const app = express()
const BASE_PATH = config.BASE_PATH

app.use(express.json())
app.use(express.urlencoded({extended: true}))
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
app.use(`${BASE_PATH}/auth`, authRouter)

app.use(errorHandler)


app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`)
  await connectDatabase()
})