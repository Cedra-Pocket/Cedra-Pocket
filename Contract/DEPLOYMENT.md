# Cedra GameFi Contract Deployment Guide

## Tổng quan

Contract CedraMiniApp bao gồm 3 modules chính:
- **errors**: Quản lý error codes
- **treasury**: Quản lý treasury và coin transfers
- **rewards**: Xử lý claim rewards với signature verification

## Yêu cầu

1. **Cedra CLI** đã được cài đặt và cấu hình
2. **Private Key** của account admin
3. **Server Public Key** cho signature verification
4. **Cedra Coins** để deposit vào treasury (tùy chọn)

## Bước 1: Compile và Test

```bash
# Compile contract
cedra move compile

# Run tests
cedra move test
```

## Bước 2: Deploy Contract

### Linux/Mac:
```bash
# Set environment variables
export PRIVATE_KEY="your_private_key_here"
export NETWORK="testnet"  # hoặc "mainnet"

# Run deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Windows:
```cmd
# Set environment variables
set PRIVATE_KEY=your_private_key_here
set NETWORK=testnet

# Run deployment script
scripts\deploy.bat
```

## Bước 3: Initialize Modules

Sau khi deploy thành công, cần initialize Treasury và Rewards:

### Linux/Mac:
```bash
# Set required variables
export PRIVATE_KEY="your_private_key_here"
export CONTRACT_ADDRESS="deployed_contract_address"
export SERVER_PUBLIC_KEY="your_server_public_key_hex"
export NETWORK="testnet"
export INITIAL_DEPOSIT="1000000000"  # Optional: 10 CEDRA (8 decimals)

# Run initialization script
chmod +x scripts/initialize.sh
./scripts/initialize.sh
```

### Windows:
```cmd
# Set required variables
set PRIVATE_KEY=your_private_key_here
set CONTRACT_ADDRESS=deployed_contract_address
set SERVER_PUBLIC_KEY=your_server_public_key_hex
set NETWORK=testnet
set INITIAL_DEPOSIT=1000000000

# Run initialization script
scripts\initialize.bat
```

## Bước 4: Verify Deployment

Sau khi deploy và initialize, kiểm tra:

```bash
# Check Treasury status
cedra move view \
    --function-id ${CONTRACT_ADDRESS}::treasury::is_initialized \
    --args address:${ADMIN_ADDRESS} \
    --url ${NETWORK_URL}

# Check Rewards status
cedra move view \
    --function-id ${CONTRACT_ADDRESS}::rewards::is_initialized \
    --args address:${ADMIN_ADDRESS} \
    --url ${NETWORK_URL}

# Check Treasury balance
cedra move view \
    --function-id ${CONTRACT_ADDRESS}::treasury::get_balance \
    --args address:${ADMIN_ADDRESS} \
    --url ${NETWORK_URL}
```

## Environment Variables

### Required for Deployment:
- `PRIVATE_KEY`: Private key của admin account
- `NETWORK`: "testnet" hoặc "mainnet"

### Required for Initialization:
- `PRIVATE_KEY`: Private key của admin account
- `CONTRACT_ADDRESS`: Address của contract đã deploy
- `SERVER_PUBLIC_KEY`: Public key (hex format) cho signature verification
- `NETWORK`: "testnet" hoặc "mainnet"

### Optional:
- `TREASURY_SEED`: Seed cho treasury resource account (default: "cedra_gamefi_treasury_v1")
- `INITIAL_DEPOSIT`: Số CEDRA để deposit ban đầu (đơn vị: octas, 1 CEDRA = 100000000 octas)

## Network URLs

- **Testnet**: https://fullnode.testnet.cedra.network
- **Mainnet**: https://fullnode.mainnet.cedra.network

## Contract Functions

### Treasury Functions:
- `initialize(seed)`: Initialize treasury
- `deposit(amount)`: Deposit CEDRA vào treasury
- `emergency_withdraw()`: Withdraw tất cả funds (admin only)

### Rewards Functions:
- `initialize(server_public_key)`: Initialize rewards system
- `claim_reward(admin_address, amount, nonce, signature)`: Claim reward
- `set_pause(admin_address, paused)`: Pause/unpause system
- `update_public_key(admin_address, new_public_key)`: Update server public key

## Troubleshooting

### Common Issues:

1. **Compilation Error**: Kiểm tra syntax và dependencies trong Move.toml
2. **Publishing Failed**: Kiểm tra private key và network connection
3. **Initialization Failed**: Đảm bảo contract đã được deploy thành công
4. **Insufficient Balance**: Đảm bảo admin account có đủ CEDRA cho gas fees

### Debug Commands:

```bash
# Check account balance
cedra account balance --account ${ADMIN_ADDRESS}

# Check transaction status
cedra transaction show --transaction-hash ${TX_HASH}
```

## Security Notes

1. **Private Key**: Không bao giờ commit private key vào git
2. **Server Public Key**: Đảm bảo server private key được bảo mật
3. **Admin Functions**: Chỉ admin mới có thể gọi các functions quản lý
4. **Nonce Management**: Server phải track nonces để tránh replay attacks

## Next Steps

Sau khi deploy thành công:
1. Cập nhật `CONTRACT_ADDRESS` trong backend config
2. Test các functions với backend
3. Setup monitoring cho contract events
4. Implement proper key management cho server