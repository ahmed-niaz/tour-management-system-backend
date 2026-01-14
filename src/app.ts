import { Application, Request, Response } from "express";
import express from 'express'
const app: Application = express();
import cors from "cors";
import router from "./app/route";
import { globalErrorHandler } from "./app/middlewares/global.error.handler";
import { notFound } from "./app/middlewares/not.found";

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Debug middleware - routes
app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`${req.method} ${req.url}`);
  next();
});

// application routes
app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.send({
    status: true,
    message: `tour management system is on`,
  });
});

// todo: global error handler
app.use(globalErrorHandler);

// todo: not Found error handler
app.use(notFound);

export default app;
