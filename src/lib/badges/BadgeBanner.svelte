<script lang="ts">
    import { slide } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { asset, resolve } from '$app/paths';
    import { giveBadge, setBadgeNotifyHandler, type Badge } from "./badges";

    const BADGE_ASSET_URL = "assets/badges/";
    type ActiveNotification = Badge & { uid: number };
    
    let bannerShowing = $state(false);
    let notifications = $state<ActiveNotification[]>([]);
    let uidCounter = 0;

    function onBadgeGotten(badge: Badge) {
        const currentUid = uidCounter++;
        const newNotification: ActiveNotification = { 
            ...badge, 
            uid: currentUid 
        };
        notifications = [...notifications, newNotification];

        setTimeout(() => {
            removeNotification(currentUid);
        }, 5000);
    }

    function removeNotification(uid: number) {
        notifications = notifications.filter(n => n.uid !== uid);
    }

    setBadgeNotifyHandler(onBadgeGotten);
</script>

<div class="fixed right-0 bottom-8 flex flex-col items-end gap-2 pr-4 pointer-events-none z-50">
    {#each notifications as notif (notif.uid)}
        <div 
            class="flex flex-col p-3 pr-4 bg-amber-200 text-black shadow-lg shadow-amber-300/50 ring-2 ring-amber-600 rounded-tl-md rounded-bl-md pointer-events-auto"
            transition:slide={{ duration: 500, axis: "x" }}
            animate:flip={{ duration: 300 }}>
            <div class="flex flex-row gap-4">
                <enhanced:img 
                    class="relative h-12" 
                    src={asset(BADGE_ASSET_URL + notif.id + ".png")} 
                    alt="Badge"/>
                <div>
                    <h3 class="font-bold text-xs whitespace-nowrap">BADGE AWARDED!</h3>
                    <h4 class="font-bold text-xl whitespace-nowrap">{notif.name}</h4>
                </div>
            </div>
        </div>
    {/each}
</div>