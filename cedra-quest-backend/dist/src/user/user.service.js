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
    safeToBigInt(userId) {
        if (!/^\d+$/.test(userId)) {
            let hash = 0;
            for (let i = 0; i < userId.length; i++) {
                const char = userId.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return BigInt(Math.abs(hash) + 1000000000);
        }
        return BigInt(userId);
    }
    async createUser(userData) {
        try {
            this.logger.log(`🆕 Creating new user: telegram_id=${userData.telegram_id}, username=${userData.username}`);
            const tempWalletAddress = `temp_${userData.telegram_id}_${Date.now()}`;
            const tempPublicKey = `temp_pk_${userData.telegram_id}_${Date.now()}`;
            this.logger.log(`🔑 Generated temp wallet: ${tempWalletAddress}`);
            const user = await this.prisma.users.create({
                data: {
                    telegram_id: this.safeToBigInt(userData.telegram_id),
                    wallet_address: tempWalletAddress,
                    public_key: tempPublicKey,
                    username: userData.username || null,
                    total_points: userData.total_points || 0,
                    current_rank: 'BRONZE',
                    level: 1,
                    current_xp: 0,
                    is_wallet_connected: false,
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
            this.logger.log(`✅ User created successfully in database: ${user.telegram_id.toString()}`);
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
            this.logger.error(`❌ Failed to create user: ${userData.telegram_id}`, error);
            throw error;
        }
    }
    async findUserByTelegramId(telegramId) {
        try {
            const user = await this.prisma.users.findUnique({
                where: {
                    telegram_id: this.safeToBigInt(telegramId),
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
                    telegram_id: this.safeToBigInt(telegramId),
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