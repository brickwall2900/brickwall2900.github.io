import { makeResultResponse } from '$lib/common/apiCommon';
import { MAJOR_VERSION, MINOR_VERSION } from '$lib/textfuscator/textfuscator';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    return makeResultResponse({ majorVersion: MAJOR_VERSION, minorVersion: MINOR_VERSION });
};