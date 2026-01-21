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
var GameSessionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const energy_service_1 = require("./energy.service");
const game_constants_1 = require("../../common/constants/game.constants");
let GameSessionService = GameSessionService_1 = class GameSessionService {
    constructor(prisma, energyService) {
        this.prisma = prisma;
        this.energyService = energyService;
        this.logger = new common_1.Logger(GameSessionService_1.name);
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
    async startGameSession(userId, gameType) {
        try {
            const validGameTypes = ['arcade', 'puzzle', 'memory', 'reaction'];
            if (!validGameTypes.includes(gameType)) {
                throw new common_1.BadRequestException('Invalid game type');
            }
            const recentGames = await this.prisma.game_sessions.count({
                where: {
                    user_id: this.safeToBigInt(userId),
                    created_at: {
                        gte: new Date(Date.now() - 60 * 1000),
                    },
                },
            });
            if (recentGames >= game_constants_1.ANTI_CHEAT.MAX_GAMES_PER_MINUTE) {
                return {
                    success: false,
                    energyUsed: 0,
                    error: 'Too many games played recently, please wait',
                };
            }
            await this.energyService.consumeEnergy(userId, 1);
            this.logger.log(`User ${userId} started ${gameType} game session`);
            return {
                success: true,
                energyUsed: 1,
            };
        }
        catch (error) {
            this.logger.error(`Failed to start game session for user ${userId}`, error);
            if (error.message === 'Insufficient energy') {
                return {
                    success: false,
                    energyUsed: 0,
                    error: 'Insufficient energy to play game',
                };
            }
            throw error;
        }
    }
    async completeGameSession(userId, request) {
        try {
            const { gameType, score, duration } = request;
            if (score < 0) {
                throw new common_1.BadRequestException('Invalid score');
            }
            if (duration && (duration < game_constants_1.ANTI_CHEAT.MIN_GAME_DURATION || duration > game_constants_1.GAME_CONSTANTS.MAX_GAME_DURATION)) {
                throw new common_1.BadRequestException('Invalid game duration');
            }
            const basePoints = game_constants_1.GAME_CONSTANTS.BASE_POINTS_PER_GAME;
            const scoreBonus = Math.floor(score * game_constants_1.GAME_CONSTANTS.SCORE_MULTIPLIER);
            const pointsEarned = basePoints + scoreBonus;
            return await this.prisma.$transaction(async (tx) => {
                const user = await tx.users.findUnique({
                    where: { telegram_id: this.safeToBigInt(userId) },
                    select: {
                        total_points: true,
                        lifetime_points: true,
                    },
                });
                if (!user) {
                    throw new common_1.BadRequestException('User not found');
                }
                const newTotalPoints = Number(user.total_points) + pointsEarned;
                const newLifetimePoints = Number(user.lifetime_points) + pointsEarned;
                await tx.users.update({
                    where: { telegram_id: this.safeToBigInt(userId) },
                    data: {
                        total_points: newTotalPoints,
                        lifetime_points: newLifetimePoints,
                        updated_at: new Date(),
                    },
                });
                await tx.game_sessions.create({
                    data: {
                        user_id: this.safeToBigInt(userId),
                        game_type: gameType,
                        score,
                        points_earned: pointsEarned,
                        energy_used: 1,
                        duration: duration || null,
                    },
                });
                const energyStatus = await this.energyService.getEnergyStatus(userId);
                this.logger.log(`User ${userId} completed ${gameType} game: score ${score}, earned ${pointsEarned} points`);
                return {
                    success: true,
                    pointsEarned,
                    energyUsed: 1,
                    newEnergyLevel: energyStatus.currentEnergy,
                    newTotalPoints,
                };
            });
        }
        catch (error) {
            this.logger.error(`Failed to complete game session for user ${userId}`, error);
            throw error;
        }
    }
    async getGameStats(userId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const [totalStats, todayStats, gameTypeStats] = await Promise.all([
                this.prisma.game_sessions.aggregate({
                    where: { user_id: this.safeToBigInt(userId) },
                    _count: { id: true },
                    _sum: { points_earned: true, score: true },
                    _avg: { score: true },
                }),
                this.prisma.game_sessions.count({
                    where: {
                        user_id: this.safeToBigInt(userId),
                        created_at: { gte: today },
                    },
                }),
                this.prisma.game_sessions.groupBy({
                    by: ['game_type'],
                    where: { user_id: this.safeToBigInt(userId) },
                    _count: { game_type: true },
                    orderBy: { _count: { game_type: 'desc' } },
                }),
            ]);
            return {
                totalGamesPlayed: totalStats._count.id || 0,
                totalPointsEarned: totalStats._sum.points_earned || 0,
                averageScore: Math.round(totalStats._avg.score || 0),
                favoriteGameType: gameTypeStats[0]?.game_type || 'none',
                todayGamesPlayed: todayStats,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get game stats for user ${userId}`, error);
            return {
                totalGamesPlayed: 0,
                totalPointsEarned: 0,
                averageScore: 0,
                favoriteGameType: 'none',
                todayGamesPlayed: 0,
            };
        }
    }
};
exports.GameSessionService = GameSessionService;
exports.GameSessionService = GameSessionService = GameSessionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        energy_service_1.EnergyService])
], GameSessionService);
//# sourceMappingURL=game-session.service.js.map