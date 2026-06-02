# Todo App

A full-stack todo application with user authentication, task management, and a profile page. The backend is a Node.js/Express API with MongoDB; the frontend is plain HTML, CSS, and JavaScript.

## Features

- User signup and login (JWT)
- Create, view, update, and delete tasks
- User profile page
- Protected API routes

## Tech Stack

- **Backend:** Node.js, Express, Mongoose, JWT, bcrypt
- **Frontend:** HTML, CSS, JavaScript (Fetch API)
- **Database:** MongoDB

## Project Structure

```
todo-app/
├── backend/
│   ├── config/          # Database connection
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # User and Task schemas
│   ├── routes/          # Auth, task, and user API routes
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── scripts/         # Page logic (login, signup, dashboard, profile)
│   ├── *.html           # App pages
│   └── style.css
├── package.json         # Root dependencies
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/todo-app.git
   cd todo-app
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the `backend` folder with your MongoDB connection string and optional settings (`PORT`, `JWT_SECRET`). The server reads `MONGO_URI` to connect to the database.

4. Start the backend:

   ```bash
   node server.js
   ```

   The API runs at `http://localhost:4000` by default.

5. Open the frontend by opening `frontend/index.html` in your browser (or use a simple static server). Pages call the API at `http://localhost:4000`.

## API Overview

| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | `/auth/signup`  | Register a new user      |
| POST   | `/auth/login`   | Log in and receive a JWT |
| GET    | `/tasks`        | List tasks (auth required) |
| POST   | `/tasks`        | Create a task (auth required) |
| PUT    | `/tasks/:id`    | Update a task (auth required) |
| DELETE | `/tasks/:id`    | Delete a task (auth required) |
| GET    | `/user/profile` | Get user profile (auth required) |

Protected routes expect an `Authorization: Bearer <token>` header.

## License

ISC
