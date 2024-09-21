import { Test, TestingModule } from '@nestjs/testing';
import { DeviceDetectorService } from './device-detector.service';

describe('DeviceDetectorService', () => {
    let service: DeviceDetectorService;

    const mockDeviceInfo = {
        client: {
            engine: "WebKit",
            engine_version: "605.1.15",
            family: "Safari",
            name: "Safari",
            short_name: "SF",
            type: "browser",
            version: "14.0.3"
        },
        device: {
            brand: "Apple",
            id: "",
            model: "",
            type: "desktop"
        },
        os: {
            family: "Mac",
            name: "Mac",
            platform: "",
            short_name: "MAC",
            version: "10.15.7"
        }
    };

    const mockDeviceDetector = {
        detect: jest.fn().mockReturnValue(mockDeviceInfo),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeviceDetectorService,
                {
                    provide: 'DeviceDetector', // Adjust if you have a specific provider token
                    useValue: mockDeviceDetector,
                },
            ],
        }).compile();

        service = module.get<DeviceDetectorService>(DeviceDetectorService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('detect', () => {
        it('should return device information for a user agent', () => {
            const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15';
            const result = service.detect(userAgent);

            expect(result).toEqual(mockDeviceInfo);
        });
    });

    describe('getDevice', () => {
        it('should return formatted device name with OS and browser name', () => {
            const userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0';
            const result = service.getDevice(userAgent);

            expect(result).toEqual('Ubuntu () /  (Firefox)');
        });
    });
});
