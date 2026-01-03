# Cedra Quest Backend

Backend API cho Telegram Mini App Quest Platform với tích hợp blockchain và social media verification.

## 🚀 Tính năng chính

- **Telegram Mini App Authentication** - Xác thực qua Telegram initData
- **Quest Management** - Quản lý nhiệm vụ Social và On-chain
- **Social Media Verification** - Tự động verify Twitter, Telegram tasks
- **Blockchain Integration** - Verify on-chain activities (holding, swapping, staking)
- **Reward System** - Tự động trả thưởng points/tokens/NFTs
- **Referral System** - Hệ thống giới thiệu với commission
- **Background Jobs** - Xử lý bất đồng bộ với Redis Queue

## 🏗️ Kiến trúc

```
Frontend (Mini App) → Auth Module → JWT
                   ↓
API Gateway → Quest Module → Social/Blockchain Verification
                   ↓
Queue System → Reward Processing → Payout Worker
                   ↓
Bot Module → Telegram Notifications
```

## 📋 Yêu cầu

- Node.js 18+
- PostgreSQL
- Redis
- Telegram Bot Token

## 🛠️ Cài đặt

1. **Clone và cài dependencies:**
```bash
git clone <repo-url>
cd cedra-quest-backend
npm install
```

2. **Cấu hình environment:**
```bash
cp .env.example .env
# Chỉnh sửa các biến môi trường trong .env
```

3. **Setup database:**
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

4. **Khởi chạy:**
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🔧 Cấu hình Environment

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Telegram
TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# Blockchain
CEDRA_RPC_URL="https://rpc.cedra.network"
PRIVATE_KEY="your-private-key"

# Social APIs
TWITTER_API_KEY=""
TWITTER_API_SECRET=""
```

## 📚 API Endpoints

### Authentication
- `POST /auth/verify` - Verify Telegram initData và tạo JWT

### Users
- `GET /users/profile` - Lấy thông tin user hiện tại
- `POST /users/connect-wallet` - Kết nối ví blockchain

### Quests
- `GET /quests` - Lấy danh sách quest với trạng thái user
- `POST /quests/:id/verify` - Verify và hoàn thành quest

## 🔄 Luồng hoạt động

### 1. Authentication Flow
```
Frontend → POST /auth/verify {initData}
Backend → Validate với Bot Token → Tạo/Tìm User → Return JWT
```

### 2. Quest Verification Flow
```
Frontend → POST /quests/:id/verify
Backend → Check quest type:
  - Social: Call Twitter/Telegram API
  - Onchain: Queue blockchain verification job
→ Update status → Queue reward → Send notification
```

### 3. Reward Processing
```
Quest Completed → Queue Job → Process Reward:
  - Points: Update DB directly
  - Tokens: Queue payout job → Batch transaction
→ Send Telegram notification
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Deployment

1. **Build:**
```bash
npm run build
```

2. **Environment setup:**
- Cấu hình production database
- Setup Redis cluster
- Configure load balancer

3. **Run:**
```bash
npm run start:prod
```

## 🔍 Monitoring

- Health check: `GET /health`
- Metrics: Redis queue dashboard
- Logs: Structured logging với Winston

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License