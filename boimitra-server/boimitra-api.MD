# বইমিত্র — Boimitra Backend

> Physical Book Reading Community & Journey Tracker for Bangladeshi Book readers

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Scripts](#scripts)

---

## Overview

Boimitra is a book reading community platform for Book reader community in Bangladesh. This repository contains the Express.js REST API backend.

The backend handles:
- User authentication (register, login, JWT)
- Book listing and management
- Book request and waitlist system
- Reader journey tracking (who read the book, where, and what they thought)

---

## Tech Stack

| Layer       | Technology         |
|-------------|--------------------|
| Runtime     | Node.js            |
| Framework   | Express.js         |
| Database    | MongoDB (Mongoose) Atlas |
| Auth        | JWT + bcrypt       |
| Environment | dotenv             |

---

## Folder Structure

```
boimitra-backend/
├── src/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Book.js              # Book schema (includes journey + waitlist)
│   ├── routes/
│   │   ├── auth.routes.js       # /api/auth
│   │   ├── book.routes.js       # /api/books
│   │   └── user.routes.js       # /api/users
│   ├── controllers/
│   │   ├── auth.controller.js   # register, login
│   │   ├── book.controller.js   # CRUD, request, journey
│   │   └── user.controller.js   # profile, my books, my requests
│   ├── middleware/
│   │   └── auth.middleware.js   # JWT verification
│   └── app.js                   # Express app setup
├── .env                         # Environment variables (never commit)
├── .gitignore
├── package.json
└── server.js                    # Entry point
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/boimitra.git
cd boimitra/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your values (see [Environment Variables](#environment-variables) below).

### 4. Run the development server

```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the root of the backend folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/boimitra
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

> Never commit your `.env` file. It is already listed in `.gitignore`.

---

## API Reference

### Auth

| Method | Endpoint             | Description        | Auth Required |
|--------|----------------------|--------------------|---------------|
| POST   | /api/auth/register   | Create new account | No            |
| POST   | /api/auth/login      | Login, get token   | No            |

**Register — Request Body**
```json
{
  "name": "Rahim Ahmed",
  "email": "rahim@gmail.com",
  "password": "password123",
  "university": "BUET",
  "city": "Dhaka"
}
```

**Login — Request Body**
```json
{
  "email": "rahim@gmail.com",
  "password": "password123"
}
```

**Login — Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Rahim Ahmed",
    "university": "BUET"
  }
}
```

---

### Books

| Method | Endpoint                        | Description                    | Auth Required |
|--------|---------------------------------|--------------------------------|---------------|
| GET    | /api/books                      | List all books                 | No            |
| GET    | /api/books/:id                  | Get single book with journey   | No            |
| POST   | /api/books                      | List a new book                | Yes           |
| PUT    | /api/books/:id                  | Update book details            | Yes           |
| DELETE | /api/books/:id                  | Remove a book listing          | Yes           |
| POST   | /api/books/:id/request          | Request to borrow a book       | Yes           |
| POST   | /api/books/:id/handoff          | Mark book as handed to next reader | Yes       |

**List a Book — Request Body**
```json
{
  "title": "গীতাঞ্জলি",
  "titleEn": "Gitanjali",
  "author": "Rabindranath Tagore",
  "category": "Poetry",
  "tags": ["bengali", "classic", "poetry"],
  "description": "Nobel Prize winning collection of poems.",
  "cover_url": "https://..."
}
```

**Handoff — Request Body**

Called when the current holder passes the book to the next reader. This logs the journey entry.

```json
{
  "rating": 5,
  "review": "Changed how I see love and loss.",
  "next_user_id": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

---

### Users

| Method | Endpoint              | Description                  | Auth Required |
|--------|-----------------------|------------------------------|---------------|
| GET    | /api/users/me         | Get my profile               | Yes           |
| PUT    | /api/users/me         | Update my profile            | Yes           |
| GET    | /api/users/me/books   | Books I have listed          | Yes           |
| GET    | /api/users/me/queue   | Books I have requested       | Yes           |



## Database Schema

### User

```js
{
  name: String,
  email: { type: String, unique: true },
  password: String,           // bcrypt hashed
  city: String,
  avatar_url: String,
  bio: String,
  favorite_categories: [String],
  books_shared: { type: Number, default: 0 },
  reputation_score: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
}
```

### Book

```js
{
  title: String,
  titleEn: String,
  author: String,
  category: String,
  tags: [String],
  cover_url: String,
  description: String,
  owner_id: ObjectId,         // who listed the book originally
  available: Boolean,

  current_holder: {
    user_id: ObjectId,
    name: String,
    city: String,
    since: Date
  },

  journey: [
    {
      user_id: ObjectId,
      name: String,
      city: String,
      university: String,
      rating: Number,         // 1–5
      review: String,
      from: Date,
      to: Date
    }
  ],

  waitlist: [
    {
      user_id: ObjectId,
      name: String,
      requested_at: Date,
      status: {
        type: String,
        enum: ["pending", "confirmed", "delivered"],
        default: "pending"
      }
    }
  ],

  created_at: { type: Date, default: Date.now }
}
```

---

## Scripts

| Command         | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start server with nodemon (watch)  |
| `npm start`     | Start server in production         |

---

## .gitignore

```
node_modules/
.env
```

---
