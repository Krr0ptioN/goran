import {
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { match } from 'oxide.ts';
import { CatalogRecordNotFoundError, ProducerEntity } from '../../../domain';
import { ProducersService } from '../../../application';
import { CreateProducerDto } from './create-producer.dto';
import { UpdateProducerDto } from './update-producer.dto';

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {
    constructor(private readonly producersService: ProducersService) {}

    @ApiOkResponse({ description: 'List producers' })
    @Get()
    async findAll() {
        const producers = await this.producersService.findAll();
        return producers.map((producer) => this.toProducerResponse(producer));
    }

    @ApiOkResponse({ description: 'Get producer by id' })
    @Get(':id')
    async findOne(@Param('id') producerId: string) {
        const producerOption =
            await this.producersService.findOneById(producerId);
        if (producerOption.isNone()) {
            throw new NotFoundException('Producer not found');
        }

        return this.toProducerResponse(producerOption.unwrap());
    }

    @ApiCreatedResponse({ description: 'Producer created' })
    @Post()
    async create(@Body() body: CreateProducerDto) {
        const result = await this.producersService.create({
            fullname: body.fullname,
            nickname: body.nickname ?? null,
            bio: body.bio ?? null,
            genreIds: body.genreIds ?? [],
            songIds: body.songIds ?? [],
            albumIds: body.albumIds ?? [],
        });

        return match(result, {
            Ok: (producer: ProducerEntity) => this.toProducerResponse(producer),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @ApiOkResponse({ description: 'Producer updated' })
    @Patch(':id')
    async update(
        @Param('id') producerId: string,
        @Body() body: UpdateProducerDto,
    ) {
        const result = await this.producersService.update(producerId, {
            fullname: body.fullname,
            nickname: body.nickname,
            bio: body.bio,
            genreIds: body.genreIds,
            songIds: body.songIds,
            albumIds: body.albumIds,
        });

        return match(result, {
            Ok: (producer: ProducerEntity) => this.toProducerResponse(producer),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @ApiOkResponse({ description: 'Producer deleted' })
    @Delete(':id')
    async delete(@Param('id') producerId: string) {
        const result = await this.producersService.delete(producerId);
        return match(result, {
            Ok: () => ({ deleted: true }),
            Err: (error) => this.throwMappedError(error),
        });
    }

    private throwMappedError(error: Error): never {
        if (error instanceof CatalogRecordNotFoundError) {
            throw new NotFoundException(error.message);
        }

        throw new InternalServerErrorException(error.message);
    }

    private toProducerResponse(producer: ProducerEntity) {
        const props = producer.getProps();
        return {
            id: props.id,
            fullname: props.fullname,
            nickname: props.nickname,
            bio: props.bio,
            songIds: props.songIds,
            genreIds: props.genreIds,
            albumIds: props.albumIds,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        };
    }
}
