export abstract class CacheManagerPort {
  abstract get(key: string): Promise<unknown>;
  abstract set(key: string, value: unknown, ttl: number): Promise<void>;
}