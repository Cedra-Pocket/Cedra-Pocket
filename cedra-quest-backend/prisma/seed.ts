import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample quests
  const socialQuest = await prisma.quests.create({
    data: {
      title: 'Follow Cedra on Twitter',
      description: 'Follow our official Twitter account to stay updated',
      type: 'SOCIAL',
      category: 'twitter',
      config: {
        platform: 'twitter',
        action: 'follow',
        target_id: '@cedra_network',
        url: 'https://twitter.com/cedra_network'
      },
      reward_amount: 100,
      reward_type: 'POINT',
      frequency: 'ONCE',
      is_active: true,
    },
  });

  const telegramQuest = await prisma.quests.create({
    data: {
      title: 'Join Cedra Telegram Channel',
      description: 'Join our official Telegram channel for updates',
      type: 'SOCIAL',
      category: 'telegram',
      config: {
        platform: 'telegram',
        action: 'join_channel',
        target_id: '@cedra_official',
        url: 'https://t.me/cedra_official'
      },
      reward_amount: 150,
      reward_type: 'POINT',
      frequency: 'ONCE',
      is_active: true,
    },
  });

  const onchainQuest = await prisma.quests.create({
    data: {
      title: 'Hold 1000 CEDRA Tokens',
      description: 'Hold at least 1000 CEDRA tokens in your wallet',
      type: 'ONCHAIN',
      category: 'holding',
      config: {
        chain_id: 1,
        contract_address: '0x...',
        token_symbol: 'CEDRA',
        min_amount: '1000',
        action: 'hold',
        duration_hours: 24
      },
      reward_amount: 500,
      reward_type: 'POINT',
      frequency: 'ONCE',
      is_active: true,
    },
  });

  console.log('Sample quests created:', {
    socialQuest: socialQuest.id,
    telegramQuest: telegramQuest.id,
    onchainQuest: onchainQuest.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });