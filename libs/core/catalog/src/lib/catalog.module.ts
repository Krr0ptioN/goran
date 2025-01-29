import { Module } from '@nestjs/common';
import { SongsController } from './presenters/http';
import { FilesModule } from '@goran/files';

@Module({
    controllers: [SongsController],
    providers: [],
    exports: [],
})
export class CatalogModule {}
