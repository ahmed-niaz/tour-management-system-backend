import { env } from 'process';
import { createClient } from 'redis';

export const redisClient = createClient({
    username: env.REDIS_USERNAME || '',
    password: env.REDIS_PASSWORD || '',
    socket: {
        host: env.REDIS_HOST,
        port:Number( env.REDIS_PORT )|| 6379
    }
});

// eslint-disable-next-line no-console
redisClient.on('error', err => console.log('Redis Client Error', err));


// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

// todo: if redis is not open then connect.
export const getRedisClient = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        // eslint-disable-next-line no-console
        console.log('redis client connected');
    }   }