
# বইমিত্র · Boimitra

**A community book-sharing platform for readers across Bangladesh.**

Browse books. Request to read. Watch your book travel the country through an interactive journey map.

> "Books don't belong on shelves. They belong in hands."

---

## What is Boimitra?

**বইমিত্র (Boimitra)** means *Book Friend* in Bengali.

Boimitra is a free, community-driven platform where book lovers across Bangladesh can borrow physical books managed by the platform. Each reader holds a book for 7 days, then it's couriered to the next person in the queue — traveling city to city, building a living journey.

---

## ✨ Features

### 🗺️ Interactive Book Journey Map
Each book has a contextual journey map (powered by **react-simple-maps** and GeoJSON Bangladesh data) embedded directly in its detail page. It visualizes every city the book has physically traveled through with animated route lines and pulsing markers.

### 📖 Browse & Request
- Browse the full Boimitra collection with rich book cards
- Real-time reader and waitlist counts on every card
- Request any available book or join the waitlist with a single click

### � User Authentication
- Register with name, email, password, and division
- Secure JWT-based login with sessions persisted to `localStorage`
- Protected routes and API calls using `Authorization: Bearer` headers

### 🧑 User Dashboard (`/dashboard`)
- Personal profile header with city, total books read, and queue count
- **Waitlist Queue** tab — all books currently waiting for
- **Reading History** tab — all books previously read
- Protected route; redirects to login if unauthenticated

### � Waitlist & Queue
- Join a wait list when a book is currently being read
- Live position tracking
- Automatic handoff to the next person in the queue

### ⏱️ 7-Day Reading Window
Each reader holds a book for exactly 7 days. After that, it's couriered to the next person, keeping the queue fair and moving.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| DaisyUI + Tailwind CSS | Component styling and dark theme |
| react-simple-maps | Interactive Bangladesh division map |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcrypt | Password hashing |
| dotenv | Environment variable management |
| nodemon | Dev auto-restart |

---

## Project Structure

```
boimitra/
├── boimitra-client/           # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── BookCard.jsx       # Book preview card w/ live stats
│       │   ├── JourneyMap.jsx     # Interactive Bangladesh map (react-simple-maps)
│       │   ├── Header.jsx         # Nav with auth-aware links
│       │   ├── Footer.jsx
│       │   ├── Hero.jsx
│       │   ├── Categories.jsx
│       │   └── PopularBooks.jsx
│       ├── context/
│       │   └── AuthContext.jsx    # Global auth state & API calls
│       ├── layouts/
│       │   └── Layout.jsx         # Root layout with Header + Footer
│       ├── pages/
│       │   ├── BooksPage.jsx      # Browse all books
│       │   ├── BookDetailsPage.jsx # Book detail + journey map toggle
│       │   ├── DashboardPage.jsx  # User history + waitlist (protected)
│       │   ├── LoginPage.jsx      # Sign in form
│       │   ├── RegisterPage.jsx   # Registration form
│       │   └── ErrorPage.jsx
│       └── App.jsx                # Route configuration + AuthProvider
│
├── boimitra-server/           # Express API server
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   ├── User.js
│       │   └── Book.js
│       ├── routes/
│       │   ├── auth.route.js
│       │   ├── book.route.js
│       │   └── user.route.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── book.controller.js
│       │   └── user.controller.js
│       ├── middlewares/
│       │   └── auth.middleware.js
│       ├── scripts/               # Database seeder scripts
│       └── app.js
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
git clone https://github.com/muhammed-mamun/boimitra.git
cd boimitra
```

### 2. Set up the Backend

```bash
cd boimitra-server
npm install
```

Create a `.env` file in `boimitra-server/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/boimitra
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Start the backend server:

```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Set up the Frontend

```bash
cd ../boimitra-client
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create a new account | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |

### Books

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/books` | Get all books (with stats) | No |
| GET | `/api/books/:id` | Get book + full journey | No |
| POST | `/api/books/:id/request` | Request to read / join waitlist | **Yes** |
| GET | `/api/books/:id/waitlist` | View waitlist for a book | No |
| POST | `/api/books/:id/review` | Submit rating and review | **Yes** |
| GET | `/api/books/categories` | Get all book categories | No |
| GET | `/api/books/journey-map-data` | Aggregated map statistics | No |

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/me` | Get my profile | **Yes** |
| PUT | `/api/users/me` | Update my profile | **Yes** |
| GET | `/api/users/me/history` | All books I have read | **Yes** |
| GET | `/api/users/me/queue` | All books I am waiting for | **Yes** |

---

## Database Schema

### Book
```js
{
  title: String,
  titleBn: String,         // Bengali title
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
    due_at: Date           // received_at + 7 days
  },

  journey: [{              // Completed readers (historical)
    user_id: ObjectId,
    name: String,
    city: String,
    rating: Number,        // 1–5
    review: String,
    from: Date,
    to: Date
  }],

  waitlist: [{             // People waiting to read
    user_id: ObjectId,
    name: String,
    city: String,
    requested_at: Date,
    status: String         // pending | confirmed | delivered
  }],

  created_at: Date
}
```

### User
```js
{
  name: String,
  email: String,
  password: String,        // bcrypt hashed
  city: String,            // Bangladesh division
  avatar_url: String,
  bio: String,
  favorite_categories: [String],
  created_at: Date
}
```

---

## Roadmap

- [x] Book browsing with live reader and waitlist stats
- [x] User registration and authentication (JWT)
- [x] Book detail page with category, availability, and reader info
- [x] Interactive Bangladesh division journey map (react-simple-maps)
- [x] Contextual journey map embedded in Book Details page
- [x] Request to read / join waitlist (authenticated)
- [x] User dashboard with reading history and waitlist queue
- [x] Dynamic categories API and database seeder
- [ ] Reader reviews and ratings submission
- [ ] Email / SMS notifications when book is on its way
- [ ] Bengali language UI
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for managing the book collection
- [ ] AI-powered book recommendations based on reading history

---

## Contributing

Boimitra is open source and contributions are welcome!

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "add: your feature description"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please open an issue before starting any major changes.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for book lovers across Bangladesh.

**বইমিত্র — Every book has a story. This is its journey.**

[GitHub](https://github.com/muhammed-mamun/boimitra)

</div>