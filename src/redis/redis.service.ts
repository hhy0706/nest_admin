import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly client: RedisClientType;

  async get(key: string) {
    return this.client.get(key);
  }
  async set(key: string, value: string | number, ttl?: number) {
    await this.client.set(key, value);
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }
  async hSet(key: string, field: string, value:any, ttl?: number) {
    await this.client.hSet(key, field, value);
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }
  async hGet(key: string,field:string) {
    return this.client.hGet(key,field);
  }
}
