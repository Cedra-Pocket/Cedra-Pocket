# Cedra OnChain Backend

Backend service để tương tác với smart contract CedraMiniApp trên Cedra blockchain.

## Tính năng chính

- **Treasury Management**: Quản lý kho bạc và deposit funds
- **Rewards System**: Xử lý claim rewards với signature verification
- **Account Balance**: Kiểm tra số dư tài khoản
- **Transaction Status**: Theo dõi trạng thái giao dịch

## Cấu trúc dự án

```
Back-end-OnChain/
├── src/
│   ├── config/
│   │   └── blockchain.ts      # Cấu hình blockchain từ Move.toml
│   ├── services/
│   │   └── CedraContractService.ts  # Service tương tác với contract
│   ├── controllers/
│   │   └── GameController.ts  # Controller xử lý business logic
│   └── index.ts              # Entry point của ứng dụng
├── .env.example              # File cấu hình mẫu
├── package.json
├── tsconfig.json
├── test-contract.js          # Script test API
└── README.md
```

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cấu hình các biến môi trường trong `.env`:
```
CEDRA_NETWORK_URL=https://rpc.cedra.network
PRIVATE_KEY=your_private_key_here
PORT=3001
NODE_ENV=development
```

## Chạy ứng dụng

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Kiểm tra trạng thái server

### Treasury Management
- `POST /treasury/initialize` - Khởi tạo treasury
  ```json
  {
    "seed": "cedra_gamefi_treasury_v1" // optional
  }
  ```

- `POST /treasury/deposit` - Deposit funds vào treasury
  ```json
  {
    "amount": 1000000000 // amount in octas (1 CEDRA = 100000000 octas)
  }
  ```

- `GET /treasury/balance/:adminAddress?` - Lấy số dư treasury
- `GET /treasury/status/:adminAddress?` - Lấy trạng thái treasury

### Rewards Management
- `POST /rewards/initialize` - Khởi tạo rewards system
  ```json
  {
    "serverPublicKey": "0x..." // hex format public key
  }
  ```

- `POST /rewards/claim` - Claim reward với signature
  ```json
  {
    "userAddress": "0x...",
    "amount": 1000000000,
    "nonce": 1,
    "signature": "0x...",
    "adminAddress": "0x..." // optional
  }
  ```

- `GET /rewards/nonce/:nonce/:adminAddress?` - Kiểm tra nonce đã sử dụng
- `GET /rewards/status/:adminAddress?` - Lấy trạng thái rewards system
- `POST /rewards/pause` - Pause/unpause rewards system
  ```json
  {
    "paused": true,
    "adminAddress": "0x..." // optional
  }
  ```

### Account Management
- `GET /player/:address/balance` - Lấy số dư tài khoản

### Transaction
- `GET /transaction/:txHash/status` - Kiểm tra trạng thái giao dịch

## Cấu hình Contract

Thông tin contract được lấy từ `Contract/Move.toml`:
- **Package Name**: CedraMiniApp
- **Contract Address**: 79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe
- **Admin Address**: 79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe

## SDK Integration

Backend sử dụng `@cedra-labs/ts-sdk` để tương tác với Cedra blockchain:

```typescript
import { Account, Aptos, AptosConfig, Network } from '@cedra-labs/ts-sdk';

// Initialize client
const config = new AptosConfig({ 
    network: Network.CUSTOM,
    fullnode: BLOCKCHAIN_CONFIG.NETWORK_URL
});
const client = new Aptos(config);

// Initialize account from private key
const account = Account.fromPrivateKey({
    privateKey: BLOCKCHAIN_CONFIG.PRIVATE_KEY
});
```

## Testing

1. Chạy server:
```bash
npm run dev
```

2. Test API endpoints:
```bash
node test-contract.js
```

## Workflow sử dụng

### 1. Khởi tạo hệ thống
```bash
# 1. Initialize Treasury
curl -X POST http://localhost:3001/treasury/initialize \
  -H "Content-Type: application/json" \
  -d '{"seed": "cedra_gamefi_treasury_v1"}'

# 2. Initialize Rewards
curl -X POST http://localhost:3001/rewards/initialize \
  -H "Content-Type: application/json" \
  -d '{"serverPublicKey": "0x..."}'

# 3. Deposit funds to treasury
curl -X POST http://localhost:3001/treasury/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000000000}'
```

### 2. Claim rewards
```bash
curl -X POST http://localhost:3001/rewards/claim \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x...",
    "amount": 100000000,
    "nonce": 1,
    "signature": "0x..."
  }'
```

### 3. Kiểm tra trạng thái
```bash
# Check treasury status
curl http://localhost:3001/treasury/status

# Check rewards status
curl http://localhost:3001/rewards/status

# Check account balance
curl http://localhost:3001/player/0x.../balance
```

## Error Handling

Backend xử lý các lỗi phổ biến:
- **Contract not initialized**: Cần initialize treasury/rewards trước
- **Insufficient balance**: Không đủ số dư trong treasury
- **Invalid signature**: Signature không hợp lệ
- **Nonce used**: Nonce đã được sử dụng
- **System paused**: Hệ thống đang tạm dừng

## Security Notes

1. **Private Key**: Không bao giờ commit private key vào git
2. **Server Public Key**: Đảm bảo server private key được bảo mật
3. **Admin Functions**: Chỉ admin mới có thể gọi các functions quản lý
4. **Nonce Management**: Server phải track nonces để tránh replay attacks
5. **Signature Verification**: Tất cả rewards đều cần signature hợp lệ

## Troubleshooting

### Common Issues:

1. **SDK Import Error**: Đảm bảo `@cedra-labs/ts-sdk` version 2.2.8+
2. **Connection Failed**: Kiểm tra CEDRA_NETWORK_URL và network connection
3. **Account Not Found**: Đảm bảo private key hợp lệ và account có funds
4. **Contract Call Failed**: Kiểm tra contract đã được deploy và initialized

### Debug Commands:

```bash
# Check account balance
curl http://localhost:3001/player/79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe/balance

# Check transaction status
curl http://localhost:3001/transaction/0x.../status
```

## Next Steps

Sau khi setup thành công:
1. Integrate với frontend application
2. Setup monitoring cho contract events
3. Implement proper key management cho server
4. Add rate limiting và security measures
5. Setup automated testing và CI/CD