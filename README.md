# Semo News Portal

A modern news portal built with React, Node.js, and PostgreSQL that allows users to read, post, and manage news articles.

## Features

- 🔐 User Authentication (Register/Login)
- 👤 User Profile Management
- 📰 News Articles Management
- 💬 Comments System
- 🔍 Search Functionality
- 👑 Admin Dashboard
- 📱 Responsive Design

## Tech Stack

### Frontend
- React 19
- React Router DOM 7
- Axios
- TailwindCSS
- React Toastify
- Vite

### Backend
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- Bcrypt
- Jest (Testing)
- Supertest

## Prerequisites

- Node.js >= 16
- PostgreSQL >= 12
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd reactnews
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
```

Configure your `.env` file with your PostgreSQL credentials:
```
PORT=5000
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=reactnews
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
```

3. **Initialize Database**
```bash
node db/dbInit.js
```

4. **Setup Frontend**
```bash
cd ../app
npm install
cp .env.example .env
```

Configure your `.env` file:
```
VITE_API_URL=http://localhost:5000
```

## Running the Application

1. **Start Backend Server**
```bash
cd backend
npm run dev
```

2. **Start Frontend Development Server**
```bash
cd app
npm run dev
```

The application will be available at `http://localhost:5173`

## Testing

### Backend Tests
```bash
cd backend
npm test
```

## Project Structure

```
reactnews/
├── app/                    # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Utility functions
│   │   └── context/       # React context providers
│   └── public/            # Static files
│
└── backend/               # Backend application
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── routes/          # API routes
    ├── middleware/       # Custom middleware
    ├── db/              # Database scripts
    └── tests/           # Test suites
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### News
- `GET /api/news` - Get all news
- `GET /api/news/published` - Get published news
- `GET /api/news/:id` - Get specific news
- `POST /api/news` - Create news (Admin)
- `PUT /api/news/:id` - Update news (Admin)
- `DELETE /api/news/:id` - Delete news (Admin)

### Comments
- `GET /api/news/:newsId/comments` - Get comments for news
- `POST /api/news/:newsId/comments` - Add comment
- `PUT /api/news/:newsId/comments/:commentId` - Update comment
- `DELETE /api/news/:newsId/comments/:commentId` - Delete comment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.