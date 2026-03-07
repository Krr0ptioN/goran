import { Test } from '@nestjs/testing';
import { PlaylistsService } from '../../../application';
import { PlaylistsController } from './playlists.controller';

describe('PlaylistsController', () => {
    it('should be defined', async () => {
        const module = await Test.createTestingModule({
            controllers: [PlaylistsController],
            providers: [
                {
                    provide: PlaylistsService,
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

        const controller = module.get(PlaylistsController);
        expect(controller).toBeDefined();
    });
});
