# 🔗 Hướng dẫn kết nối Backend và Frontend

## Tổng quan

Backend (NestJS) và Frontend (Next.js) đã được kết nối thông qua:
- **Backend API Service** (`frontend/src/services/backend-api.service.ts`)
- **TelegramProvider** đã tích hợp authentication với backend
- **QuestScreen** đã kết nối với backend API

## Cách chạy

### 1. Chạy Backend

```bash
cd cedra-quest-backend
npm install
npm run start:dev
```

Backend sẽ chạy tại: `http://localhost:9999`

### 2. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## Cấu hình

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
TELEGRAM_BOT_TOKEN="your-bot-token"
JWT_SECRET="your-secret-key"
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:9999
NEXT_PUBLIC_BOT_USERNAME=cedra_quest_bot
```

## API Endpoints đã kết nối

| Frontend Action | Backend Endpoint | Mô tả |
|----------------|------------------|-------|
| Login | `POST /auth/verify` | Xác thực Telegram initData |
| Get Profile | `GET /users/profile` | Lấy thông tin user |
| Get Quests | `GET /quests` | Lấy danh sách quest |
| Verify Quest | `POST /quests/:id/verify` | Verify và hoàn thành quest |
| Connect Wallet | `POST /users/connect-wallet` | Kết nối ví blockchain |

## Luồng Authentication

```
1. User mở Mini App trong Telegram
2. TelegramProvider lấy initData từ Telegram SDK
3. Gửi initData lên backend /auth/verify
4. Backend validate với Bot Token
5. Tạo/tìm user trong DB
6. Trả về JWT token
7. Frontend lưu token và sử dụng cho các request sau
```

## Luồng Quest

```
1. QuestScreen load quests từ backend
2. User click "Verify" trên quest
3. Frontend gọi POST /quests/:id/verify
4. Backend verify (Social/Onchain)
5. Nếu thành công: update status, queue reward
6. Frontend update UI và balance
```

## Test API

### Test không cần auth:
```bash
# Health check
curl http://localhost:9999/health

# Get test quests
curl http://localhost:9999/test/quests
```

### Test với auth (cần JWT):
```bash
# Get quests
curl http://localhost:9999/quests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Verify quest
curl -X POST http://localhost:9999/quests/1/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"proof_data": {}}'
```

## Files đã thay đổi

### Frontend
- `frontend/.env.local` - Cấu hình API URL
- `frontend/src/services/backend-api.service.ts` - Backend API client
- `frontend/src/hooks/useAuth.ts` - Authentication hook
- `frontend/src/hooks/useQuests.ts` - Quests hook
- `frontend/src/components/providers/TelegramProvider.tsx` - Tích hợp auth
- `frontend/src/components/quest/QuestScreen.tsx` - Kết nối backend

### Backend
- `cedra-quest-backend/src/main.ts` - Cập nhật CORS

## Troubleshooting

### CORS Error
- Kiểm tra frontend URL đã được thêm vào CORS config trong `main.ts`
- Restart backend sau khi thay đổi

### Authentication Failed
- Kiểm tra `TELEGRAM_BOT_TOKEN` trong backend .env
- Đảm bảo mở app trong Telegram (không phải browser thường)

### Quests không load
- Kiểm tra backend đang chạy
- Kiểm tra `NEXT_PUBLIC_API_URL` trong frontend .env.local
- Xem console log để debug
