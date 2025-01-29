import { BufferedFile } from '../types';

export class FileUploadDto {
    file: BufferedFile;
    bucketName: string;
}
