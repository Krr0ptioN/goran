import { FilesInfraProviderOptions } from '../../../files-modules.type';

export type MinioInfraProviderOption = 'minio';

export interface MinioProviderOptions {
    endpoint: string;
    port: number;
    useSSL: boolean;
    keys: {
        access: string;
        secret: string;
    };
    bucketName: string;
}

export function isMinioProviderOptionsValid(
    options: FilesInfraProviderOptions
): options is MinioProviderOptions {
    return (
        'endpoint' in options &&
        'port' in options &&
        'keys' in options &&
        'secret' in options.keys &&
        'access' in options.keys
    );
}
