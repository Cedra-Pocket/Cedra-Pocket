import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        database: string;
        memory: NodeJS.MemoryUsage;
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        database: string;
        error: any;
        uptime?: undefined;
        memory?: undefined;
    }>;
}
