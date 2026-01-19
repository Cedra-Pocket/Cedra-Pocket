// Serverless function with Prisma database connection
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const path = req.url || '/';

    // Health check endpoint
    if (path === '/health' || path === '/' || path === '/api') {
      res.status(200).json({
        status: 'ok',
        message: 'Cedra Quest Backend with Database',
        timestamp: new Date().toISOString(),
        database: 'Connected to Supabase',
      });
      return;
    }

    // Game dashboard endpoint - get real data from database
    if (path.includes('/game/dashboard/')) {
      const userId = path.split('/').pop();
      
      if (!userId) {
        res.status(400).json({ error: 'User ID required' });
        return;
      }

      // Get user data from database
      let user = await prisma.users.findUnique({
        where: { telegram_id: BigInt(userId) },
        include: {
          pet: true,
          energy: true,
          game_sessions: {
            orderBy: { created_at: 'desc' },
            take: 10
          }
        }
      });

      // Create user if not exists
      if (!user) {
        user = await prisma.users.create({
          data: {
            telegram_id: BigInt(userId),
            username: `User${userId}`,
            wallet_address: `0x${userId}`,
            public_key: `pk_${userId}`,
            pet: {
              create: {
                level: 1,
                exp: 0,
                max_exp: 100,
                hunger: 100,
                happiness: 100,
                pending_coins: 0,
                total_coins_earned: BigInt(0),
                coin_rate: 1.0
              }
            },
            energy: {
              create: {
                current_energy: 10,
                max_energy: 10
              }
            }
          },
          include: {
            pet: true,
            energy: true,
            game_sessions: true
          }
        });
      }

      // Calculate game stats
      const gameStats = {
        totalGamesPlayed: user.game_sessions.length,
        totalScore: user.game_sessions.reduce((sum, session) => sum + session.score, 0),
        averageScore: user.game_sessions.length > 0 
          ? Math.round(user.game_sessions.reduce((sum, session) => sum + session.score, 0) / user.game_sessions.length)
          : 0,
        bestScore: user.game_sessions.length > 0 
          ? Math.max(...user.game_sessions.map(session => session.score))
          : 0,
        totalPointsEarned: Number(user.total_points)
      };

      res.status(200).json({
        success: true,
        pet: user.pet ? {
          level: user.pet.level,
          currentXp: user.pet.exp,
          xpForNextLevel: user.pet.max_exp,
          pendingRewards: user.pet.pending_coins,
          lastClaimTime: user.pet.last_coin_time.toISOString()
        } : null,
        energy: user.energy ? {
          currentEnergy: user.energy.current_energy,
          maxEnergy: user.energy.max_energy,
          lastUpdate: user.energy.last_update.toISOString()
        } : null,
        ranking: {
          rank: user.current_rank,
          position: 1, // TODO: Calculate real position
          lifetimePoints: Number(user.lifetime_points),
          nextRankThreshold: 1000
        },
        gameStats
      });
      return;
    }

    // Game cycle endpoint
    if (path.includes('/game/cycle/current')) {
      const cycle = await prisma.game_cycles.findFirst({
        where: { is_active: true },
        orderBy: { created_at: 'desc' }
      });

      if (cycle) {
        res.status(200).json({
          cycleNumber: cycle.cycle_number,
          growthRate: Number(cycle.growth_rate),
          maxSpeedCap: Number(cycle.max_speed_cap),
          startDate: cycle.start_date.toISOString(),
          endDate: cycle.end_date.toISOString(),
          isActive: cycle.is_active
        });
      } else {
        // Create default cycle if none exists
        const newCycle = await prisma.game_cycles.create({
          data: {
            cycle_number: 1,
            growth_rate: 1.0,
            max_speed_cap: 2.0,
            start_date: new Date(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            is_active: true
          }
        });

        res.status(200).json({
          cycleNumber: newCycle.cycle_number,
          growthRate: Number(newCycle.growth_rate),
          maxSpeedCap: Number(newCycle.max_speed_cap),
          startDate: newCycle.start_date.toISOString(),
          endDate: newCycle.end_date.toISOString(),
          isActive: newCycle.is_active
        });
      }
      return;
    }

    // Default response
    res.status(200).json({
      message: 'Cedra Quest Backend API with Database',
      path: path,
      method: req.method,
      available_endpoints: [
        'GET /health',
        'GET /game/dashboard/:userId',
        'GET /game/cycle/current'
      ]
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}