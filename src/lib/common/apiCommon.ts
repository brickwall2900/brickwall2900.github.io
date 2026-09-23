export interface ApiError {
    message: string;
}

export interface ApiResult<T> {
    error?: ApiError;
    result?: T;
}

export interface CacheStrategy {
    makeCacheControlString: () => string;
}

export class NoCacheStrategy implements CacheStrategy {
    public makeCacheControlString(): string {
        return "no-cache";
    }
}

export class AgingCacheStrategy implements CacheStrategy {
    seconds: number;

    constructor(seconds: number) {
        this.seconds = seconds;
    }

    public makeCacheControlString(): string {
        return `max-age=${this.seconds}`;
    }
}

export const NO_CACHING = new NoCacheStrategy();

export function makeResponse<T>(result: ApiResult<T>, httpCode: number = 200, cacheControl: CacheStrategy = NO_CACHING): Response {
    return new Response(JSON.stringify(result), { 
        status: httpCode,
        headers: new Headers({ 
            "Content-Type": "application/json",
            "Cache-Control": cacheControl?.makeCacheControlString()
        }) 
    });
}

export function makeResultResponse<T>(result: T, httpCode?: number) {
    return makeResponse({ result: result }, httpCode);
}

export function makeErrorResponse(reason: string, httpCode: number): Response {
    return makeResponse({ error: { message: reason } }, httpCode);
}