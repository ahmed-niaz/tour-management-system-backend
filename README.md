# 🌍 Tour Management System Backend

A robust, scalable RESTful API backend for a Tour Management System. Built with modern web technologies, this system handles everything from user authentication to tour bookings, payment processing, and dynamic content management.

## 🚀 Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication:** JWT (JSON Web Tokens) & [Passport.js](https://www.passportjs.org/) (Local & Google OAuth 2.0)
- **Validation:** [Zod](https://zod.dev/)
- **File Uploads:** [Multer](https://github.com/expressjs/multer) & [Cloudinary](https://cloudinary.com/)
- **Payment Gateway:** [SSLCommerz](https://sslcommerz.com/)

## 📂 Project Structure

This project follows a highly modular, domain-driven directory structure to ensure maintainability and separation of concerns (`src/app/modules`):

```
src/
├── app/
│   ├── config/        # Environment variables & third-party configs
│   ├── errors/        # Custom error classes (ApiError, etc.)
│   ├── helpers/       # Helper functions
│   ├── interface/     # Global TypeScript interfaces
│   ├── middlewares/   # Express middlewares (Auth, Validation, Global Error Handling)
│   ├── modules/       # Domain modules
│   │   ├── auth/      # Authentication (Signup, Login, Refresh Token)
│   │   ├── booking/   # Tour bookings management
│   │   ├── division/  # Divisions/Locations management
│   │   ├── payment/   # Payment processing & webhooks
│   │   ├── sslc/      # SSLCommerz specific logic
│   │   ├── tour/      # Tour packages & details
│   │   └── user/      # User profile & roles management
│   ├── route/         # Centralized API router
│   └── utils/         # Utility functions & formatters
├── app.ts             # Express app setup & middleware wiring
└── server.ts          # Server entry point & DB connection
```

## ✨ Key Features

1. **Secure Authentication & Authorization**
   - Local signup/login with encrypted passwords using `bcrypt`.
   - Social login integration via Google OAuth 2.0.
   - Access & refresh token mechanism using JWT.
   - Role-based Access Control (RBAC).

2. **Tour & Division Management**
   - Full CRUD operations for Tours and Divisions.
   - Integrated image uploads to Cloudinary with `multer-storage-cloudinary`.

3. **Booking & Payment Processing**
   - Seamless tour booking workflows.
   - Live payment integration with SSLCommerz APIs.
   - Payment status webhooks (Success, Fail, Cancel).

4. **Robust Error Handling & Validation**
   - Centralized, global error handler ensuring standardized API responses.
   - Granular unhandled rejection & uncaught exception interceptors.
   - Request DTO mapping and validation using strict Zod schemas.

## ⚙️ Environment Variables

To run this project locally, create a `.env` file in the root directory and configure the following variables (see `.env.example` for reference):

```properties
PORT=5000
NODE_ENV=development
DATABASE_URI=your_mongodb_connection_string

# JWT Configuration
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES=1h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=365d

# Super Admin Config
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=securepassword

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/v1/auth/google/callback

# Session & Frontend Links
EXPRESS_SESSION_SECRET=your_session_secret
FRONTEND_URL=https://your-frontend-domain.com

# SSLCommerz Payment Gateway
SSL_STORE_ID=your_store_id
SSL_STORE_PASS=your_store_password
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
SSL_SUCCESS_BACKEND_URL=https://your-backend-domain.com/api/v1/payment/success
SSL_FAIL_BACKEND_URL=https://your-backend-domain.com/api/v1/payment/fail
SSL_CANCEL_BACKEND_URL=https://your-backend-domain.com/api/v1/payment/cancel

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🛠️ Scripts & Build

- `npm run dev` - Start the development server with hot-reload (`ts-node-dev`).
- `npm run build` - Compile TypeScript to standard JavaScript into the `dist` folder.
- `npm run start` - Run the compiled production app from `dist/server.js`.
- `npm run lint` - Run ESLint to detect format and code style issues.

## 📡 API Overview

The root URL for all API modules is `/api/v1/`.

| Base Route    | Description |
|---------------|-------------|
| **`/auth`**   | Authentication endpoints (login, register, OAuth logic) |
| **`/user`**   | User management and profile operations |
| **`/tour`**   | Tour discovery, packages, and detailed views |
| **`/division`**| Geographical location management for tours |
| **`/booking`**| Ticket placements and user tour bookings |
| **`/payment`**| Initializing payments and callback webhooks handling |