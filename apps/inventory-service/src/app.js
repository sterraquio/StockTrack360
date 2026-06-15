import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { internalRoutes } from "./routes/internal.routes.js";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.use("/internal", internalRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
