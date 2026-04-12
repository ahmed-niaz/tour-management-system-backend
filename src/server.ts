/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import { env } from "./app/config";
import { seedSuperAdmin } from "./app/utils/seed.super.admin";

import dns from 'dns'
import { getRedisClient } from "./app/config/redis.config";

// Vercel uses internal AWS DNS. Only override locally.
if (!process.env.VERCEL) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

let server: Server | null = null;

let isConnected = false;

async function bootstrap() {
  if (isConnected) return;
  const mongoose = (await import("mongoose")).default;
  if (!process.env.VERCEL) {
    console.log("Using DNS servers:", dns.getServers());
  }
  
  await mongoose.connect(env.database_url as string, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  });
  
  await getRedisClient();
  await seedSuperAdmin();
  isConnected = true;
}

// 1. LOCAL DEVELOPMENT: Start the actual express server that listens on a port
if (!process.env.VERCEL) {
  (async () => {
    try {
      await bootstrap();
      server = app.listen(env.port, () => {
        console.log(`app listening on port ${env.port}`);
      });
    } catch (e) {
      console.error("Startup failed:", e);
      process.exit(1);
    }
  })();
}

// 2. VERCEL DEPLOYMENT: Export a serverless function handler instead
export default async function handler(req: any, res: any) {
  try {
    await bootstrap();
    return app(req, res);
  } catch (error) {
    console.error("Startup error in Vercel:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

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