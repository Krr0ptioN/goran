import { DynamicModule } from '@nestjs/common';
import { FileStorageOptions } from './files-modules.type';
import {
    MinioProviderModule,
    isMinioProviderOptionsValid,
} from './infrastructure/object-storage/minio';

export function configFilesProviderModule({
    options,
    provider,
}: FileStorageOptions): DynamicModule {
    if (provider === 'minio' && isMinioProviderOptionsValid(options)) {
        return MinioProviderModule.register(options);
    } else {
        throw new Error('Invalid mail provider configuration');
    }
}
