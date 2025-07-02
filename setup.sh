#!/bin/bash

echo "🚀 TaskFlow Development Setup"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

echo ""
echo "🎯 Setup Instructions:"
echo "1. Create a PostgreSQL database named 'todoapp'"
echo "2. Copy backend/.env.example to backend/.env"
echo "3. Update the database credentials in backend/.env"
echo "4. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "✨ Ready to start development!"
