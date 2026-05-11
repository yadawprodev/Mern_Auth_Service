# MERN Auth Service

A production-ready authentication backend built with the MERN stack ecosystem.
This service provides secure user authentication, email verification, password reset functionality, JWT authentication, and protected routes.

---

# Features

* User Registration
* User Login & Logout
* JWT Authentication
* Email Verification with OTP
* Password Reset with OTP
* Production-ready Cookie Configuration
* Brevo Email Integration
* MongoDB Database Integration

---

# Tech Stack

* Node.js
* Express.js
* Mongoose
* JWT
* Brevo API
* Cookie-parser
* Winston Logger

---

# Environment Variables

Create a `.env` file in the server directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

NODE_ENV=production

BREVO_API_KEY=your_brevo_api_key

SENDER_EMAIL=your_sender_email

FRONTEND_URL=http://localhost:5173
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/yadawprodev/Mern_Auth_Service.git
```

Move into the project directory:

```bash
cd mern-auth-service
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

# Production Deployment

## Backend Deployment

The backend is deployed on Render.

### Deployment Steps

1. Push project to GitHub
2. Connect repository to Render
3. Add environment variables
4. Deploy service

---

## Frontend Deployment

Frontend can be deployed on Vercel.

Add the following environment variable in your client directory:

```env
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

---

# Authentication Flow

## Registration

1. User registers
2. JWT token generated
3. Token stored in secure HTTP-only cookie
4. Welcome email sent

---

## Login

1. User logs in
2. Credentials validated
3. JWT token generated
4. Token stored in secure cookie

---

## Email Verification

1. OTP generated
2. OTP hashed before storage
3. OTP sent via email
4. User verifies account using OTP

---

## Password Reset

1. Reset OTP generated
2. OTP emailed to user
3. User submits OTP and new password
4. Password updated securely

---

# Live Demo

Frontend Application: https://mern-auth-service.vercel.app

Backend API: https://mern-auth-service-95rc.onrender.com

---

# Author

Built by Yadiel Tesfaye

