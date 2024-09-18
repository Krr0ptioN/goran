import { Global, Module } from '@nestjs/common';
import { IpLocatorService } from './ip-locator.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
    providers: [IpLocatorService],
    imports: [HttpModule],
    exports: [IpLocatorService],
})
export class IpLocatorModule {}
