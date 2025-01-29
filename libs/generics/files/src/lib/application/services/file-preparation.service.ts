import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class FilePreparationService {
    /**
     * Correctly formats the original name to be used as
     * a name for the object in the storage.
     *
     * @param originalFileName - Original name of the file
     * @returns Correctly formatted name
     */
    formatFileName(originalFileName: string): string {
        const temp_filename = Date.now().toString();
        const hashedFileName = crypto
            .createHash('sha256')
            .update(temp_filename)
            .digest('hex');

        const ext = originalFileName.substring(
            originalFileName.lastIndexOf('.'),
            originalFileName.length
        );

        return hashedFileName + ext;
    }
}
