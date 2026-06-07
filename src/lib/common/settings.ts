import { browser } from "$app/environment";
import { giveBadge } from "$lib/badges/badges";
import { getFromLocalStorage, isInLocalStorage, putToLocalStorage } from "./localstorage";

export type ThemeDef = {
    friendlyName: string,
    dataName: string
};

export const THEMES_DEF: {[key: string]: ThemeDef} = {
    light: { friendlyName: "Light", dataName: "light" },
    dark:  { friendlyName: "Dark",  dataName: "dark"  },
};

export interface Settings {
    theme: string,
    bagdeNotifications: boolean
};

export let settings: Settings = {
    theme: "dark",
    bagdeNotifications: true
};

export function loadSettings() {
    //console.log(getFromLocalStorage("badgeNotifications"));
    //console.trace();
    let theme: string = browser ? getFromLocalStorage("theme") || 
		(!(isInLocalStorage("theme")) && window.matchMedia('(prefers-color-scheme: dark)').matches) && "dark" : "dark";
    settings.theme = theme;
    let badgeNotifs: string | undefined = getFromLocalStorage("badgeNotifications");
    settings.bagdeNotifications = badgeNotifs !== undefined ? badgeNotifs === "true" : true;
}

function applyTheme() {
    let theme: ThemeDef = THEMES_DEF[settings.theme];
    let finalDataTheme = theme ? theme.dataName : "light";
    document.documentElement.setAttribute("data-theme", finalDataTheme);
    if (getFromLocalStorage("theme") && finalDataTheme !== getFromLocalStorage("theme")) {
        giveBadge("dark_mode_toggle");
    }
    putToLocalStorage("theme", finalDataTheme);
}

function applyBadgeNotifications() {
    putToLocalStorage("badgeNotifications", settings.bagdeNotifications);
}

export function applySettings() {
    applyTheme();
    applyBadgeNotifications();
};