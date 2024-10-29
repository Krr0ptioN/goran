import { Injectable } from '@nestjs/common';
import DeviceDetector from 'node-device-detector'; 

@Injectable()
export class DeviceDetectorService {
    private readonly detector = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
        deviceTrusted: false,
        deviceInfo: false,
        maxUserAgentSize: 500,
    });
    
    constructor() { }

    /**
     * detect
     */
    public detect(userAgent: string) {
        return this.detector.detect(userAgent);
    }

    /**
     * @param userAgent - The client user agent
     * @returns Formatted device name with os and browser name
     * @example Android (5.0) / Nubia Z7 Max (Chrome Mobile)
     */
    public getDevice(userAgent: string) {
        const result = this.detector.detect(userAgent);
        return `${result.os.name} (${result.os.version}) / ${result.device.model} (${result.client.name})`;
    }
}
