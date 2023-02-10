import { urlencoded, json } from "body-parser";
import express from "express";
import routes from "../drivers/webservice/routes";

async function beforeAction() {
  const app = express();
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use("/api", routes);
  return app;
}

export { beforeAction };
