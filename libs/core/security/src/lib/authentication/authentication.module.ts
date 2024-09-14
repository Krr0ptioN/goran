import { Module } from '@nestjs/common';
import { PasswordModule } from '../password/password.module';
import { IpLocatorModule } from '@goran/ip-locator';
import { DeviceDetectorModule } from '@goran/device-detector';

@Module({
    imports: [PasswordModule, IpLocatorModule, DeviceDetectorModule],
})
export class AuthenticationModule {}
