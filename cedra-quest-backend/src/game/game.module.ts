import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { GameController } from './game.controller';
import { PetService } from './services/pet.service';
import { EnergyService } from './services/energy.service';
import { GameCycleService } from './services/game-cycle.service';
import { GameSessionService } from './services/game-session.service';
import { RankingService } from './services/ranking.service';

@Module({
  imports: [PrismaModule, BlockchainModule],
  providers: [
    PetService,
    EnergyService,
    GameCycleService,
    GameSessionService,
    RankingService,
  ],
  controllers: [GameController],
  exports: [
    PetService,
    EnergyService,
    GameCycleService,
    GameSessionService,
    RankingService,
  ],
})
export class GameModule {}