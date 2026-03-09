import { Module, Global } from '@nestjs/common';
import { AiService } from './ai.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [AiService],
    exports: [AiService],
})
export class AiModule { }
