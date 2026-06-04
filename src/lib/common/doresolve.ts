import { resolve } from '$app/paths';

let iresolve: (path: any) => any = resolve;

// silence!!
// dunno if this is a good idea though
export function doResolve(path: string): string {
    return iresolve(path);
}