import { Global, Module } from '@nestjs/common';
import { TokensService } from './application/tokens.service';

@Global()
@Module({
    imports: [],
    providers: [TokensService],
    exports: [TokensService],
})
export class TokensModule { }
