# Intelligent Personal Expense & Cashflow Analyzer (Backend)

This is a Node.js + Express backend scaffold for an intelligent personal expense and cashflow analyzer.

## Features

- Express server with middleware setup
- MongoDB connection via Mongoose
- Environment configuration with dotenv
- CORS enabled
- Clean folder structure with separate models, routes, controllers, services, and configuration

## Structure

```
/models
   user.model.js
   income.model.js
   expense.model.js

/routes
   income.routes.js
   expense.routes.js
   analytics.routes.js

/controllers
   income.controller.js
   expense.controller.js
   analytics.controller.js

/services
   income.service.js
   expense.service.js
   analytics.service.js

/config
   db.js

server.js
```

## Getting Started

> **Note:** this folder contains all application code; root-level config files (`package.json`, `package-lock.json`, `.env`, `server.js`) live in the project root alongside this directory.

1. Install dependencies from the project root:
   ```bash
   npm install
   ```
2. Edit the root `.env` file with your variables, for example:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/expense-app
   ```
3. Start the server in development mode from the root:
   ```bash
   npm run dev
   ```
4. Health check endpoint:
   `GET /api/health` should return `{ status: "ok" }`.

### API routes

- **Income** (`/api/income`)
  - `POST /` create an income record
  - `GET /` list all incomes
  - `DELETE /:id` delete by id

- **Expense** (`/api/expense`)
  - `POST /` create an expense record
  - `GET /` list all expenses
  - `DELETE /:id` delete by id

Analytics endpoints remain placeholders.

Analytics logic is not implemented yet; the current code contains placeholders.

Feel free to extend controllers and services as needed.
