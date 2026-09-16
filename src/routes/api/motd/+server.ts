import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    return new Response(env["PUBLIC_MOTD"] || "No message set for today :(");
};