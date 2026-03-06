import { Simplify } from 'type-fest';
import {
    MinioInfraProviderOption,
    MinioProviderOptions,
} from './infrastructure/object-storage/minio';

export type FilesInfraProvider = MinioInfraProviderOption;

export type FilesInfraProviderOptions = Simplify<MinioProviderOptions>;

export interface FileStorageOptions {
    provider: FilesInfraProvider;
    options: FilesInfraProviderOptions;
}
