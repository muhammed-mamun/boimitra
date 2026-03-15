
# বইমিত্র
### BOIMITRA

**A community for book lovers across Bangladesh.**

Browse books. Request to read. Watch your book travel the country.


---

## What is Boimitra?

**বইমিত্র (Boimitra)** means *Book Friend* in Bengali.

It is a free, community-driven book reading platform for book lovers all across Bangladesh. Boimitra owns and manages a physical library of books. Any person in Bangladesh can create an account, browse the collection, and request a book to read.

Every reader gets the book for **exactly 7 days**. After that, the book is couriered to the next person in the queue. This keeps books moving continuously across the country — from Dhaka to Sylhet to Chittagong to Rajshahi and beyond.

The heart of the platform is the **Book Journey Map** — an interactive map of Bangladesh that shows every city a specific book has physically traveled through, every person who has read it, what they thought about it, and who is waiting to read it next.

> Books don't belong on shelves. They belong in hands.

---

## Core Features

### 🗺️ Book Journey Map
Every book has a living journey page. An interactive Bangladesh map visualizes the physical route the book has traveled — city by city, reader by reader. You can see:
- Where the book is right now
- Every city it has passed through
- The full chronological chain of readers

### 📖 Browse & Request
- Browse the full Boimitra book collection
- Filter by category, language, author, or title
- Request any available book with one click
- Completely free — no subscription, no fees

### ⏱️ 7-Day Reading Window
Each reader holds the book for exactly 7 days. After that, the book is couriered to the next person in the waitlist. This keeps the queue moving fairly for everyone.

### 🌟 Reader Feedback & Ratings
After finishing a book, every reader leaves:
- A star rating (1 to 5)
- A short personal review or insight
- Their city

These stack up into a rich, authentic reader history that lives on the book's journey page forever.

### 📬 Waitlist & Queue
- See exactly how many people are waiting for a book
- Know your position in the queue
- Get notified when the book is on its way to you

### 👤 User Accounts
- Free account for anyone in Bangladesh
- Personal profile showing books you have read
- Your reviews and ratings visible to the community

---

## How It Works

```
1. Browse
   └── User browses the Boimitra book collection

2. Request
   └── User requests a book → joins the waitlist

3. Receive
   └── When it's your turn, the book is couriered to your address

4. Read
   └── You have exactly 7 days to read

5. Pass On
   └── Book is couriered to the next reader in the queue

6. Review
   └── You leave a rating and a short review
       └── Your stop is added to the Book Journey Map forever
```

---

## The Book Journey Map

This is the defining feature of Boimitra.

Every book has its own journey page at:
```
boimitra.com/book/:id
```

On this page you will find:

**Interactive Bangladesh Map**
An SVG map of Bangladesh with pins on every city the book has physically visited. Lines connect the cities in order, building a visual route across the country.

**Reader Chain**
A timeline of every person who has read the book — their name, city, star rating, and personal review. The oldest reader is at the top, the most recent at the bottom.

**Current Holder**
A highlighted card showing who has the book right now, which city it is in, and how many days they have left.

**Waitlist**
A live queue showing the names and cities of everyone waiting to read next.

---

## Tech Stack

### Frontend
React.js
tailwindcss

### Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt

---

## Project Structure

```
boimitra/
├── frontend/                  # Next.js app
│   ├── app/
│   │   ├── page.jsx           # Home — browse all books
│   │   ├── book/[id]/         # Book detail + journey map
│   │   ├── profile/           # User profile + reading history
│   │   └── auth/              # Login and register pages
│   ├── components/
│   │   ├── BookCard.jsx
│   │   ├── JourneyMap.jsx     # SVG Bangladesh map
│   │   ├── ReaderChain.jsx
│   │   └── Waitlist.jsx
│   └── package.json
│
├── backend/                   # Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Book.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── book.routes.js
│   │   │   └── user.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── book.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   └── app.js
│   ├── .env
│   └── server.js
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/boimitra.git
cd boimitra
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/boimitra
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run dev
```

API runs at `http://localhost:5000`

### 3. Set up the frontend

```bash
cd ../frontend
npm install
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

App runs at `http://localhost:3000`

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /api/auth/register | Create a new account | No |
| POST | /api/auth/login | Login and receive token | No |

**Register**
```json
{
  "name": "Rahim Ahmed",
  "email": "rahim@gmail.com",
  "password": "password123",
  "city": "Dhaka"
}
```

**Login**
```json
{
  "email": "rahim@gmail.com",
  "password": "password123"
}
```

---

### Books

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /api/books | Get all books | No |
| GET | /api/books/:id | Get book with full journey | No |
| POST | /api/books/:id/request | Request to read a book | Yes |
| GET | /api/books/:id/waitlist | See the waitlist for a book | No |
| POST | /api/books/:id/review | Submit rating and review | Yes |

---

### Users

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /api/users/me | Get my profile | Yes |
| PUT | /api/users/me | Update my profile | Yes |
| GET | /api/users/me/history | Books I have read | Yes |
| GET | /api/users/me/queue | Books I am waiting for | Yes |

---

## Database Schema

### Book
```js
{
  title: String,
  titleBn: String,
  author: String,
  category: String,
  tags: [String],
  cover_url: String,
  description: String,
  available: Boolean,

  current_holder: {
    user_id: ObjectId,
    name: String,
    city: String,
    received_at: Date,
    due_at: Date             // received_at + 7 days
  },

  journey: [
    {
      user_id: ObjectId,
      name: String,
      city: String,
      rating: Number,        // 1 to 5
      review: String,
      from: Date,
      to: Date
    }
  ],

  waitlist: [
    {
      user_id: ObjectId,
      name: String,
      city: String,
      requested_at: Date,
      status: String         // pending | confirmed | delivered
    }
  ],

  created_at: Date
}
```

### User
```js
{
  name: String,
  email: String,
  password: String,          // bcrypt hashed
  city: String,
  avatar_url: String,
  bio: String,
  books_read: Number,
  created_at: Date
}
```

---

## Book Categories

```
Fiction · Poetry · History · Biography · Philosophy
Religion · Science · Self-Help · Travel · Classic · Mystery · Romance
```

---

## Roadmap

- [x] Book browsing and detail pages
- [x] User accounts and authentication
- [x] Request and waitlist system
- [x] Reader reviews and ratings
- [x] Book journey map (interactive Bangladesh SVG)
- [ ] Email and SMS notifications
- [ ] Bengali language UI
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for managing the book collection
- [ ] Book recommendation based on reading history

---

## Contributing

Boimitra is open source and contributions are welcome.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "add: your feature description"

# Push and open a Pull Request
git push origin feature/your-feature-name
```

Please open an issue before starting any major changes.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for book lovers across Bangladesh.

**বইমিত্র — Every book has a story. This is its journey.**

</div>