import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URI: z.string().url(),
  BCRYPT_SALT_ROUNDS: z.string(),
  JWT_ACCESS_EXPIRES: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  SUPER_ADMIN_EMAIL: z.string(),
  SUPER_ADMIN_PASSWORD: z.string()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = {
  port: Number(parsedEnv.data.PORT),
  nodeEnv: parsedEnv.data.NODE_ENV,
  database_url: parsedEnv.data.DATABASE_URI,
  bcrypt_salt_rounds: parsedEnv.data.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: parsedEnv.data.JWT_ACCESS_SECRET,
  jwt_access_expiresIn: parsedEnv.data.JWT_ACCESS_EXPIRES,
  super_admin_email: parsedEnv.data.SUPER_ADMIN_EMAIL,
  super_admin_password: parsedEnv.data.SUPER_ADMIN_PASSWORD
} as const;
