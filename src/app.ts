import { Application, Request, Response } from "express";
import express from "express";
const app: Application = express();
import cors from "cors";
import router from "./app/route";
import "./app/config/passport";
import { env } from "./app/config";
import { globalErrorHandler } from "./app/middlewares/global.error.handler";
import { notFound } from "./app/middlewares/not.found";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";

// parsers
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: env.frontend_url,
  credentials: true
}));
app.use(
  expressSession({
    secret: env.express_session_secret || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: env.nodeEnv === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

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
