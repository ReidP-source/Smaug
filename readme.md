# Smaug Database Management System

Smaug is a full-stack database management application for a fictional cross-platform video game marketplace. It was built for a database systems course to demonstrate relational schema design, CRUD operations, stored procedures, and a React-based interface for managing marketplace data.

## Designed By

- Reid Pettibone
- Gavin Piper

## Overview

Smaug models a game marketplace with customers, games, platforms, publishers, ESRB-style ratings, genres, carts, libraries, and purchases. The frontend provides table-based management pages for each major entity, while the backend exposes Express routes that read from and write to a MySQL database.

The application is split into two services:

- `backend/`: Express API server connected to MySQL with `mysql2`
- `frontend/`: React + Vite client served in development by Vite and in production by a small Express static server

## Features

- View, create, update, and delete games
- Manage customers, publishers, genres, platforms, and ratings
- View customer carts and libraries
- View purchases and purchase item data
- Reset and reseed the database from the home page
- Use stored procedures for database reset and selected database operations
- Maintain many-to-many relationships such as games-to-platforms and games-to-genres

## Tech Stack

- React 18
- Vite
- React Router
- Node.js
- Express
- MySQL
- `mysql2`
- `nodemon` for development
- `forever` for production process management

## Repository Structure

```text
.
├── backend/
│   ├── database/
│   │   └── db-connector.js
│   ├── routes/
│   │   ├── create.js
│   │   ├── read.js
│   │   ├── update.js
│   │   └── delete.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── reactServer.cjs
│   └── vite.config.js
├── CompletedDDL.sql
├── DML.sql
├── PL.sql
├── updatedDDL.sql
└── README.md
```

## Database Model

The schema includes the following main tables:

- `Customers`
- `Games`
- `Platforms`
- `Publishers`
- `Ratings`
- `Genres`
- `GamePlatforms`
- `GenreItems`
- `Carts`
- `CartItems`
- `Libraries`
- `LibraryItems`
- `Purchases`
- `PurchaseItems`

`CompletedDDL.sql` contains schema definitions and sample data. `PL.sql` contains stored procedures, including `sp_reset_gamedb`, which is used by the backend reset route.

## Prerequisites

- Node.js and npm
- Access to a MySQL database
- A database initialized with the provided SQL files

Before running the app, review `backend/database/db-connector.js` and update the MySQL connection settings for your environment.

> Important: do not commit real database passwords or class credentials to a public repository. Prefer environment variables for deployed or shared versions of this project.

## Database Setup

Load the schema, seed data, and stored procedures into your MySQL database. A typical setup is:

```bash
mysql -u <username> -p <database_name> < CompletedDDL.sql
mysql -u <username> -p <database_name> < PL.sql
```

If you are using separate schema and data files instead, load the DDL first, then `DML.sql`, then `PL.sql`.

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Development

Start the backend API:

```bash
cd backend
npm run development
```

Start the frontend development server in a second terminal:

```bash
cd frontend
npm run development
```

The backend currently listens on port `9680` in `backend/server.js`.

The frontend currently defines its backend URL in `frontend/src/App.jsx`. It is also noted that in production these ports should be kept in .env/secrets.

```js
const backendPort = 9680;
```

## Production

Start the backend with `forever`:

```bash
cd backend
npm run production
```

Build and serve the frontend with `forever`:

```bash
cd frontend
npm run production
```

Stop production processes:

```bash
cd backend
npm run stop_production
```

```bash
cd frontend
npm run stop_production
```

## Application Pages

- `/`: Home page and database reset action
- `/games`: Games table
- `/customers`: Customers table
- `/customers/:customerID/cart`: Customer cart view
- `/customers/:customerID/library`: Customer library view
- `/purchases`: Purchases table
- `/platforms`: Platforms table
- `/genres`: Genres table
- `/ratings`: Ratings table
- `/publishers`: Publishers table

## API Routes

The backend organizes routes by CRUD operation.

### Read

- `GET /`
- `GET /games`
- `GET /customers`
- `GET /customers/:customerID/cart`
- `GET /customers/:customerID/library`
- `GET /purchases`
- `GET /platforms`
- `GET /genres`
- `GET /ratings`
- `GET /publishers`

### Create

- `POST /games/create`
- `POST /customers/create`
- `POST /publishers/create`
- `POST /genres/create`
- `POST /platforms/create`
- `POST /ratings/create`

### Update

- `PUT /games/update/:id`
- `PUT /customers/update/:id`
- `PUT /publishers/update/:id`
- `PUT /genres/update/:id`
- `PUT /platforms/update/:id`
- `PUT /ratings/update/:id`

### Delete

- `DELETE /games/:id`
- `DELETE /customers/:id`
- `DELETE /publishers/:id`
- `DELETE /genres/:id`
- `DELETE /platforms/:id`
- `DELETE /ratings/:id`

### Admin

- `POST /admin/reset-db`: calls `sp_reset_gamedb`
- `GET /__db`: returns current database and MySQL user information

## Notes

- Some boilerplate code was adapted from course modules.
- GenAI was used sparingly for repetitive tasks and feedback.
- This project was built as a course database management systems assignment.

## License

No license is currently specified. Add a license before publishing if you want others to reuse or modify this project.
