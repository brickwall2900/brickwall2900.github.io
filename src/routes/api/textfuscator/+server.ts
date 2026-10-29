import { makeErrorResponse, makeResultResponse } from '$lib/common/apiCommon';
import { decode, encode, type IKeyInputPair } from '$lib/textfuscator/textfuscator';
import type { RequestEvent, RequestHandler } from './$types';

/// Encodes/decodes a string from Textfuscator
export const GET: RequestHandler = async (event: RequestEvent) => {
    const params: URLSearchParams = event.url.searchParams;

    const func: string | null = params.get("function");

    if (func === null) {
        return makeErrorResponse("No function", 400);
    }
   
    if (func === "decode") {
        const key: string | null = params.get("key");
        const input: string | null = params.get("input");

        if (key === null) {
            return makeErrorResponse("Missing key", 400);
        }

        if (input === null) {
            return makeErrorResponse("Missing input", 400);
        }

        try {
            const result = await decode(input, key);
            return makeResultResponse(result);
        } catch (e) {
            console.error(e);
            return makeErrorResponse((e as Error).message, 500);
        }
    } else if (func === "encode") {
        // the input must be in json format
        const keyInputPair: string | null = params.get("keyInputPairs");
        if (keyInputPair === null) {
            return makeErrorResponse("Missing key/input pair", 400);
        }

        let keyInputPairParsed: IKeyInputPair[];
        try {
             keyInputPairParsed = JSON.parse(keyInputPair);
        } catch (e) {
            return makeErrorResponse((e as Error).message, 500);
        }

        if (typeof keyInputPairParsed === "object" && Array.isArray(keyInputPairParsed)) {
            try {
                const result = await encode(keyInputPairParsed);
                return makeResultResponse(result);
            } catch (e) {
                console.error(e);
                return makeErrorResponse((e as Error).message, 500);
            }
        } else {
            return makeErrorResponse("Bad object", 400);
        }
    }
    return makeErrorResponse("Bad function; Must only be \"decode\" or \"encode\"", 406);
};