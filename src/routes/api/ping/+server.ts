import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    return new Response("Pong!");
};

export const POST: RequestHandler = async () => {
    return new Response("Pong?");
};