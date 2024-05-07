import { DbDataAccessProvider, UsersDataPgTable } from '@goran/db-data-access';
import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { UserEntity, UserEntityInfo, UserEntityMutation } from '../entities';
import { UsersRepository } from './users.repository';

@Injectable()
export class NeonDrizzleUsersRepository implements UsersRepository {
    constructor(@Inject(DbDataAccessProvider) readonly db: NeonHttpDatabase) { }

    findAll() {
        return this.db.select().from(UsersDataPgTable);
    }

    async findOne(target: Partial<UserEntityInfo>): Promise<UserEntity> {
        // TODO: make the below condition an decorator
        if (!target.id || !target.email || !target.username)
            throw new BadRequestException(
                'Either email, id or username must be provided to proceed this operation'
            );
        return await this.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.id, target.id))
            .then((result) => {
                if (result && result.length > 0) {
                    return result[0];
                } else {
                    throw new NotFoundException('User not found');
                }
            });
    }

    async findOneById(targetId: number) {
        const result = await this.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.id, targetId));

        if (result && result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }

    async create(value: UserEntityMutation): Promise<UserEntity> {
        const inserted = await this.db
            .insert(UsersDataPgTable)
            .values(value)
            .returning();
        if (inserted[0] && inserted[0].id) {
            const createdUser = await this.findOneById(inserted[0].id);
            if (!createdUser) {
                throw new InternalServerErrorException('Failed to create user');
            }
            return createdUser;
        } else {
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async update(
        id: number,
        value: Partial<UserEntityMutation>
    ): Promise<{
        id: number;
        fullname: string | null;
        username: string;
        password: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }> {
        if (id) {
            const result = await this.db
                .update(UsersDataPgTable)
                .set(value)
                .where(eq(UsersDataPgTable.id, id))
                .returning();

            if (result && result.length > 0) {
                return result[0]; // Return the deleted user object
            } else {
                throw new NotFoundException('User not found');
            }
        } else {
            throw new BadRequestException(
                'Either email, id or username must be provided to proceed this operation'
            );
        }
    }

    async delete(target: Partial<UserEntityInfo>): Promise<{
        id: number;
        fullname: string | null;
        username: string;
        password: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }> {
        if (target.id) {
            const result = await this.db
                .delete(UsersDataPgTable)
                .where(eq(UsersDataPgTable.id, target.id))
                .returning();

            if (result && result.length > 0) {
                return result[0]; // Return the deleted user object
            } else {
                throw new NotFoundException('User not found');
            }
        } else {
            throw new BadRequestException(
                'Either email, id or username must be provided to proceed this operation'
            );
        }
    }
}
