# Shop Management API

A robust backend system for managing shop operations, freelancers, and work requests. Built with Node.js, Express, and TypeORM.

## 🚀 Teck Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer
- **Containerization:** Docker & Docker Compose

## ✨ Features

- **Authentication System:**
  - Freelancer registration
  - Email verification (via Nodemailer)
  - Secure login with JWT
- **Work Management:**
  - Freelancers can send work requests
- **Security:**
  - Role-based access control (RBAC)
  - Password hashing with Bcrypt
  - Environment variable configuration

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd bai6
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the `.env.example` file to `.env` and fill in your credentials.
```bash
cp .env.example .env
```

### 4. Database Setup
Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```

### 5. Run the Application
Start the development server with hot-reload:
```bash
npm run dev
```

The server will be running at `http://localhost:3000`.

## 📂 Project Structure

```text
src/
├── controllers/    # Request handlers
├── entities/       # TypeORM database models
├── middlewares/    # Custom Express middlewares (Auth, Logging, etc.)
├── routes/         # API route definitions
├── services/       # Business logic layer
├── data-source.ts  # Database connection configuration
└── app.ts          # Application entry point
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register/freelancer` | Register a new freelancer | Public |
| GET | `/auth/verify-email` | Verify freelancer email | Public |
| POST | `/auth/login` | User login | Public |

### Work Requests
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/freelancer/work-requests` | Send a work request | Freelancer |

## 📜 License
ISC
