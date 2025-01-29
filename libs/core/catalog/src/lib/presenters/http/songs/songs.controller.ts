import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesService,BufferedFile } from "@goran/files";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiConsumes, ApiBody, ApiCreatedResponse } from "@nestjs/swagger";
import { match } from "oxide.ts";

@ApiTags('Songs')
@Controller('songs')
export class SongsController {

    constructor(
        private readonly filesService: FilesService,
    ) { }

    @Post('media/upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiCreatedResponse({ 
        description: 'The song file has been uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                key: { type: 'string' }
            }
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadSong(@UploadedFile() file: BufferedFile){
        const uploadResult = await this.filesService.upload({
            file,
            bucketName: 'songs'
        });
        return match(uploadResult, {
            Ok: ({ url, key }) => ({ url, key }),
            Err: () => ({})
        })
    }
    
    @Post('cover/upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiCreatedResponse({ 
        description: 'The cover image has been uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                key: { type: 'string' }
            }
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadCover(@UploadedFile() file: BufferedFile){
        const uploadResult = await this.filesService.upload({
            file,
            bucketName: 'covers'
        });
        return match(uploadResult, {
            Ok: ({ url, key }) => ({ url, key }),
            Err: () => ({})
        })
    }
}