import express from "express";
import * as bodyParser from "body-parser";
import compression from "compression";
import morgan from "morgan";
import routes from "./routes";
import cors from "cors";
import config from "../../config";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

/** Set logger request */
app.use(morgan("dev"));

/** Set cors */
app.use(cors());

/** Set helmet */
app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  })
);

/** Bodyparser */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Compression middleware */
app.use(compression());

/** Set rate limit */
if (config.isProduction) {
  app.use(
    rateLimit({
      windowMs: config.rateLimit.minute * 60 * 1000,
      max: config.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}

/** Set all routes */
app.use("/api", routes);

/** Runing app */
app.listen(config.APP_PORT, () => {
  console.log(`Listening on PORT: ${config.APP_PORT}`);
});

export default app;
