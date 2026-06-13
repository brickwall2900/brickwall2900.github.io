import type { RequestHandler } from './$types';

export const prerender = true;
export const GET: RequestHandler = async () => {
    return new Response((Math.floor(Math.random() * Math.pow(2, 32))).toString(16) + "::" + new Date().getTime().toString(16));
};