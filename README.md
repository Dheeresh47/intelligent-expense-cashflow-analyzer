# Project Root

This repository holds the Node.js + Express API for the Intelligent Personal Expense & Cashflow Analyzer. All of the application code lives inside the `backend` folder, while the root directory contains configuration and entry-point files.

## Layout

```
/backend             ← source files (models, routes, controllers, etc.)
package.json        ← project manifest
package-lock.json   ← dependencies lock file
.env                ← environment variables
server.js           ← Express server bootstrap
README.md           ← this document
``` 

## Getting Started

Install dependencies and run the server from the root:

```bash
npm install
npm run dev
``` 

The health-check endpoint is still `GET /api/health` (returns `{ status: "ok" }`).
