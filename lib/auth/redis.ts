import { Redis } from "ioredis";
import type { RedisAdapter, RedisPipeline } from "@gablura/auth-core";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("Missing REDIS_URL environment variable");
}

class RedisPipelineAdapter implements RedisPipeline {
  private commands: Array<() => Promise<unknown>> = [];

  constructor(private client: Redis) {}

  setex(key: string, ttl: number, value: string): this {
    this.commands.push(() => this.client.setex(key, ttl, value));
    return this;
  }

  incr(key: string): this {
    this.commands.push(() => this.client.incr(key));
    return this;
  }

  expire(key: string, seconds: number): this {
    this.commands.push(() => this.client.expire(key, seconds));
    return this;
  }

  async exec(): Promise<[Error | null, unknown][]> {
    const results: [Error | null, unknown][] = [];
    for (const cmd of this.commands) {
      try {
        const result = await cmd();
        results.push([null, result]);
      } catch (err) {
        results.push([err instanceof Error ? err : new Error(String(err)), null]);
      }
    }
    this.commands = [];
    return results;
  }
}

class RedisAdapterImpl implements RedisAdapter {
  constructor(private client: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ...args: unknown[]): Promise<"OK" | null> {
    if (args.length > 0) {
      const expiryMode = args[0] as string;
      const ttl = args[1] as number;
      if (expiryMode === "EX" || expiryMode === "ex") {
        return this.client.set(key, value, "EX", ttl);
      }
    }
    return this.client.set(key, value);
  }

  async setex(key: string, ttl: number, value: string): Promise<"OK" | null> {
    return this.client.setex(key, ttl, value);
  }

  async setnx(key: string, value: string): Promise<number> {
    const result = await this.client.set(key, value, "NX");
    return result === "OK" ? 1 : 0;
  }

  async del(...keys: string[]): Promise<number> {
    return this.client.del(...keys);
  }

  async exists(key: string): Promise<0 | 1> {
    const result = await this.client.exists(key);
    return result as 0 | 1;
  }

  async expire(key: string, seconds: number): Promise<0 | 1> {
    const result = await this.client.expire(key, seconds);
    return result as 0 | 1;
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return this.client.srem(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async scan(cursor: string, ...args: string[]): Promise<[string, string[]]> {
    // ioredis scan returns [cursor, keys] tuple
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (this.client as any).scan(cursor, ...args) as [string, string[]];
    return result;
  }

  async eval<T = unknown>(script: string, numKeys: number, ...args: string[]): Promise<T> {
    return this.client.eval(script, numKeys, ...args) as Promise<T>;
  }

  pipeline(): RedisPipeline {
    return new RedisPipelineAdapter(this.client);
  }
}

let redisClient: Redis;
let redisAdapter: RedisAdapterImpl;

if (process.env.NODE_ENV === "production") {
  redisClient = new Redis(redisUrl);
  redisAdapter = new RedisAdapterImpl(redisClient);
} else {
  if (!global._redisClient) {
    global._redisClient = new Redis(redisUrl);
  }
  redisClient = global._redisClient;
  if (!global._redisAdapter) {
    global._redisAdapter = new RedisAdapterImpl(redisClient);
  }
  redisAdapter = global._redisAdapter;
}

declare global {
  var _redisClient: Redis | undefined;
  var _redisAdapter: RedisAdapterImpl | undefined;
}

export { redisClient, redisAdapter };
