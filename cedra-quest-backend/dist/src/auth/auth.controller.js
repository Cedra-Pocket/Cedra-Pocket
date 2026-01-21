"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("../common/dto/auth.dto");
let AuthController = AuthController_1 = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async verify(authDto) {
        this.logger.log('Verify attempt received');
        const result = await this.authService.verifyAndCreateUser(authDto.initData);
        if (!result.success) {
            this.logger.warn(`Verify failed: ${result.error}`);
            return result;
        }
        if (result.user) {
            this.logger.log(`User verified/created: ${result.user.telegram_id}`);
            return {
                access_token: 'mock_jwt_token',
                user: result.user,
            };
        }
        return result;
    }
    async login(authDto) {
        this.logger.log('Login attempt received');
        const result = await this.authService.authenticateUser(authDto.initData);
        if (!result.success) {
            this.logger.warn(`Login failed: ${result.error}`);
        }
        else if (result.user) {
            this.logger.log(`User logged in: ${result.user.telegram_id}`);
        }
        else {
            this.logger.log('New user detected, wallet name suggested');
        }
        return result;
    }
    async createWallet(walletDto) {
        this.logger.log(`Wallet creation request for user: ${walletDto.telegram_id}`);
        const result = await this.authService.createWallet(walletDto);
        if (result.success) {
            this.logger.log(`Wallet created successfully: ${result.wallet_address}`);
        }
        else {
            this.logger.warn(`Wallet creation failed: ${result.error}`);
        }
        return result;
    }
    async recoverWallet(recoveryDto) {
        this.logger.log('Wallet recovery attempt');
        const result = await this.authService.recoverWallet(recoveryDto);
        if (result.success) {
            this.logger.log(`Wallet recovered for user: ${result.user?.telegram_id}`);
        }
        else {
            this.logger.warn(`Wallet recovery failed: ${result.error}`);
        }
        return result;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.TelegramAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.TelegramAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('create-wallet'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.WalletCreationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createWallet", null);
__decorate([
    (0, common_1.Post)('recover-wallet'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.WalletRecoveryDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "recoverWallet", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map