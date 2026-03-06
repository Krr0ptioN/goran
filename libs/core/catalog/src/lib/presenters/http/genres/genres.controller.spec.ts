import { Test } from '@nestjs/testing';
import { GenresService } from '../../../application';
import { GenresController } from './genres.controller';

describe('GenresController', () => {
    it('should be defined', async () => {
        const module = await Test.createTestingModule({
            controllers: [GenresController],
            providers: [
                {
                    provide: GenresService,
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

        const controller = module.get(GenresController);
        expect(controller).toBeDefined();
    });
});
