import { Module } from '@nestjs/common';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../database/prisma.module';

@Module({
    imports: [AiModule, PrismaModule],
    controllers: [ProposalsController],
    providers: [ProposalsService],
    exports: [ProposalsService],
})
export class ProposalsModule { }
