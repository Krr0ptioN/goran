import { Test } from '@nestjs/testing';
import { ProducersService } from '../../../application';
import { ProducersController } from './producers.controller';

describe('ProducersController', () => {
    it('should be defined', async () => {
        const module = await Test.createTestingModule({
            controllers: [ProducersController],
            providers: [
                {
                    provide: ProducersService,
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

        const controller = module.get(ProducersController);
        expect(controller).toBeDefined();
    });
});
