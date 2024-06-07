import dotenv from "dotenv";
import express, { Express } from "express";
import morgan from "morgan";
import morganBody from "morgan-body";
import logger from "./utils/loggerUtils";
import routes from "./routes";
import connectToDB from "./configs/db";
import errorMiddleware from "./middlewares/errorMiddleware";
import contextMiddleware from "./middlewares/contextMiddleware";
import accessMiddleware from "./middlewares/accessMiddleware";

// load configurations
dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);

// init service
const app: Express = express();
const port = process.env.PORT || 3000;
const node_env = process.env.NODE_ENV || process.env.NODE_ENV_PROD;

// configure middleware
app.use(express.json()); // this will parse your data as JSON format
app.use(express.urlencoded({ extended: true }));
app.use(contextMiddleware);
app.use(accessMiddleware);
if (node_env !== "prod") {
  morganBody(app); // NOTE: this morgan body middleware should be called before register routes
  app.use(morgan("dev"));
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );
}

// configure routes
app.use("/api/v2", routes);

// configure error handling, this must be configured at the end after the routes
app.use(errorMiddleware);

// run service
app.listen(port, () => {
  logger.info(`Server is running at port:${port}`);
  connectToDB();
});
