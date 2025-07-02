# TaskFlow - Modern Todo Application

A beautiful, modern todo application built with React, TypeScript, Node.js, and PostgreSQL.

## Features

- ✨ Modern, responsive UI with dark/light theme
- 🚀 Full CRUD operations (Create, Read, Update, Delete)
- 🎯 Priority levels (High, Medium, Low)
- 📅 Due date management
- 🌙 Dark/Light mode toggle
- 📊 Progress tracking with statistics
- 🎨 Glass morphism design
- ⚡ Real-time updates

## Tech Stack

### Frontend
- React 18
- TypeScript
- Ant Design
- Vite
- CSS3 with modern animations

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Joi validation

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todoapp
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Database Setup**
   - Create a PostgreSQL database named `todoapp`
   - Update the `.env` file in the backend directory with your database credentials

5. **Run the Application**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
todoapp/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── validators/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/stats` - Get dashboard statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is open source and available under the MIT License.
