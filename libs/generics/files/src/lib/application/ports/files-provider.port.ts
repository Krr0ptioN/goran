import { ExceptionBase } from '@goran/common';
import { BufferedFile } from '../types';
import { Result } from 'oxide.ts';

export interface FileUploaded {
    url: string;
    key: string;
}

export abstract class FileProvider {
    abstract upload(
        file: BufferedFile,
        bucketName: string
    ): Promise<Result<FileUploaded, ExceptionBase>>;
    abstract delete(
        objetName: string,
        bucketName: string
    ): Promise<Result<string, ExceptionBase>>;
}
