#!/bin/bash

# 🚀 Cedra Quest Auto Deploy Script

echo "🎮 Cedra Quest - Auto Deploy Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "Requirements check passed"
}

# Deploy Backend
deploy_backend() {
    print_status "Deploying Backend..."
    
    # Check if Railway CLI is installed
    if command -v railway &> /dev/null; then
        print_status "Using Railway for backend deployment"
        
        # Install dependencies
        npm install
        
        # Build project
        npm run build
        
        # Deploy to Railway
        railway up
        
        print_success "Backend deployed to Railway"
    else
        print_warning "Railway CLI not found. Please install it:"
        echo "npm install -g @railway/cli"
        echo "railway login"
        echo "railway init"
        echo "railway up"
    fi
}

# Create and Deploy Frontend
deploy_frontend() {
    print_status "Creating and deploying Frontend..."
    
    # Create React app if not exists
    if [ ! -d "cedra-quest-frontend" ]; then
        print_status "Creating React app..."
        npx create-react-app cedra-quest-frontend
        cd cedra-quest-frontend
        
        # Install additional dependencies
        npm install @telegram-apps/sdk axios
        
        # Copy template files
        cp -r ../frontend-template/src/* ./src/
        
        print_success "React app created"
    else
        cd cedra-quest-frontend
        print_status "Using existing React app"
    fi
    
    # Build frontend
    print_status "Building frontend..."
    npm run build
    
    # Deploy to Vercel if available
    if command -v vercel &> /dev/null; then
        print_status "Deploying to Vercel..."
        vercel --prod
        print_success "Frontend deployed to Vercel"
    else
        print_warning "Vercel CLI not found. Please install it:"
        echo "npm install -g vercel"
        echo "vercel --prod"
        
        print_status "You can also deploy manually:"
        echo "1. Upload 'build' folder to any static hosting"
        echo "2. Or use Netlify: npm install -g netlify-cli && netlify deploy --prod --dir=build"
    fi
    
    cd ..
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating template..."
        cat > .env << EOL
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"
DIRECT_URL="postgresql://user:pass@host:port/db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-production"
JWT_EXPIRES_IN="7d"

# Telegram
TELEGRAM_BOT_TOKEN="your-bot-token-from-botfather"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# API Keys (optional)
TWITTER_API_KEY=""
TWITTER_API_SECRET=""
EOL
        print_warning "Please update .env file with your actual values"
    else
        print_success ".env file exists"
    fi
}

# Run database migrations
setup_database() {
    print_status "Setting up database..."
    
    # Generate Prisma client
    npx prisma generate
    
    # Push schema to database
    npx prisma db push
    
    # Seed initial data
    npm run prisma:seed
    
    print_success "Database setup completed"
}

# Main deployment flow
main() {
    print_status "Starting Cedra Quest deployment..."
    
    # Check requirements
    check_requirements
    
    # Setup environment
    setup_env
    
    # Setup database
    setup_database
    
    # Deploy backend
    deploy_backend
    
    # Deploy frontend
    deploy_frontend
    
    print_success "🎉 Deployment completed!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env with your actual values"
    echo "2. Create Telegram bot with @BotFather"
    echo "3. Configure Mini App URL in @BotFather"
    echo "4. Test the application"
    echo ""
    echo "Useful commands:"
    echo "- Backend logs: railway logs"
    echo "- Frontend URL: Check Vercel dashboard"
    echo "- Database: railway connect postgresql"
}

# Run main function
main