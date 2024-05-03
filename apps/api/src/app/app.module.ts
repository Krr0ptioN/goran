import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@goran/users';

@Module({
    imports: [
        UsersModule,
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
