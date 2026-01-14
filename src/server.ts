/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import { env } from "./app/config";


let server: Server | null = null;

async function bootstrap() {
  try {
    // console.log(envVars.node_env);
    await mongoose.connect(env.database_url as string);
    server = app.listen(env.port, () => {
      console.log(`app listening on port ${env.port}`);
    });
  } catch (e) {
    console.error("Failed to connect ", e);
  }
}

bootstrap();

// todo: Handle unhandled promise rejections [ which is connected with promise]
process.on("unhandledRejection", (reason: string | Error, promise: Promise<unknown>) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error("reason : ", reason);
  console.error("Promise:", promise);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// Promise.reject(new Error("reject error"));

// todo: local server problem [Handle uncaught exceptions]
process.on("uncaughtException", (e: Error) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
  console.error("Error name:", e.name);
  console.error("Error message:", e.message);
  console.error("Stack trace:", e.stack);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// throw new Error('I forget to handle local error');

// todo: Handle SIGTERM signal
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// todo: Handle SIGINT signal (Ctrl+C)
process.on("SIGINT", () => {
  console.log("👋 SIGINT RECEIVED. Shutting down gracefully...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

//
/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 * */
