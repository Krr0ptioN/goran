import { AppMimeType } from './app-mime-type';

export interface BufferedFile {
    fieldname?: string;
    originalname: string;
    encoding: string;
    mimetype: AppMimeType;
    size: number;
    buffer: Buffer | string;
}
