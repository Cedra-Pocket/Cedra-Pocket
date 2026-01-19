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
var WalletNameService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletNameService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
let WalletNameService = WalletNameService_1 = class WalletNameService {
    constructor(userService) {
        this.userService = userService;
        this.logger = new common_1.Logger(WalletNameService_1.name);
        this.WALLET_SUFFIX = '.hot.tg';
    }
    async generateSuggestedWalletName(telegramUser) {
        try {
            let baseName = telegramUser.username || `user_${telegramUser.id}`;
            baseName = this.cleanBaseName(baseName);
            let suggestedName = `${baseName}${this.WALLET_SUFFIX}`;
            let suffix = 0;
            while (await this.isWalletNameTaken(suggestedName)) {
                suffix++;
                suggestedName = `${baseName}_${suffix}${this.WALLET_SUFFIX}`;
                if (suffix > 1000) {
                    const timestamp = Date.now();
                    suggestedName = `user_${timestamp}${this.WALLET_SUFFIX}`;
                    break;
                }
            }
            this.logger.log(`Generated wallet name: ${suggestedName} for user: ${telegramUser.id}`);
            return suggestedName;
        }
        catch (error) {
            this.logger.error('Failed to generate wallet name', error);
            const timestamp = Date.now();
            return `user_${timestamp}${this.WALLET_SUFFIX}`;
        }
    }
    async isWalletNameTaken(walletName) {
        try {
            const existsInDb = await this.userService.checkWalletAddressExists(walletName);
            if (existsInDb) {
                return true;
            }
            return false;
        }
        catch (error) {
            this.logger.error(`Failed to check wallet name availability: ${walletName}`, error);
            return true;
        }
    }
    cleanBaseName(baseName) {
        return baseName
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '')
            .replace(/_{2,}/g, '_')
            .replace(/^_|_$/g, '')
            .substring(0, 20);
    }
    validateWalletNameFormat(walletName) {
        if (!walletName.endsWith(this.WALLET_SUFFIX)) {
            return false;
        }
        const baseName = walletName.replace(this.WALLET_SUFFIX, '');
        const baseNameRegex = /^[a-z0-9_]{3,20}$/;
        return baseNameRegex.test(baseName);
    }
};
exports.WalletNameService = WalletNameService;
exports.WalletNameService = WalletNameService = WalletNameService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], WalletNameService);
//# sourceMappingURL=wallet-name.service.js.map