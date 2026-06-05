import { twMerge } from "tailwind-merge";

export function appendClassname(cn1: string, cn2?: string): string {
    const result = !cn2 ? cn1 : twMerge(cn1, cn2);
    console.log("tailwind merge: %s + %s = %s", cn1, cn2, result);
    return result;
}