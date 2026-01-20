import { ConfigService } from '@nestjs/config';

export interface BlockchainConfig {
  NETWORK_URL: string;
  PRIVATE_KEY: string;
  CEDRA_GAMEFI_ADDRESS: string;
  PACKAGE_NAME: string;
  ADMIN_ADDRESS: string;
}

export const getBlockchainConfig = (configService: ConfigService): BlockchainConfig => {
  return {
    NETWORK_URL: configService.get<string>('CEDRA_NETWORK_URL', 'https://rpc.cedra.network'),
    PRIVATE_KEY: configService.get<string>('CEDRA_PRIVATE_KEY', ''),
    CEDRA_GAMEFI_ADDRESS: configService.get<string>('CEDRA_GAMEFI_ADDRESS', '79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe'),
    PACKAGE_NAME: configService.get<string>('CEDRA_PACKAGE_NAME', 'CedraMiniApp'),
    ADMIN_ADDRESS: configService.get<string>('CEDRA_ADMIN_ADDRESS', '79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe'),
  };
};

export const BLOCKCHAIN_CONFIG = {
  NETWORK_URL: process.env.CEDRA_NETWORK_URL || 'https://rpc.cedra.network',
  PRIVATE_KEY: process.env.CEDRA_PRIVATE_KEY || '',
  CEDRA_GAMEFI_ADDRESS: process.env.CEDRA_GAMEFI_ADDRESS || '79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe',
  PACKAGE_NAME: process.env.CEDRA_PACKAGE_NAME || 'CedraMiniApp',
  ADMIN_ADDRESS: process.env.CEDRA_ADMIN_ADDRESS || '79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe',
};