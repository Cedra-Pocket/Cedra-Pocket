"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const game_controller_1 = require("./game.controller");
const pet_service_1 = require("./services/pet.service");
const energy_service_1 = require("./services/energy.service");
const game_cycle_service_1 = require("./services/game-cycle.service");
const game_session_service_1 = require("./services/game-session.service");
const ranking_service_1 = require("./services/ranking.service");
let GameModule = class GameModule {
};
exports.GameModule = GameModule;
exports.GameModule = GameModule = __decorate([
    (0, common_1.Module)({
        providers: [
            pet_service_1.PetService,
            energy_service_1.EnergyService,
            game_cycle_service_1.GameCycleService,
            game_session_service_1.GameSessionService,
            ranking_service_1.RankingService,
        ],
        controllers: [game_controller_1.GameController],
        exports: [
            pet_service_1.PetService,
            energy_service_1.EnergyService,
            game_cycle_service_1.GameCycleService,
            game_session_service_1.GameSessionService,
            ranking_service_1.RankingService,
        ],
    })
], GameModule);
//# sourceMappingURL=game.module.js.map