import Redis, { Redis as RedisInstance, RedisOptions } from 'ioredis';

interface RedisConfig {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    db?: number;
    family?: number;
    prefix?: string; 
    retry?: (retries: number) => number | void; 
    timeout?: number; 
    tls?: object; 
    [key: string]: any; 
}

class RedisClient {
    private static instance: RedisInstance;

    private constructor() {}

    public static getInstance(config?: RedisConfig): RedisInstance {
        if (!RedisClient.instance) {
            const options: RedisOptions = {
                host: config?.host || 'localhost',
                port: config?.port || 6379,
                db: config?.db || 0,
            };
            RedisClient.instance = new Redis(options);
        }
        return RedisClient.instance;
    }
}

export default RedisClient;
