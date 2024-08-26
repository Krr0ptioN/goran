import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm/expressions';
import {
    DrizzleService,
    PasswordResetRequestsDataPgTable as Table,
} from '@goran/drizzle-data-access';
import { Some, None, Option, Ok, Err, Result } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import { PasswordResetRequestRepository } from '../../application/ports';
import { PasswordResetRequestAggregate } from '../../domain';
import { PasswordResetRequestMapper } from '../../application';
import { PasswordResetRequestModel } from '../../application/models/password-reset-request.model';
import { UnableSaveRequestError } from './unable-save-request.error';

@Injectable()
export class PostgreSqlDrizzlePasswordResetRequestRepository
    implements PasswordResetRequestRepository
{
    constructor(
        private readonly drizzleService: DrizzleService,
        private readonly mapper: PasswordResetRequestMapper
    ) {}

    async findOneByToken(
        token: string
    ): Promise<Option<PasswordResetRequestModel>> {
        return await this.drizzleService.db
            .select()
            .from(Table)
            .where(eq(Table.token, token))
            .then((result: PasswordResetRequestModel[]) => {
                return result && result.length > 0 ? Some(result[0]) : None;
            });
    }

    async findOneById(id: string): Promise<Option<PasswordResetRequestModel>> {
        return await this.drizzleService.db
            .select()
            .from(Table)
            .where(eq(Table.id, id))
            .then((result: PasswordResetRequestModel[]) => {
                return result && result.length > 0 ? Some(result[0]) : None;
            });
    }

    async save(
        request: PasswordResetRequestAggregate
    ): Promise<Result<PasswordResetRequestAggregate, ExceptionBase>> {
        const model: PasswordResetRequestModel =
            this.mapper.toPersistence(request);
        const foundedRequest = await this.findOneById(request.id);
        const err = (err: Error) => Err(new UnableSaveRequestError(err));

        return foundedRequest.isSome()
            ? await this.drizzleService.db
                  .update(Table)
                  .set({ ...model })
                  .where(eq(Table.id, request.id))
                  .returning()
                  .then(async (result: PasswordResetRequestModel[]) =>
                      Ok(await this.mapper.toDomain(result[0]))
                  )
                  .catch(err)
            : await this.drizzleService.db
                  .insert(Table)
                  .values({ ...model })
                  .returning()
                  .then(async (result: PasswordResetRequestModel[]) =>
                      Ok(await this.mapper.toDomain(result[0]))
                  )
                  .catch(err);
    }

    async delete(
        request: PasswordResetRequestAggregate
    ): Promise<Result<PasswordResetRequestAggregate, ExceptionBase>> {
        const err = (err: Error) => Err(new UnableSaveRequestError(err));
        return await this.drizzleService.db
            .delete(Table)
            .where(eq(Table.id, request.id))
            .returning()
            .then(async (result: PasswordResetRequestModel[]) =>
                Ok(await this.mapper.toDomain(result[0]))
            )
            .catch(err);
    }
}
