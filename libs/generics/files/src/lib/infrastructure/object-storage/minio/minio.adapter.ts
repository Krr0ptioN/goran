import {
    FilePreparationService,
    BufferedFile,
    FileProvider,
    FileUploaded,
} from '../../../application';
import { FileUploadFailedInfra as FileUploadFailedInfra } from '../../errors';
import { MinioService } from 'nestjs-minio-client';
import { Injectable } from '@nestjs/common';
import { Ok, Err, Result } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';

@Injectable()
export class MinioFileProvider implements FileProvider {
    constructor(
        private readonly minioService: MinioService,
        private readonly filePreparationService: FilePreparationService
    ) { }

    public async upload(file: BufferedFile, bucketName: string): Promise<Result<FileUploaded, ExceptionBase>> {
        const fileName = this.filePreparationService.formatFileName(
            file.originalname
        );
        const fileBuffer = file.buffer;

        try {
            const uploadResult = await this.minioService.client.putObject(
                bucketName,
                fileName,
                fileBuffer
            );
            // TODO: Add real url instead of mocking
            return Ok({
                fileName,
                bucketName,
                url: `https://f.goran.com/${bucketName}/${fileName}`,
                key: fileName,
                etag: uploadResult.etag,
                versionId: uploadResult.versionId,
            });
        } catch (err) {
            if (err) return Err(new FileUploadFailedInfra());
            return Err(new FileUploadFailedInfra());
        }
    }

    async delete(objectName: string, bucketName: string) {
        try {
            this.minioService.client.removeObject(bucketName, objectName);
            return Ok(objectName);
        } catch (err) {
            if (err) return Err(new FileUploadFailedInfra());
            return Err(new FileUploadFailedInfra());
        }
    }
}
