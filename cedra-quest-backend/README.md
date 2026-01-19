# 🎮 Cedra Quest Backend

A comprehensive backend API for Cedra Quest - a Telegram Mini App game with non-custodial wallet integration and complete game economy system.

## 🚀 Features

### **🔐 Authentication System**
- Telegram Mini App authentication
- Non-custodial wallet creation
- BIP-39 seed phrase generation (client-side)
- Secure user management

### **🎮 Game Economy**
- **Pet System**: Feed, level up, passive mining
- **Energy System**: Active gameplay with regeneration
- **Ranking System**: 6-tier progression (Bronze → Leviathan)
- **Game Sessions**: Mini-games with point rewards
- **Game Cycles**: Dynamic difficulty adjustment

### **🛡️ Security**
- Server never stores private keys
- Telegram signature validation
- Rate limiting and anti-cheat
- Input validation and sanitization

## 📁 Project Structure

```
cedra-quest-backend/
├── src/                    # Source code
│   ├── auth/              # Authentication modules
│   ├── game/              # Game economy modules
│   ├── user/              # User management
│   ├── wallet/            # Wallet services
│   └── common/            # Shared interfaces & constants
├── test/                  # Test scripts
├── docs/                  # Documentation
├── prisma/                # Database schema & migrations
├── docker-compose.yml     # Docker services
├── Dockerfile            # Container configuration
└── deploy.sh             # Deployment script
```

## 🛠️ Quick Start

### **Prerequisites**
- Node.js 18+
- PostgreSQL database
- Telegram Bot Token

### **Installation**
```bash
# Clone repository
git clone <repository-url>
cd cedra-quest-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npx prisma generate
npx prisma db push

# Start development server
npm run start:dev
```

### **Testing**
```bash
# Test authentication
npm run test:api

# Test game economy
npm run test:game

# Test with real Telegram data
npm run test:telegram

# Run all tests
npm run test:all
```

## 📚 Documentation

### **📖 For Developers**
- [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) - Complete API reference
- [`docs/GAME_ECONOMY_PLAN.md`](docs/GAME_ECONOMY_PLAN.md) - Game mechanics & business logic
- [`docs/HOW_TO_GET_REAL_INITDATA.md`](docs/HOW_TO_GET_REAL_INITDATA.md) - Telegram integration guide

### **🚀 For Deployment**
- [`docs/PRODUCTION_CHECKLIST.md`](docs/PRODUCTION_CHECKLIST.md) - Production deployment guide
- [`docker-compose.yml`](docker-compose.yml) - Docker services configuration
- [`deploy.sh`](deploy.sh) - Automated deployment script

### **🧪 For Testing**
- [`test/README.md`](test/README.md) - Test scripts documentation
- Various test files in `test/` folder

## 🔧 API Endpoints

### **Authentication**
```
POST /auth/login           # Telegram authentication
POST /auth/create-wallet   # Create new wallet
POST /auth/recover-wallet  # Recover wallet from seed
```

### **Game Economy**
```
GET  /game/pet/status/:userId      # Pet status
POST /game/pet/feed/:userId        # Feed pet
POST /game/pet/claim/:userId       # Claim mining rewards

GET  /game/energy/status/:userId   # Energy status
POST /game/energy/refill/:userId   # Refill energy

POST /game/session/start/:userId   # Start game session
POST /game/session/complete/:userId # Complete game session

GET  /game/ranking/leaderboard     # Global leaderboard
GET  /game/ranking/user/:userId    # User rank info

GET  /game/dashboard/:userId       # Complete dashboard data
```

## 🎯 Game Economy Overview

### **Core Loop**
```
Earn Points → Upgrade Pet → Pet Mines More → Earn More Points
```

### **Point Sources**
- 🎮 **Active**: Mini-games (consume energy)
- 🐾 **Passive**: Pet mining (time-based)
- 👥 **Social**: Quests & referrals

### **Point Sinks**
- 🔥 **Pet Upgrade**: Feed pet to level up (main sink)
- ⚡ **Energy Refill**: Buy more game sessions
- 💱 **Swap Fee**: Convert to $CEDRA tokens

### **Progression System**
- **Pet Levels**: 1-10 (affects mining speed)
- **User Ranks**: Bronze → Silver → Gold → Platinum → Diamond → Leviathan
- **Game Cycles**: Dynamic difficulty adjustment

## 🐳 Docker Deployment

### **Development**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Production**
```bash
# Configure production environment
cp .env.production.example .env.production
# Edit .env.production with real values

# Deploy
chmod +x deploy.sh
./deploy.sh
```

## 🔍 Health Monitoring

```bash
# Check API health
curl http://localhost:3333/health

# Expected response
{
  "status": "ok",
  "timestamp": "2024-01-19T12:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "memory": {...}
}
```

## 🛡️ Security Features

- **Non-custodial**: Server never stores private keys
- **Telegram Auth**: Cryptographic signature validation
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: All endpoints validated
- **CORS**: Configurable origin restrictions
- **HTTPS**: SSL/TLS encryption
- **Anti-cheat**: Time validation, concurrency control

## 📊 Performance

### **Expected Metrics**
- API Response: < 200ms
- Database Queries: < 50ms
- Memory Usage: < 1GB
- Concurrent Users: 1000+

### **Load Testing**
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:3333/health
```

## 🔧 Development

### **Available Scripts**
```bash
npm run start:dev      # Development server with hot reload
npm run build          # Build for production
npm run test:api       # Test authentication APIs
npm run test:game      # Test game economy APIs
npm run prisma:studio  # Open database GUI
npm run lint           # Code linting
```

### **Database Management**
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema changes
npm run prisma:push

# Create migration
npm run prisma:migrate

# Open database studio
npm run prisma:studio
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

- 📚 Check documentation in `docs/` folder
- 🧪 Run test scripts in `test/` folder
- 🔍 Review troubleshooting guides
- 📊 Monitor health endpoints

## 🎯 Roadmap

- [ ] Blockchain integration (replace mock)
- [ ] Advanced anti-cheat systems
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Mobile app support
- [ ] Multi-language support

---

**Built with ❤️ for the Cedra Quest community**