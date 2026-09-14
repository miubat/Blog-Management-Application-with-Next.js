# Blog Application REST API

A REST API for a Blog Management Application with three access levels — **Admin**, **User**, and **Guest** — built with Node.js, Express 5, Sequelize (MySQL), JWT authentication, and bcrypt password hashing.

## Tech Stack

- Node.js + Express 5
- MySQL + Sequelize (ORM)
- JWT (`jsonwebtoken`) for authentication
- `bcrypt` for password hashing
- `express-validator` for request validation

## Project Structure

```
config/          Database connection (Sequelize)
controller/      Route handlers (auth, users, blogs)
middlewares/     JWT auth/authorization, request validation, file upload
models/          Sequelize models (User, Blog) + associations
routes/          Express routers, mounted under /api
services/        Business logic used by controllers
utils/           Validation rule sets (express-validator chains)
postman/         Postman collection + environment
```

## Setup

1. **Install dependencies**

   ```
   npm install
   ```

2. **Create the database**

   Create a MySQL database named `blogdb` (or let Sequelize connect to an existing empty one — the app creates tables automatically on first run).

3. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your values:

   ```
   PORT=5000
   DB_NAME=blogdb
   DB_USER=root
   DB_PASSWORD=your_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   SECRET_KEY=a-long-random-secret
   ```

4. **Run the server**

   ```
   npm run dev     # nodemon, auto-restart
   npm start        # plain node
   ```

   On boot the app authenticates against MySQL and calls `sequelize.sync({ alter: true })`, which creates the `users` and `blogs` tables (and the foreign key between them) if they don't already exist.

5. **Create the first admin**

   Register a normal user via `POST /api/auth/register`, then manually promote it to admin in the database:

   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
   ```

## Database Schema

**users**

| Column     | Notes                                  |
|------------|-----------------------------------------|
| id         | Primary key, auto-increment             |
| firstname  | Required                                |
| lastname   | Required                                |
| email      | Required, unique                        |
| password   | Hashed with bcrypt before storing        |
| isActive   | Boolean, default `true`                  |
| role       | Default `"user"` (`"user"` or `"admin"`) |
| createAt   | Timestamp, set on creation                |
| updateAt   | Timestamp, updated on every save         |

**blogs**

| Column     | Notes                                          |
|------------|--------------------------------------------------|
| id         | Primary key, auto-increment                       |
| userId     | Foreign key -> `users.id` (author, cascade delete) |
| blogTitle  | Required                                          |
| blog       | Required (content)                                 |
| category   | Optional                                            |
| createAt   | Timestamp                                            |
| updateAt   | Timestamp                                            |

## Access Levels

| Action                       | Guest | User | Admin |
|-------------------------------|:-----:|:----:|:-----:|
| Register / Login               | ✅    | ✅   | ✅    |
| View / search / filter blogs   | ✅    | ✅   | ✅    |
| Create blog                    | ❌    | ✅   | ✅    |
| Update own blog                | ❌    | ✅   | ✅    |
| Update another user's blog     | ❌    | ❌   | ✅    |
| Delete own blog                | ❌    | ✅   | ✅    |
| Delete another user's blog     | ❌    | ❌   | ✅    |
| View / update own profile      | ❌    | ✅   | ✅    |
| Update own password            | ❌    | ✅   | ✅    |
| View all users / user by id    | ❌    | ❌   | ✅    |
| Activate / deactivate users    | ❌    | ❌   | ✅    |

## API Endpoints

All routes are mounted under `/api`.

| # | Method | Endpoint | Access | Purpose |
|---|--------|----------|--------|---------|
| 1 | POST | `/api/auth/register` | Public | Register a new user |
| 2 | POST | `/api/auth/login` | Public | Login and receive a JWT |
| 3 | GET | `/api/users` | Admin | Get all users |
| 4 | GET | `/api/users/:id` | Admin | Get a specific user |
| 5 | PATCH | `/api/users/:id/status` | Admin | Activate/deactivate a user |
| 6 | GET | `/api/users/profile` | User/Admin | Get own profile |
| 7 | PUT | `/api/users/profile/update` | User/Admin | Update own profile (firstname/lastname only) |
| 8 | PATCH | `/api/users/password` | User/Admin | Update own password |
| 9 | POST | `/api/blogs/create` | User/Admin | Create a blog |
| 10 | GET | `/api/blogs` | Public | List/search/filter blogs (`?title=`, `?category=`) |
| 11 | GET | `/api/blogs/:id` | Public | Get a specific blog |
| 12 | PUT | `/api/blogs/update/:id` | User/Admin | Update a blog (own blog, or any blog if admin) |
| 13 | DELETE | `/api/blogs/delete/:id` (also `/api/blogs/:id`) | User/Admin | Delete a blog (own blog, or any blog if admin) |

### Notes

- JWTs are required via `Authorization: Bearer <token>` on all protected routes.
- A deactivated user's token is rejected on the next request even if it hasn't expired yet, and deactivated users cannot log in.
- Passwords are never returned by any endpoint.
- Validation errors return `400`, missing auth returns `401`, forbidden actions return `403`, missing resources return `404`, duplicate email returns `409`.



### Postman documentation link: https://documenter.getpostman.com/view/32590645/2sBYAuTWsU
