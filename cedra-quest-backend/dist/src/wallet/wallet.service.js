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
var WalletService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WalletService = WalletService_1 = class WalletService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WalletService_1.name);
    }
    async createUserWallet(walletData) {
        try {
            const existingWallet = await this.prisma.users.findUnique({
                where: {
                    wallet_address: walletData.requested_address,
                },
            });
            if (existingWallet) {
                return {
                    success: false,
                    error: 'Wallet address already exists',
                };
            }
            const existingUser = await this.prisma.users.findUnique({
                where: {
                    telegram_id: BigInt(walletData.telegram_id),
                },
            });
            if (existingUser) {
                return {
                    success: false,
                    error: 'User already has a wallet',
                };
            }
            const newUser = await this.prisma.users.create({
                data: {
                    telegram_id: BigInt(walletData.telegram_id),
                    wallet_address: walletData.requested_address,
                    public_key: walletData.public_key,
                    is_wallet_connected: true,
                },
            });
            this.logger.log(`Created wallet for user: ${walletData.telegram_id}, address: ${walletData.requested_address}`);
            return {
                success: true,
                wallet_address: newUser.wallet_address,
            };
        }
        catch (error) {
            this.logger.error('Failed to create user wallet', error);
            return {
                success: false,
                error: 'Failed to create wallet in database',
            };
        }
    }
    async saveUserWalletMapping(mapping) {
        try {
            await this.prisma.users.upsert({
                where: {
                    telegram_id: BigInt(mapping.telegram_id),
                },
                update: {
                    wallet_address: mapping.wallet_address,
                    public_key: mapping.public_key,
                    updated_at: new Date(),
                },
                create: {
                    telegram_id: BigInt(mapping.telegram_id),
                    wallet_address: mapping.wallet_address,
                    public_key: mapping.public_key,
                    is_wallet_connected: true,
                },
            });
            this.logger.log(`Saved wallet mapping for user: ${mapping.telegram_id}`);
        }
        catch (error) {
            this.logger.error('Failed to save wallet mapping', error);
            throw error;
        }
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = WalletService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map