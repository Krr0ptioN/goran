import { Ok } from 'oxide.ts';
import { FilesService } from './files.service';
import { FileProvider } from '../ports';
import { BufferedFile } from '../types';

describe('FilesService', () => {
    it('delegates upload to the file provider', async () => {
        const provider: jest.Mocked<FileProvider> = {
            upload: jest.fn().mockResolvedValue(
                Ok({
                    url: 'https://f.goran.com/songs/test.mp3',
                    key: 'test.mp3',
                }),
            ),
            delete: jest.fn(),
        };

        const service = new FilesService(provider);
        const file: BufferedFile = {
            originalname: 'song.mp3',
            encoding: '7bit',
            mimetype: 'audio/mpeg',
            buffer: Buffer.from('file-content'),
            size: 12,
        };

        const result = await service.upload({
            file,
            bucketName: 'songs',
        });

        expect(provider.upload).toHaveBeenCalledWith(file, 'songs');
        expect(result.isOk()).toBe(true);
    });
});
