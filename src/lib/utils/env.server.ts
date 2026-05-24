import { z } from 'zod';

import { 
    INTERNAL_SECRET_KEY,
    BACKEND_URL,
    FRONTEND_URL
} from '$env/static/private';


const envSchema = z.object({
    BACKEND_URL         : z.string().min(1),
    FRONTEND_URL        : z.url().min(1),
    INTERNAL_SECRET_KEY : z.string().min(1),
});


const parsedEnv = envSchema.safeParse({
    INTERNAL_SECRET_KEY,
    BACKEND_URL,
    FRONTEND_URL
});


if ( !parsedEnv.success ) {
    console.error(
        '❌ Invalid environment variables:'
    );

    throw new Error( 'Invalid environment variables' );
}


export const ENV = {
    BACKEND_URL     : parsedEnv.data.BACKEND_URL,
    FRONTEND_URL    : parsedEnv.data.FRONTEND_URL,

    INTERNAL_SECRET_KEY: parsedEnv.data.INTERNAL_SECRET_KEY,
};
