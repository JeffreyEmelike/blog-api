# Blog API

A backend API for a simple blogging platform, built with **Node.js, Express, and MySQL**.

The project implements a layered backend architecture (`routes → controllers → services → models`), authentication with JWT, password hashing with bcrypt, schema validation, and authorization using resource ownership and roles.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication (`requireAuth`, `optionalAuth`)
- Role-based authorization (`user`, `admin`)
- **Posts:** Create, list, read, update, and delete
- Drafts are only visible to their authors
- Post owners or admins can update and delete posts
- **Comments:** Create, list, and delete
- Comments can only be created on public posts
- Comment owners or admins can delete comments
- Centralized error handling with consistent JSON error responses
- Request validation with Zod
- Security hardening with Helmet, CORS, and rate limiting
- Stricter rate limiting on login requests

## Tech Stack

| Category            | Technology                             |
| ------------------- | -------------------------------------- |
| Runtime             | Node.js (ES modules)                   |
| Framework           | Express 5                              |
| Database            | MySQL                                  |
| Database Driver     | `mysql2/promise`                       |
| Authentication      | `jsonwebtoken`                         |
| Password Hashing    | `bcrypt`                               |
| Validation          | `zod`                                  |
| Security Middleware | `helmet`, `cors`, `express-rate-limit` |

## Project Structure

```text
src/
├── config/
│   └── db.js                  # MySQL connection pool
├── routes/
│   ├── index.js               # Combines all resource routers
│   ├── auth.routes.js
│   ├── posts.routes.js
│   └── comments.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── posts.controller.js
│   └── comments.controller.js
├── services/
│   ├── auth.service.js
│   ├── posts.service.js
│   └── comments.service.js
├── models/
│   ├── users.model.js
│   ├── posts.model.js
│   └── comments.model.js
├── validation/
│   ├── auth.schema.js
│   ├── posts.schema.js
│   └── comments.schema.js
├── middleware/
│   ├── auth.js                # requireAuth, optionalAuth
│   ├── validate.js
│   └── errorHandler.js
└── utils/
    └── AppError.js

app.js                          # Builds the Express application
server.js                       # Starts the server
```

## Getting Started

### Prerequisites

Before running the project, ensure you have:

- [Node.js](https://nodejs.org/) 18 or later
- A running MySQL server
- Git
- A code editor, such as Visual Studio Code

### 1. Clone the Repository

```bash
git clone <https://github.com/JeffreyEmelike/blog-api>
cd blog-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create the Database and Tables

Connect to your MySQL server and execute the following SQL statements:

```sql
CREATE DATABASE blog_api;

USE blog_api;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    body VARCHAR(1000) NOT NULL,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
```

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and configure the variables with your own values.

```env
PORT=3000

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=blog_api

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

ALLOWED_ORIGIN=http://localhost:5173
```

**Important:** Use strong, unique secrets for JWT signing. Never commit your `.env` file or expose your database credentials and secrets in your repository.

### 5. Start the Development Server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## Environment Variables

| Variable             | Description                                         |
| -------------------- | --------------------------------------------------- |
| `PORT`               | Port the server listens on                          |
| `DB_HOST`            | MySQL server hostname                               |
| `DB_USER`            | MySQL username                                      |
| `DB_PASSWORD`        | MySQL password                                      |
| `DB_NAME`            | MySQL database name                                 |
| `JWT_SECRET`         | Secret used to sign access tokens                   |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens                  |
| `ALLOWED_ORIGIN`     | Origin allowed by CORS, typically your frontend URL |

## API Documentation

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint             | Authentication Required | Description                          |
| ------ | -------------------- | ----------------------- | ------------------------------------ |
| `POST` | `/api/auth/register` | No                      | Register a new account               |
| `POST` | `/api/auth/login`    | No                      | Log in and receive an access token   |
| `GET`  | `/api/auth/me`       | Yes                     | Get the currently authenticated user |

### Posts

| Method   | Endpoint         | Authentication Required | Description                                                             |
| -------- | ---------------- | ----------------------- | ----------------------------------------------------------------------- |
| `GET`    | `/api/posts`     | Optional                | Retrieve public posts and, when authenticated, the user's own drafts    |
| `GET`    | `/api/posts/:id` | Optional                | Retrieve a post; drafts return `404` unless the requester is the author |
| `POST`   | `/api/posts`     | Yes                     | Create a post, defaulting to `draft` status                             |
| `PATCH`  | `/api/posts/:id` | Yes                     | Update a post; restricted to its owner or an admin                      |
| `DELETE` | `/api/posts/:id` | Yes                     | Delete a post; restricted to its owner or an admin                      |

### Comments

| Method   | Endpoint                      | Authentication Required | Description                                           |
| -------- | ----------------------------- | ----------------------- | ----------------------------------------------------- |
| `GET`    | `/api/posts/:postId/comments` | No                      | Retrieve comments on a public post                    |
| `POST`   | `/api/posts/:postId/comments` | Yes                     | Create a comment on a public post                     |
| `DELETE` | `/api/comments/:id`           | Yes                     | Delete a comment; restricted to its owner or an admin |

### Error Responses

All error responses follow a consistent JSON structure:

```json
{
  "error": "Message describing what went wrong",
  "details": []
}
```

The `details` property is only included for validation errors.

This consistent format makes it easier for frontend applications and API clients to handle errors predictably.

## What This Project Demonstrates

### 1. Layered Architecture

The application separates responsibilities across routes, controllers, services, and models.

- **Routes:** Define endpoints and connect them to middleware and controllers.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain business logic and enforce application rules.
- **Models:** Handle database operations.

Business logic does not depend directly on Express's `req` and `res` objects, and database operations are isolated in the model layer.

### 2. Secure Database Operations

Parameterized SQL queries are used throughout the application to prevent user input from being interpreted as executable SQL.

### 3. Password Security

Passwords are hashed using bcrypt before storage. Plain-text passwords are never stored in the database or returned in API responses.

### 4. JWT Authentication

JSON Web Tokens provide stateless authentication through short-lived access tokens.

The authentication middleware distinguishes between protected routes and routes where authentication is optional.

### 5. Authorization and Access Control

Authentication determines who is logged in, while authorization determines what that user is permitted to do.

The application implements:

- Role-based permissions
- Resource ownership checks
- Admin overrides
- Draft visibility restrictions
- Resource-state checks for public posts and comments

### 6. Centralized Error Handling

A centralized error-handling mechanism provides consistent responses without exposing internal error details to API clients.

### 7. Request Validation

Zod schemas validate incoming request data before it reaches the business logic, helping ensure that requests conform to the expected structure and rules.

### 8. API Security

The application uses security middleware and rate limiting to reduce exposure to common web application threats and abusive request patterns.

## Future Improvements

Potential enhancements include:

- Pagination, filtering, and searching for posts
- Refresh-token rotation and revocation
- API documentation using Swagger/OpenAPI
- Automated unit and integration tests
- Database migrations and seed scripts
- Structured application logging
- Deployment with production environment configuration
- CI/CD integration
- Docker support

---

**Built with Node.js, Express, and MySQL.**
