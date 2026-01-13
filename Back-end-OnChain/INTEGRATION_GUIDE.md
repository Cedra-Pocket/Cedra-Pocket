# Hướng dẫn tích hợp Cedra SDK

## Tình trạng hiện tại

Code hiện tại đã được tạo với cấu trúc cơ bản và xử lý lỗi đúng cách. Tuy nhiên, các phương thức SDK đang sử dụng placeholder vì cần tài liệu chính thức từ `@cedra-labs/ts-sdk`.

## Cần cập nhật

### 1. Kiểm tra SDK Documentation

Trước tiên, cần kiểm tra tài liệu chính thức của `@cedra-labs/ts-sdk` để biết:
- Các class và method chính xác
- Cách khởi tạo client
- Cách tạo và ký transaction
- Cách gọi view functions

### 2. Cập nhật CedraContractService.ts

Trong file `src/services/CedraContractService.ts`, cần thay thế các placeholder bằng SDK calls thực tế:

```typescript
// Thay vì:
const result = {
  hash: `0x${Math.random().toString(16).substr(2, 64)}`,
  success: true,
  payload
};

// Sử dụng SDK thực tế:
const transaction = await this.client.generateTransaction(payload);
const signedTx = await this.client.signTransaction(transaction);
const result = await this.client.submitTransaction(signedTx);
```

### 3. Cấu hình Environment

Đảm bảo file `.env` có đầy đủ thông tin:
```
CEDRA_NETWORK_URL=https://rpc.cedra.network
PRIVATE_KEY=your_actual_private_key
PORT=3001
```

### 4. Test với Contract thực tế

Sau khi có SDK documentation, cần test với contract đã deploy:
- Contract Address: `79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe`
- Package Name: `CedraMiniApp`

## Các bước tiếp theo

1. **Đọc SDK docs**: Tìm hiểu API của `@cedra-labs/ts-sdk`
2. **Cập nhật imports**: Sử dụng đúng class names từ SDK
3. **Implement methods**: Thay thế placeholder bằng SDK calls
4. **Test functions**: Kiểm tra từng function với contract thực
5. **Error handling**: Cập nhật error handling cho SDK errors

## Ví dụ cấu trúc SDK (cần xác nhận)

```typescript
import { CedraClient, Account, Transaction } from '@cedra-labs/ts-sdk';

// Khởi tạo
const client = new CedraClient(networkUrl);
const account = Account.fromPrivateKey(privateKey);

// Gọi function
const payload = {
  function: "address::module::function_name",
  arguments: [arg1, arg2],
  type_arguments: []
};

const tx = await client.generateTransaction(account.address(), payload);
const signedTx = await client.signTransaction(account, tx);
const result = await client.submitTransaction(signedTx);
```

## Lưu ý quan trọng

- Code hiện tại đã có cấu trúc tốt và error handling đúng
- Chỉ cần cập nhật phần SDK integration
- Tất cả API endpoints đã sẵn sàng để test
- Contract addresses đã được cấu hình từ Move.toml