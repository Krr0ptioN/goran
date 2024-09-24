import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Geolocation, IpLocationDto } from '../types';
import { PreconditionedLocationFails } from './preconditioned-location-fails';
import { Guard } from '@goran/common';

@Injectable()
export class IpLocatorService {
    constructor(private readonly httpService: HttpService) { }

    private api = 'https://ip-api.com/json';

    /**
     * @description 541151 is a number generated to include the
     * following fields in the response:
     *    - status
     *    - Country info: country,countryCode
     *    - Region info: region,regionName
     *    - City info: city,district
     *    - Timezone and gepolocation: lat,lon,timezone
     * @see https://ip-api.com/docs/api:json
     */
    private readonly fields = 541151;

    get getFields() {
        return this.fields;
    }

    /**
     * @param ip - IP of the client
     * @returns API URL path to query from
     */
    public getApi(ip: string) {
        return `${this.api}/${ip}?fields=${this.getFields}`;
    }

    /**
     * @param ip - IP address to check
     * @param localIps - Array of local IP addresses
     * @returns boolean indicating if the IP is a local IP
     */
    isIpLocalhost(ip: string): boolean {
        const localIps = ['localhost', '127.0.0.1', '::1', '0.0.0.0']
        return localIps.includes(ip);
    }

    /**
     * @param ip - IP of the client
     *
     * @description Provides geographic and location data associated with the IP
     * @returns {IpLocationDto}
     */
    async locate(ip: string): Promise<IpLocationDto> {
        if (Guard.isEmpty(ip)) {
            return PreconditionedLocationFails.localhostLocation;
        }
        if (this.isIpLocalhost(ip)) {
            return PreconditionedLocationFails.localhostLocation;
        }

        try {
            const { data } = await firstValueFrom(
                this.httpService.get<IpLocationDto>(this.getApi(ip))
            );
            return data;
        } catch (error) {
            console.error(`Failed to locate IP: ${ip}`, error);
            return PreconditionedLocationFails.unknownLocation;
        }
    }

    /**
     * @description Formatted location data
     * @example "Canada (CA) / Quebec"
     */
    async getLocation(ip: string): Promise<string> {
        const locationData = await this.locate(ip);
        return `${locationData.country} (${locationData.countryCode}) / ${locationData.regionName}`;
    }

    /**
     * @description Latitude and longitude coordinates
     */
    async getGeolocation(ip: string): Promise<Geolocation> {
        const locationData = await this.locate(ip);
        return { lon: locationData.lon, lat: locationData.lat };
    }
}
