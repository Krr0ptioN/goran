import { Global, Module } from '@nestjs/common';
import { IpLocatorService } from './services/ip-locator.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
    providers: [IpLocatorService],
    imports: [HttpModule],
    exports: [IpLocatorService],
})
export class IpLocatorModule {}
