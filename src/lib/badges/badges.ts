import data from "$lib/badges/data.json"
import { browser } from '$app/environment';

export interface Badge {
    id: string,
    name: string,
    description: string,
    hint: string,
    isSecret: boolean
}
export type BadgeNotifyHandler = (badge: Badge) => void;

function readBadgeData(data: any): Map<string, Badge> {
    const registry = new Map<string, Badge>();
    data.forEach((value: Badge) => {
        registry.set(value.id, value);
        if (value.isSecret === undefined) {
            value.isSecret = false;
        }
    });
    return registry;
}

const BADGE_REGISTRY: Map<string, Badge> = readBadgeData(data);

const browserLocalStorage = globalThis.localStorage;
let localStorage: any[any] = [];

if (browser) {
    localStorage = browserLocalStorage;
}

let badgeNotifyHandler: BadgeNotifyHandler | undefined;

export function setBadgeNotifyHandler(value: BadgeNotifyHandler) {
    badgeNotifyHandler = value;
}

export function giveBadge(id: string) {
    const badge = BADGE_REGISTRY.get(id);
    if (badge !== undefined) {
        if (!hasBadge(id)) {
            if (badgeNotifyHandler !== undefined) {
                badgeNotifyHandler(badge);
            }
            writeBadgeState(id, true);
        }
    }
}

function writeBadgeState(id: string, gotten: boolean) {
    let badgesStorage: Array<string> = JSON.parse(localStorage["badges"] || "[]");
    if (gotten) {
        badgesStorage = [...badgesStorage, id];
    } else {
        badgesStorage = badgesStorage.filter((x) => x !== id);
    }

    localStorage["badges"] = JSON.stringify(badgesStorage);
}

function readBadgeState(id: string): boolean {
    let badgesStorage: Array<string> = JSON.parse(localStorage["badges"] || "[]");
    return badgesStorage.includes(id);
}

export function hasBadge(id: string): boolean {
    return readBadgeState(id);
}

export function getBadgeInfo(id: string): Badge | undefined {
    return BADGE_REGISTRY.get(id);
}

export function getBadgeIds(): Array<string> {
    return Array.from(BADGE_REGISTRY.keys());
}

export function revokeBadge(id: string) {
    const badge = BADGE_REGISTRY.get(id);
    if (badge !== undefined) {
        writeBadgeState(id, false);
    }
}