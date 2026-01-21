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
var EnergyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const game_constants_1 = require("../../common/constants/game.constants");
let EnergyService = EnergyService_1 = class EnergyService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(EnergyService_1.name);
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
    async getEnergyStatus(userId) {
        try {
            let userEnergy = await this.prisma.user_energy.findUnique({
                where: { user_id: this.safeToBigInt(userId) },
            });
            if (!userEnergy) {
                userEnergy = await this.prisma.user_energy.create({
                    data: {
                        user_id: this.safeToBigInt(userId),
                        current_energy: game_constants_1.ENERGY_CONSTANTS.MAX_ENERGY,
                        max_energy: game_constants_1.ENERGY_CONSTANTS.MAX_ENERGY,
                        last_update: new Date(),
                    },
                });
            }
            const now = new Date();
            const timeSinceUpdate = now.getTime() - userEnergy.last_update.getTime();
            let currentEnergy = userEnergy.current_energy;
            let lastUpdate = userEnergy.last_update;
            if (currentEnergy < game_constants_1.ENERGY_CONSTANTS.REGEN_THRESHOLD) {
                const intervalsElapsed = Math.floor(timeSinceUpdate / game_constants_1.ENERGY_CONSTANTS.REGEN_INTERVAL);
                if (intervalsElapsed > 0) {
                    const energyToAdd = Math.min(intervalsElapsed, userEnergy.max_energy - currentEnergy);
                    currentEnergy = Math.min(currentEnergy + energyToAdd, userEnergy.max_energy);
                    if (energyToAdd > 0) {
                        await this.prisma.user_energy.update({
                            where: { user_id: this.safeToBigInt(userId) },
                            data: {
                                current_energy: currentEnergy,
                                last_update: now,
                            },
                        });
                        lastUpdate = now;
                    }
                }
            }
            let nextRegenTime = null;
            if (currentEnergy < userEnergy.max_energy && currentEnergy < game_constants_1.ENERGY_CONSTANTS.REGEN_THRESHOLD) {
                const timeSinceLastRegen = (now.getTime() - lastUpdate.getTime()) % game_constants_1.ENERGY_CONSTANTS.REGEN_INTERVAL;
                const timeToNextRegen = game_constants_1.ENERGY_CONSTANTS.REGEN_INTERVAL - timeSinceLastRegen;
                nextRegenTime = new Date(now.getTime() + timeToNextRegen);
            }
            let timeToFullEnergy = 0;
            if (currentEnergy < userEnergy.max_energy && currentEnergy < game_constants_1.ENERGY_CONSTANTS.REGEN_THRESHOLD) {
                const energyNeeded = userEnergy.max_energy - currentEnergy;
                const timeSinceLastRegen = (now.getTime() - lastUpdate.getTime()) % game_constants_1.ENERGY_CONSTANTS.REGEN_INTERVAL;
                const timeToNextRegen = game_constants_1.ENERGY_CONSTANTS.REGEN_INTERVAL - timeSinceLastRegen;
                timeToFullEnergy = timeToNextRegen + (energyNeeded - 1) * game_constants_1.ENERGY_CONSTANTS.REGEN_INTERVAL;
            }
            return {
                currentEnergy,
                maxEnergy: userEnergy.max_energy,
                nextRegenTime,
                timeToFullEnergy,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get energy status for user ${userId}`, error);
            throw error;
        }
    }
    async consumeEnergy(userId, amount = 1) {
        try {
            if (amount <= 0) {
                throw new common_1.BadRequestException('Energy amount must be positive');
            }
            return await this.prisma.$transaction(async (tx) => {
                const energyStatus = await this.getEnergyStatus(userId);
                if (energyStatus.currentEnergy < amount) {
                    throw new common_1.BadRequestException('Insufficient energy');
                }
                const newEnergy = energyStatus.currentEnergy - amount;
                await tx.user_energy.update({
                    where: { user_id: this.safeToBigInt(userId) },
                    data: {
                        current_energy: newEnergy,
                        last_update: new Date(),
                    },
                });
                this.logger.log(`User ${userId} consumed ${amount} energy, remaining: ${newEnergy}`);
                return await this.getEnergyStatus(userId);
            });
        }
        catch (error) {
            this.logger.error(`Failed to consume energy for user ${userId}`, error);
            throw error;
        }
    }
    async refillEnergy(userId, energyAmount) {
        try {
            const POINTS_PER_ENERGY = 10;
            const pointsCost = energyAmount * POINTS_PER_ENERGY;
            return await this.prisma.$transaction(async (tx) => {
                const user = await tx.users.findUnique({
                    where: { telegram_id: this.safeToBigInt(userId) },
                    select: { total_points: true },
                });
                if (!user) {
                    throw new common_1.BadRequestException('User not found');
                }
                if (Number(user.total_points) < pointsCost) {
                    return {
                        success: false,
                        pointsCost,
                        newEnergy: 0,
                        error: 'Insufficient points',
                    };
                }
                const energyStatus = await this.getEnergyStatus(userId);
                const maxRefill = energyStatus.maxEnergy - energyStatus.currentEnergy;
                if (energyAmount > maxRefill) {
                    return {
                        success: false,
                        pointsCost,
                        newEnergy: energyStatus.currentEnergy,
                        error: `Can only refill ${maxRefill} energy`,
                    };
                }
                await tx.users.update({
                    where: { telegram_id: this.safeToBigInt(userId) },
                    data: {
                        total_points: { decrement: pointsCost },
                        updated_at: new Date(),
                    },
                });
                const newEnergy = energyStatus.currentEnergy + energyAmount;
                await tx.user_energy.update({
                    where: { user_id: this.safeToBigInt(userId) },
                    data: {
                        current_energy: newEnergy,
                        last_update: new Date(),
                    },
                });
                this.logger.log(`User ${userId} refilled ${energyAmount} energy for ${pointsCost} points`);
                return {
                    success: true,
                    pointsCost,
                    newEnergy,
                };
            });
        }
        catch (error) {
            this.logger.error(`Failed to refill energy for user ${userId}`, error);
            throw error;
        }
    }
};
exports.EnergyService = EnergyService;
exports.EnergyService = EnergyService = EnergyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnergyService);
//# sourceMappingURL=energy.service.js.map