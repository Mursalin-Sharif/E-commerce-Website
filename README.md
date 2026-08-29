# E-commerce Website — MERN Stack

Daraz-style e-commerce built with **MongoDB**, **Express**, **React**, and **Node.js**.

## Stack

| Layer | Tech |
|-------|------|
| **M** | MongoDB + Mongoose (`server/models/Store.js`) |
| **E** | Express API (`server/index.js`) |
| **R** | React + Vite + React Router (`client/`) |
| **N** | Node.js |

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017/ecommerce`)

## Setup

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

`npm install` at the repo root also installs `client/` dependencies (via `postinstall`). If build fails with `vite: command not found`, run:

```bash
npm install --prefix client
npm run build
```

- **React app:** http://127.0.0.1:5173  
- **API:** http://127.0.0.1:8080/api/store  
- **React admin:** http://127.0.0.1:5173/admin  
- **Legacy admin UI:** http://127.0.0.1:8080/admin/ (vanilla, still works)

## Production

```bash
npm run build
set NODE_ENV=production
npm start
```

Serves React build from `client/dist` on port 8080.

## Routes (React)

| Path | Page |
|------|------|
| `/` | Home product grid |
| `/landing` | Landing (headphones) |
| `/tshirt` | T-Shirt store |
| `/product/:id` | Product detail |
| `/review` | Reviews |
| `/admin` | MERN admin panel |

Legacy `.html` URLs redirect to React routes.

## Data

Store lives in MongoDB. Seed from `data/store.json`:

```bash
npm run seed
```

Admin password default: `admin123` (set `ADMIN_PASSWORD` in `.env`).
