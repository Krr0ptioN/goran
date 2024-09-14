import { Injectable } from '@nestjs/common';
import { CacheManagerPort } from '../../application';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class InMemoryCacheAdapter implements CacheManagerPort {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async get(key: string): Promise<unknown> {
        return this.cacheManager.get(key);
    }

    async set(key: string, value: unknown, ttl: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl);
    }
}