import { createClient } from 'redis';

export const client = createClient();

export default async() => {

    // Handle Redis connection errors
    client.on('error', (err) => {
    console.error('Redis Client Error', err);
    });

    client.on('ready', () => {
        console.log("Redis Client is ready")
    })

    await client.connect().then(() => {
        console.log("Redis Connected Successfully")
    });

};

