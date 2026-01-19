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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = UserService_1 = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async findUserByTelegramId(telegramId) {
        try {
            const user = await this.prisma.users.findUnique({
                where: {
                    telegram_id: BigInt(telegramId),
                },
                select: {
                    telegram_id: true,
                    wallet_address: true,
                    username: true,
                    total_points: true,
                    level: true,
                    current_xp: true,
                    current_rank: true,
                    created_at: true,
                },
            });
            if (!user) {
                return null;
            }
            return {
                telegram_id: user.telegram_id.toString(),
                wallet_address: user.wallet_address,
                username: user.username,
                total_points: Number(user.total_points),
                level: user.level,
                current_xp: user.current_xp,
                current_rank: user.current_rank,
                created_at: user.created_at,
            };
        }
        catch (error) {
            this.logger.error(`Failed to find user by Telegram ID: ${telegramId}`, error);
            throw error;
        }
    }
    async getUserProfile(telegramId) {
        try {
            const user = await this.prisma.users.findUnique({
                where: {
                    telegram_id: BigInt(telegramId),
                },
                include: {
                    pet: true,
                },
            });
            if (!user) {
                return null;
            }
            return {
                telegram_id: user.telegram_id.toString(),
                wallet_address: user.wallet_address,
                username: user.username,
                total_points: Number(user.total_points),
                level: user.level,
                current_xp: user.current_xp,
                current_rank: user.current_rank,
                created_at: user.created_at,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get user profile: ${telegramId}`, error);
            throw error;
        }
    }
    async checkWalletAddressExists(walletAddress) {
        try {
            const user = await this.prisma.users.findUnique({
                where: {
                    wallet_address: walletAddress,
                },
                select: {
                    telegram_id: true,
                },
            });
            return !!user;
        }
        catch (error) {
            this.logger.error(`Failed to check wallet address: ${walletAddress}`, error);
            throw error;
        }
    }
    async findUserByPublicKey(publicKey) {
        try {
            const user = await this.prisma.users.findFirst({
                where: {
                    public_key: publicKey,
                },
                select: {
                    telegram_id: true,
                    wallet_address: true,
                    username: true,
                    total_points: true,
                    level: true,
                    current_xp: true,
                    current_rank: true,
                    created_at: true,
                },
            });
            if (!user) {
                return null;
            }
            return {
                telegram_id: user.telegram_id.toString(),
                wallet_address: user.wallet_address,
                username: user.username,
                total_points: Number(user.total_points),
                level: user.level,
                current_xp: user.current_xp,
                current_rank: user.current_rank,
                created_at: user.created_at,
            };
        }
        catch (error) {
            this.logger.error(`Failed to find user by public key`, error);
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map