
export interface RegionalLocation {
    region: string;
    regionName: string;
}

export interface CountryLocation {
    country: string;
    countryCode: string;
}

export interface Geolocation {
    lon: number;
    lat: number;
}

export interface IpLocationDto extends Geolocation, RegionalLocation, CountryLocation {
    status: 'success' | 'fail';
    city: string;
    district: string;
    timezone: string;
}
