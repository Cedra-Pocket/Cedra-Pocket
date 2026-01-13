import { Controller, Get, Put, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PetsService } from './pets.service';
import { UpdatePetDto, ClaimCoinsDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  async getPet(@Req() req: any) {
    const userId = BigInt(req.user.id);
    return this.petsService.getPet(userId);
  }

  @Put()
  async updatePet(@Req() req: any, @Body() updatePetDto: UpdatePetDto) {
    const userId = BigInt(req.user.id);
    return this.petsService.updatePet(userId, updatePetDto);
  }

  @Post('claim')
  async claimCoins(@Req() req: any, @Body() claimCoinsDto: ClaimCoinsDto) {
    const userId = BigInt(req.user.id);
    return this.petsService.claimCoins(userId, claimCoinsDto.coins);
  }
}
