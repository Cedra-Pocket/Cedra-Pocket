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
var GameCycleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameCycleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const game_constants_1 = require("../../common/constants/game.constants");
let GameCycleService = GameCycleService_1 = class GameCycleService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(GameCycleService_1.name);
    }
    async getCurrentCycle() {
        try {
            const activeCycle = await this.prisma.game_cycles.findFirst({
                where: {
                    is_active: true,
                    start_date: { lte: new Date() },
                    end_date: { gte: new Date() },
                },
                orderBy: { cycle_number: 'desc' },
            });
            if (activeCycle) {
                return {
                    cycleNumber: activeCycle.cycle_number,
                    growthRate: Number(activeCycle.growth_rate),
                    maxSpeedCap: Number(activeCycle.max_speed_cap),
                    startDate: activeCycle.start_date,
                    endDate: activeCycle.end_date,
                    isActive: activeCycle.is_active,
                };
            }
            this.logger.warn('No active game cycle found, using default cycle');
            return {
                cycleNumber: game_constants_1.DEFAULT_CYCLE.cycleNumber,
                growthRate: game_constants_1.DEFAULT_CYCLE.growthRate,
                maxSpeedCap: game_constants_1.DEFAULT_CYCLE.maxSpeedCap,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: game_constants_1.DEFAULT_CYCLE.isActive,
            };
        }
        catch (error) {
            this.logger.error('Failed to get current cycle', error);
            return {
                cycleNumber: game_constants_1.DEFAULT_CYCLE.cycleNumber,
                growthRate: game_constants_1.DEFAULT_CYCLE.growthRate,
                maxSpeedCap: game_constants_1.DEFAULT_CYCLE.maxSpeedCap,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: game_constants_1.DEFAULT_CYCLE.isActive,
            };
        }
    }
    async getAllCycles() {
        try {
            const cycles = await this.prisma.game_cycles.findMany({
                orderBy: { cycle_number: 'asc' },
            });
            return cycles.map(cycle => ({
                cycleNumber: cycle.cycle_number,
                growthRate: Number(cycle.growth_rate),
                maxSpeedCap: Number(cycle.max_speed_cap),
                startDate: cycle.start_date,
                endDate: cycle.end_date,
                isActive: cycle.is_active,
            }));
        }
        catch (error) {
            this.logger.error('Failed to get all cycles', error);
            throw error;
        }
    }
    async createCycle(cycleData) {
        try {
            const cycle = await this.prisma.game_cycles.create({
                data: {
                    cycle_number: cycleData.cycleNumber,
                    growth_rate: cycleData.growthRate,
                    max_speed_cap: cycleData.maxSpeedCap,
                    start_date: cycleData.startDate,
                    end_date: cycleData.endDate,
                    is_active: false,
                },
            });
            this.logger.log(`Created new game cycle: ${cycle.cycle_number}`);
            return {
                cycleNumber: cycle.cycle_number,
                growthRate: Number(cycle.growth_rate),
                maxSpeedCap: Number(cycle.max_speed_cap),
                startDate: cycle.start_date,
                endDate: cycle.end_date,
                isActive: cycle.is_active,
            };
        }
        catch (error) {
            this.logger.error('Failed to create cycle', error);
            throw error;
        }
    }
    async activateCycle(cycleNumber) {
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.game_cycles.updateMany({
                    where: { is_active: true },
                    data: { is_active: false },
                });
                await tx.game_cycles.update({
                    where: { cycle_number: cycleNumber },
                    data: { is_active: true },
                });
            });
            this.logger.log(`Activated game cycle: ${cycleNumber}`);
        }
        catch (error) {
            this.logger.error(`Failed to activate cycle ${cycleNumber}`, error);
            throw error;
        }
    }
};
exports.GameCycleService = GameCycleService;
exports.GameCycleService = GameCycleService = GameCycleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GameCycleService);
//# sourceMappingURL=game-cycle.service.js.map