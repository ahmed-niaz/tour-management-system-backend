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
  SUPER_ADMIN_PASSWORD: z.string(),
  JWT_REFRESH_EXPIRES: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),
  EXPRESS_SESSION_SECRET: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  // todo: SSL related env variables
  SSL_STORE_ID: z.string().optional(),
  SSL_STORE_PASS: z.string().optional(),
  SSL_PAYMENT_API: z.string().optional(),
  SSL_VALIDATION_API: z.string().optional(),
  SSL_SUCCESS_BACKEND_URL: z.string().optional(),
  SSL_FAIL_BACKEND_URL: z.string().optional(),
  SSL_CANCEL_BACKEND_URL: z.string().optional(),
  SSL_SUCCESS_FRONTEND_URL: z.string().optional(),
  SSL_FAIL_FRONTEND_URL: z.string().optional(),
  SSL_CANCEL_FRONTEND_URL: z.string().optional(),
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
  super_admin_password: parsedEnv.data.SUPER_ADMIN_PASSWORD,
  jwt_refresh_secret: parsedEnv.data.JWT_REFRESH_SECRET,
  jwt_refresh_expiresIn: parsedEnv.data.JWT_REFRESH_EXPIRES,
  google_client_id: parsedEnv.data.GOOGLE_CLIENT_ID,
  google_client_secret: parsedEnv.data.GOOGLE_CLIENT_SECRET,
  google_callback_url:
    parsedEnv.data.GOOGLE_CALLBACK_URL || process.env.GOOLGE_CALLBACK_URL,
  express_session_secret: parsedEnv.data.EXPRESS_SESSION_SECRET,
  frontend_url: parsedEnv.data.FRONTEND_URL,
  ssl_store_id: parsedEnv.data.SSL_STORE_ID,
  ssl_store_pass: parsedEnv.data.SSL_STORE_PASS,
  ssl_payment_api: parsedEnv.data.SSL_PAYMENT_API,
  ssl_validation_api: parsedEnv.data.SSL_VALIDATION_API,
  ssl_success_backend_url: parsedEnv.data.SSL_SUCCESS_BACKEND_URL,
  ssl_fail_backend_url: parsedEnv.data.SSL_FAIL_BACKEND_URL,
  ssl_cancel_backend_url: parsedEnv.data.SSL_CANCEL_BACKEND_URL,
  ssl_success_frontend_url: parsedEnv.data.SSL_SUCCESS_FRONTEND_URL,
  ssl_fail_frontend_url: parsedEnv.data.SSL_FAIL_FRONTEND_URL,
  ssl_cancel_frontend_url: parsedEnv.data.SSL_CANCEL_FRONTEND_URL,
} as const;
