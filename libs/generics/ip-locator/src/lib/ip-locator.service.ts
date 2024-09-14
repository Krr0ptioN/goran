import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Geolocation, IpLocationDto } from './types';

@Injectable()
export class IpLocatorService {
    constructor(private readonly fetchService: HttpService) { }

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
    private fields = 541151;

    /**
     * @param ip - IP of the client
     * @returns API URL path to query from
     */
    private getApi(ip: string) {
        return `${this.api}/${ip}?fields=${this.fields}`;
    }

    /**
     * @param ip - IP of the client
     *
     * @description Provides geographic and location data associated with the IP
     * @returns {IpLocationDto}
     */
    async locate(ip: string): Promise<IpLocationDto> {
        const { data } = await firstValueFrom(
            this.fetchService.get<IpLocationDto>(this.getApi(ip))
        );
        return data;
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
