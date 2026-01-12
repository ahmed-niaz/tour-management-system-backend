import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URI: z.string().url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = {
  port: Number(parsedEnv.data.PORT),
  nodeEnv: parsedEnv.data.NODE_ENV,
  database_url: parsedEnv.data.DATABASE_URI,
} as const;
