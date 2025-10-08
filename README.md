# Investment Platform Backend

This is the backend for the Investment Platform, a Node.js application built with Express, TypeScript, and Prisma.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- A running PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd investment-platform-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root of the project and add the following environment variables. You can use the `.env.example` file as a template.

```
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
```

## Running the Application

To run the application in development mode with hot-reloading, use:

```bash
npm run dev
```

To build the application for production, use:

```bash
npm run build
```

To run the application in production mode, use:

```bash
npm start
```

## Available Scripts

- `npm start`: Starts the application in production mode.
- `npm run dev`: Starts the application in development mode with hot-reloading.
- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run format`: Formats the codebase using Prettier.
- `npm run prisma:generate`: Generates the Prisma client.
- `npm run prisma:migrate`: Applies database migrations.

## API Documentation

The API routes are defined in the `src/routes` directory. For detailed information about the available endpoints, please refer to the route definitions.

## Project Structure

The project follows a standard structure for a Node.js application:

```
.
├── src
│   ├── config
│   ├── constants
│   ├── controllers
│   ├── middlewares
│   ├── prisma
│   ├── routes
│   ├── services
│   ├── templates
│   ├── types
│   ├── utils
│   ├── validations
│   └── app.ts
├── package.json
└── tsconfig.json
```