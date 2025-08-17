import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { IpLocatorService } from './ip-locator.service';
import { of, throwError } from 'rxjs';
import { IpLocationDto, Geolocation } from '../types';
import { PreconditionedLocationFails } from './preconditioned-location-fails';

describe('IpLocatorService', () => {
    let service: IpLocatorService;

    const mockHttpService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IpLocatorService,
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        service = module.get<IpLocatorService>(IpLocatorService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('locate', () => {
        it('should return location data for a valid IP', async () => {
            const mockIp = '8.8.8.8';
            const mockResponse: IpLocationDto = {
                status: 'success',
                country: 'United States',
                countryCode: 'US',
                region: 'California',
                regionName: 'California',
                city: 'Mountain View',
                district: 'Santa Clara',
                lat: 37.3861,
                lon: -122.0838,
                timezone: 'America/Los_Angeles',
            };

            mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

            const result = await service.locate(mockIp);

            expect(result).toEqual(mockResponse);
            expect(mockHttpService.get).toHaveBeenCalledWith(
                service.getApi(mockIp)
            );
        });

        it('should return fallback location for an invalid IP', async () => {
            const mockIp = 'invalid-ip';
            mockHttpService.get.mockReturnValue(
                throwError(() => new Error('Invalid IP')),
            );

            await expect(service.locate(mockIp)).resolves.toEqual(
                PreconditionedLocationFails.unknownLocation
            );

            expect(mockHttpService.get).toHaveBeenCalledWith(service.getApi(mockIp));
        });
    });

    describe('getLocation', () => {
        it('should return formatted location data', async () => {
            const mockIp = '8.8.8.8';
            const mockResponse: IpLocationDto = {
                status: 'success',
                country: 'United States',
                countryCode: 'US',
                region: 'California',
                regionName: 'California',
                city: 'Mountain View',
                district: 'Santa Clara',
                lat: 37.3861,
                lon: -122.0838,
                timezone: 'America/Los_Angeles',
            };

            mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

            const result = await service.getLocation(mockIp);

            expect(result).toEqual('United States (US) / California');
        });
    });

    describe('getGeolocation', () => {
        it('should return geolocation coordinates', async () => {
            const mockIp = '8.8.8.8';
            const mockResponse: IpLocationDto = {
                status: 'success',
                country: 'United States',
                countryCode: 'US',
                region: 'California',
                regionName: 'California',
                city: 'Mountain View',
                district: 'Santa Clara',
                lat: 37.3861,
                lon: -122.0838,
                timezone: 'America/Los_Angeles',
            };

            mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

            const result: Geolocation = await service.getGeolocation(mockIp);

            expect(result).toEqual({
                lat: mockResponse.lat,
                lon: mockResponse.lon,
            });
        });
    });
});
