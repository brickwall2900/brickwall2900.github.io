import { browser } from '$app/environment';

const browserLocalStorage = globalThis.localStorage;
let localStorage: any[any] = [];
if (browser) {
    localStorage = browserLocalStorage;
}

export function putToLocalStorage(key: string, value: any) {
    //console.log(key, "<-", value);
    //console.trace();
    localStorage[key] = value;
}

export function getFromLocalStorage(key: string): any {
    return localStorage[key];
}

export function isInLocalStorage(key: string): boolean {
    return key in localStorage;
}