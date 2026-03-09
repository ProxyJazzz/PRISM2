import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Create a connection pool using your environment variable
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // 2. Initialize the adapter
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter to the super constructor
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
