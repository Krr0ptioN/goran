import { Global, Module } from '@nestjs/common';
import { DeviceDetectorService } from './device-detector.service';

@Global()
@Module({
    providers: [DeviceDetectorService],
    exports: [DeviceDetectorService],
})
export class DeviceDetectorModule { }
