import { FilesService } from './application';
import { FileStorageOptions } from './files-modules.type';
import { configFilesProviderModule } from './config-files-provider-module.util';

export class FilesModule {
    static register(fileStorageOptions: FileStorageOptions) {
        const fileProviderModule =
            configFilesProviderModule(fileStorageOptions);
        return {
            module: FilesModule,
            global: true,
            imports: [fileProviderModule],
            providers: [FilesService],
            exports: [FilesService],
        };
    }
}
