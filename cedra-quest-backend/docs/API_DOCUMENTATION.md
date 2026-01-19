# Cedra Quest Backend API Documentation

## Base URL
```
http://localhost:3333
```

## Authentication Flow

### 1. User Login/Check
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "initData": "user=%7B%22id%22%3A123456789...&auth_date=1642680000&hash=abc123..."
}
```

**Response - Existing User:**
```json
{
  "success": true,
  "user": {
    "telegram_id": "123456789",
    "wallet_address": "john_doe.hot.tg",
    "username": "john_doe",
    "total_points": 1500,
    "level": 3,
    "current_xp": 250,
    "current_rank": "SILVER",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response - New User:**
```json
{
  "success": true,
  "suggestedWalletName": "john_doe.hot.tg"
}
```

**Response - Error:**
```json
{
  "success": false,
  "error": "Invalid Telegram signature"
}
```

### 2. Create Wallet (New Users Only)
**Endpoint:** `POST /auth/create-wallet`

**Request:**
```json
{
  "telegram_id": "123456789",
  "requested_address": "john_doe.hot.tg",
  "public_key": "0x04a1b2c3d4e5f6..."
}
```

**Response - Success:**
```json
{
  "success": true,
  "wallet_address": "john_doe.hot.tg",
  "transaction_hash": "0x1a2b3c4d5e6f..."
}
```

**Response - Error:**
```json
{
  "success": false,
  "error": "Wallet name is no longer available"
}
```

### 3. Recover Wallet
**Endpoint:** `POST /auth/recover-wallet`

**Request:**
```json
{
  "public_key": "0x04a1b2c3d4e5f6..."
}
```

**Response - Success:**
```json
{
  "success": true,
  "user": {
    "telegram_id": "123456789",
    "wallet_address": "john_doe.hot.tg",
    "username": "john_doe",
    "total_points": 1500,
    "level": 3,
    "current_xp": 250,
    "current_rank": "SILVER",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

## Frontend Implementation Requirements

### Client-Side Wallet Creation Flow

1. **Get Telegram InitData**
   ```javascript
   const initData = window.Telegram.WebApp.initData;
   ```

2. **Call Login API**
   - If `user` returned → Show dashboard
   - If `suggestedWalletName` returned → Start wallet creation

3. **Generate Seed Phrase (BIP-39)**
   ```javascript
   // Use library like 'bip39'
   const mnemonic = bip39.generateMnemonic();
   // Show 12 words to user, require backup confirmation
   ```

4. **Generate Key Pair**
   ```javascript
   // Derive keys from seed phrase
   const seed = bip39.mnemonicToSeedSync(mnemonic);
   const privateKey = derivePrivateKey(seed);
   const publicKey = derivePublicKey(privateKey);
   
   // Store private key in LocalStorage (encrypted)
   localStorage.setItem('wallet_private_key', encrypt(privateKey));
   ```

5. **Call Create Wallet API**
   ```javascript
   const response = await fetch('/auth/create-wallet', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       telegram_id: telegramUser.id,
       requested_address: suggestedWalletName,
       public_key: publicKey
     })
   });
   ```

### Security Requirements

- ⚠️ **NEVER** send private key or seed phrase to server
- ✅ Only send public key to server
- ✅ Store private key encrypted in LocalStorage
- ✅ Validate all user inputs
- ✅ Handle network errors gracefully

### Error Handling

- **Invalid Telegram signature** → Ask user to refresh/reopen app
- **Wallet name taken** → Backend will suggest new name automatically
- **Network errors** → Show retry button
- **Database errors** → Show generic error message

## Testing

Use the provided test scripts:
- `node test-real-telegram.js` - Test with real Telegram data
- `node test-api.js` - Test with mock data (development)

## Environment Variables

```env
PORT=3333
TELEGRAM_BOT_TOKEN="your_real_bot_token"
DATABASE_URL="postgresql://..."
```

## Notes for Frontend Developer

1. **Non-custodial Architecture**: Server never sees private keys
2. **BIP-39 Standard**: Use standard libraries for seed phrase generation
3. **Telegram Integration**: Get initData from Telegram WebApp API
4. **Error Recovery**: Handle all error cases gracefully
5. **User Experience**: Guide users through wallet creation step-by-step

## Support

- Check server logs for detailed error information
- Use HOW_TO_GET_REAL_INITDATA.md for Telegram setup
- Backend runs on port 3333 by default