import { Application, Request, Response } from "express";
import cors from "cors";
const express = require("express");
const app: Application = express();

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  res.send({
    status: true,
    message: `tour management system is on`,
  });
});

export default app;
