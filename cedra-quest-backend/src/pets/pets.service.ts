import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async getPet(userId: bigint) {
    let pet = await this.prisma.pets.findUnique({
      where: { user_id: userId },
    });

    // Create pet if not exists
    if (!pet) {
      pet = await this.prisma.pets.create({
        data: {
          user_id: userId,
          level: 1,
          exp: 0,
          max_exp: 100,
          hunger: 50,
          happiness: 50,
          last_coin_time: new Date(),
          pending_coins: 0,
        },
      });
    }

    return this.formatPet(pet);
  }

  async updatePet(userId: bigint, updatePetDto: UpdatePetDto) {
    const data: any = {};
    
    if (updatePetDto.level !== undefined) data.level = updatePetDto.level;
    if (updatePetDto.exp !== undefined) data.exp = updatePetDto.exp;
    if (updatePetDto.maxExp !== undefined) data.max_exp = updatePetDto.maxExp;
    if (updatePetDto.hunger !== undefined) data.hunger = updatePetDto.hunger;
    if (updatePetDto.happiness !== undefined) data.happiness = updatePetDto.happiness;
    if (updatePetDto.lastCoinTime !== undefined) data.last_coin_time = new Date(updatePetDto.lastCoinTime);
    if (updatePetDto.pendingCoins !== undefined) data.pending_coins = updatePetDto.pendingCoins;
    
    data.updated_at = new Date();

    const pet = await this.prisma.pets.upsert({
      where: { user_id: userId },
      update: data,
      create: {
        user_id: userId,
        level: updatePetDto.level ?? 1,
        exp: updatePetDto.exp ?? 0,
        max_exp: updatePetDto.maxExp ?? 100,
        hunger: updatePetDto.hunger ?? 50,
        happiness: updatePetDto.happiness ?? 50,
        last_coin_time: updatePetDto.lastCoinTime ? new Date(updatePetDto.lastCoinTime) : new Date(),
        pending_coins: updatePetDto.pendingCoins ?? 0,
      },
    });

    return this.formatPet(pet);
  }

  async claimCoins(userId: bigint, coins: number) {
    // Update pet - reset pending coins and update last coin time
    const pet = await this.prisma.pets.update({
      where: { user_id: userId },
      data: {
        pending_coins: 0,
        last_coin_time: new Date(),
        updated_at: new Date(),
      },
    });

    // Add coins to user's total points
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        total_points: { increment: coins },
        updated_at: new Date(),
      },
    });

    return this.formatPet(pet);
  }

  private formatPet(pet: any) {
    return {
      level: pet.level,
      exp: pet.exp,
      maxExp: pet.max_exp,
      hunger: pet.hunger,
      happiness: pet.happiness,
      lastCoinTime: pet.last_coin_time.getTime(),
      pendingCoins: pet.pending_coins,
    };
  }
}
