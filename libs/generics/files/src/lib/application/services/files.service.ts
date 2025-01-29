import { Injectable } from '@nestjs/common';
import { FileProvider, FileUploaded } from '../ports';
import { FileUploadDto } from '../dtos';
import { Result } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';

@Injectable()
export class FilesService {
    constructor(private readonly fileProvider: FileProvider) { }

    public upload(
        dto: FileUploadDto
    ): Promise<Result<FileUploaded, ExceptionBase>> {
        return this.fileProvider.upload(dto.file, dto.bucketName);
    }
}
