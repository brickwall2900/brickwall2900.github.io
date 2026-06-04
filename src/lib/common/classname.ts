import { twMerge } from "tailwind-merge";

export function appendClassname(cn1: string, cn2?: string): string {
    if (!cn2) {
        return cn1;
    } else {
        return twMerge(cn1, cn2);
    }
}