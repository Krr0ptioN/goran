import { IpLocationDto } from '../types';

export class PreconditionedLocationFails {
    static readonly localhostLocation: IpLocationDto = {
        status: 'success',
        country: 'Localhost',
        countryCode: 'LO',
        region: 'Localhost',
        regionName: 'Localhost',
        city: 'Localhost',
        district: 'Localhost',
        lat: 0,
        lon: 0,
        timezone: 'Localhost',
    };

    static readonly unknownLocation: IpLocationDto = {
        status: 'fail',
        country: 'Unknown',
        countryCode: 'UK',
        region: 'Unknown',
        regionName: 'Unknown',
        city: 'Unknown',
        district: 'Unknown',
        lat: 0,
        lon: 0,
        timezone: 'Unknown',
    };
}
