import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URI: z.string(),
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
  SSL_IPN_URL: z.string().optional(),
  // todo: cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_HOST: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().optional(),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional()
});

const parsedEnv = envSchema.safeParse(process.env);
let envData: any = {};

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables during boot:", parsedEnv.error.format());
  // Do NOT throw error here immediately. Let the app boot, and catch the undefined errors in the async handler.
  envData = process.env; // fallback to raw env to prevent complete object schema failure
} else {
  envData = parsedEnv.data;
}

export const env = {
  port: Number(envData.PORT || 5000),
  nodeEnv: envData.NODE_ENV || "development",
  database_url: envData.DATABASE_URI || "",
  bcrypt_salt_rounds: envData.BCRYPT_SALT_ROUNDS || "10",
  jwt_access_secret: envData.JWT_ACCESS_SECRET || "fallback_secret",
  jwt_access_expiresIn: envData.JWT_ACCESS_EXPIRES || "1d",
  super_admin_email: envData.SUPER_ADMIN_EMAIL || "",
  super_admin_password: envData.SUPER_ADMIN_PASSWORD || "",
  jwt_refresh_secret: envData.JWT_REFRESH_SECRET || "fallback_secret",
  jwt_refresh_expiresIn: envData.JWT_REFRESH_EXPIRES || "365d",
  google_client_id: envData.GOOGLE_CLIENT_ID,
  google_client_secret: envData.GOOGLE_CLIENT_SECRET,
  google_callback_url:
    envData.GOOGLE_CALLBACK_URL || process.env.GOOLGE_CALLBACK_URL,
  express_session_secret: envData.EXPRESS_SESSION_SECRET || "fallback_secret",
  frontend_url: envData.FRONTEND_URL,
  ssl_store_id: envData.SSL_STORE_ID,
  ssl_store_pass: envData.SSL_STORE_PASS,
  ssl_payment_api: envData.SSL_PAYMENT_API,
  ssl_validation_api: envData.SSL_VALIDATION_API,
  ssl_success_backend_url: envData.SSL_SUCCESS_BACKEND_URL,
  ssl_fail_backend_url: envData.SSL_FAIL_BACKEND_URL,
  ssl_cancel_backend_url: envData.SSL_CANCEL_BACKEND_URL,
  ssl_success_frontend_url: envData.SSL_SUCCESS_FRONTEND_URL,
  ssl_fail_frontend_url: envData.SSL_FAIL_FRONTEND_URL,
  ssl_cancel_frontend_url: envData.SSL_CANCEL_FRONTEND_URL,
  ssl_ipn_url: envData.SSL_IPN_URL,
  cloudinary_cloud_name: envData.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: envData.CLOUDINARY_API_KEY,
  cloudinary_api_secret: envData.CLOUDINARY_API_SECRET,
  smtp_host: envData.SMTP_HOST,
  smtp_port: envData.SMTP_PORT,
  smtp_from: envData.SMTP_FROM,
  smtp_user: envData.SMTP_USER,
  smtp_pass: envData.SMTP_PASS,
  redis_host: envData.REDIS_HOST,
  redis_port: envData.REDIS_PORT,
  redis_username: envData.REDIS_USERNAME,
  redis_password: envData.REDIS_PASSWORD
} as const;
