import { Test } from '@nestjs/testing';
import { AlbumsService } from '../../../application';
import { AlbumsController } from './albums.controller';

describe('AlbumsController', () => {
    it('should be defined', async () => {
        const module = await Test.createTestingModule({
            controllers: [AlbumsController],
            providers: [
                {
                    provide: AlbumsService,
                    useValue: {
                        findAll: jest.fn(),
                        findOneById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        const controller = module.get(AlbumsController);
        expect(controller).toBeDefined();
    });
});
