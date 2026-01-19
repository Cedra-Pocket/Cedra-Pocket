#!/bin/bash

# Cedra Quest Backend Deployment Script

echo "🚀 Starting Cedra Quest Backend Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
mkdir -p ssl
mkdir -p logs

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found. Please create it first."
    echo "📋 Copy .env.production.example and fill in your production values."
    exit 1
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🗄️ Starting database and running migrations..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "📊 Running database migrations..."
docker-compose exec postgres psql -U cedra_user -d cedra_quest_prod -c "SELECT 1;" || {
    echo "❌ Database connection failed"
    exit 1
}

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

# Check if services are running
echo "🔍 Checking service health..."
sleep 15

# Test API health
if curl -f http://localhost:3333/health > /dev/null 2>&1; then
    echo "✅ API is healthy!"
else
    echo "❌ API health check failed"
    docker-compose logs cedra-quest-api
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📊 API is running on: http://localhost:3333"
echo "🗄️ Database is running on: localhost:5432"
echo "🔄 Redis is running on: localhost:6379"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart API: docker-compose restart cedra-quest-api"
echo "  - Database backup: docker-compose exec postgres pg_dump -U cedra_user cedra_quest_prod > backup.sql"