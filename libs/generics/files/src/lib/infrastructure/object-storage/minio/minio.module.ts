import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { FileProvider } from '../../../application';
import { MinioFileProvider } from './minio.adapter';
import { MinioProviderOptions } from './minio.module-options';

@Module({
    providers: [
        {
            provide: FileProvider,
            useClass: MinioFileProvider,
        },
    ],
    exports: [FileProvider],
})
export class MinioProviderModule {
    static register(options: MinioProviderOptions) {
        return {
            module: MinioProviderModule,
            imports: [
                MinioModule.register({
                    endPoint: options.endpoint,
                    port: options.port,
                    useSSL: options.useSSL,
                    accessKey: options.keys.access,
                    secretKey: options.keys.secret,
                }),
            ],
            providers: [
                {
                    provide: FileProvider,
                    useClass: MinioFileProvider,
                },
                MinioFileProvider,
            ],
            exports: [FileProvider, MinioFileProvider],
        };
    }
}
