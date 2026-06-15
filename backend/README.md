# Jalvindar Computer Technologies — Backend

A standalone Node.js + Express REST API for the Jalvindar Computer
Technologies website. Uses a file-based JSON store (lowdb) so it runs
with zero external setup. Swap for MongoDB / Postgres in production.

## Stack
- Node.js + Express
- JWT auth (`jsonwebtoken`) + bcrypt password hashing
- lowdb (JSON file) persistence at `src/data/db.json`
- Zod request validation
- Helmet, CORS, rate-limiting, morgan logging

## Quick start
```bash
cd backend
cp .env.example .env
npm install
npm run seed     # creates admin user + sample categories/products
npm run dev      # http://localhost:5000
```

Default admin credentials (from `.env`):
- Email: `admin@laptophub.com`
- Password: `admin123`

## API overview

Base URL: `http://localhost:5000/api`

### Auth
| Method | Route                | Auth     | Body                              |
|--------|----------------------|----------|-----------------------------------|
| POST   | `/auth/register`     | public   | `{ name, email, password }`       |
| POST   | `/auth/login`        | public   | `{ email, password }`             |
| GET    | `/auth/me`           | user     | —                                 |

### Categories
| Method | Route                | Auth   |
|--------|----------------------|--------|
| GET    | `/categories`        | public |
| POST   | `/categories`        | admin  |
| PUT    | `/categories/:id`    | admin  |
| DELETE | `/categories/:id`    | admin  |

### Products
| Method | Route                | Auth   |
|--------|----------------------|--------|
| GET    | `/products`          | public |
| GET    | `/products/:id`      | public |
| POST   | `/products`          | admin  |
| PUT    | `/products/:id`      | admin  |
| DELETE | `/products/:id`      | admin  |

`POST /products` body:
```json
{
  "name": "Acer Aspire 3",
  "categoryId": "cat-laptops",
  "price": 32990,
  "image": "https://...",
  "description": "optional",
  "warranty": "1 Year Acer India Warranty",
  "seller": "Jalvindar Computer",
  "deliveryDays": "3-5",
  "highlights": ["AMD Ryzen 3", "8GB RAM"],
  "features": [{"label": "Resolution", "value": "1920x1080"}]
}
```

### Reviews
| Method | Route                              | Auth   |
|--------|------------------------------------|--------|
| GET    | `/reviews/product/:productId`      | public |
| POST   | `/reviews/product/:productId`      | public |
| DELETE | `/reviews/:id`                     | admin  |

Review body: `{ name, phone?, rating, response }`

### Orders
| Method | Route                | Auth   |
|--------|----------------------|--------|
| POST   | `/orders`            | user   |
| GET    | `/orders/me`         | user   |
| GET    | `/orders`            | admin  |
| PATCH  | `/orders/:id/status` | admin  |

## Folder structure
```
backend/
├── src/
│   ├── server.js
│   ├── app.js
│   ├── config.js
│   ├── db.js
│   ├── middleware/  (auth, error, validate)
│   ├── routes/      (auth, categories, products, reviews, orders)
│   ├── controllers/
│   ├── utils/       (jwt, seed)
│   └── data/        (db.json — auto-created)
├── package.json
├── .env.example
└── README.md
```

## Swapping the database
All persistence flows through `src/db.js`. Replace its internals with
Mongoose / Prisma without touching controllers.
