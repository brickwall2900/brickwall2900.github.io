<script lang="ts">
    import { applySettings, settings, THEMES_DEF } from "$lib/common/settings";
    import Button from "$lib/components/Button.svelte";
    import CheckBox from "$lib/components/CheckBox.svelte";
    import ComboBox from "$lib/components/ComboBox.svelte";
    import ModalDialog from "$lib/components/ModalDialog.svelte";

    let theme = $state(settings.theme);
    let badgeNotifs = $state(settings.bagdeNotifications);  
    let alwaysOpenLinksInNewTab = $state(settings.alwaysOpenLinksInNewTab);

    let buildId = $state("???");

    interface Props {
        showing: boolean
    }

    let { 
        showing = $bindable(false)
    }: Props = $props();

    async function getBuildId() {
        buildId = await (await fetch("/api/buildid")).text();
    }

    $effect(() => {
        settings.theme = theme;
        settings.bagdeNotifications = badgeNotifs;
        settings.alwaysOpenLinksInNewTab = alwaysOpenLinksInNewTab;
        applySettings();
    });
</script>

<ModalDialog bind:showing={showing} title="Settings">
    <main class="flex flex-col gap-2">
        <div class="grid grid-cols-2 grid-rows-5 gap-2 items-center">
            <p>Theme:</p>
            <ComboBox bind:value={theme} options={Object.keys(THEMES_DEF)} />
            <p class="row-start-2">Badge Notifications:</p>
            <CheckBox class="row-start-2" bind:value={badgeNotifs} />
            <p class="row-start-3">ALWAYS open new links in new tab*:</p>
            <CheckBox class="row-start-3" bind:value={alwaysOpenLinksInNewTab} />
            <p class="row-start-4 row-end-4 col-span-2 text-center">(*): please refresh the page to take effect</p>
            <p class="row-start-5 text-center" title={`The BuildID changes during development, while on production build, it stays the same.
The format for the BuildID is: (random id)::(build unix timestamp in base16)`}>
                Build ID: {buildId}
            </p>
            <Button class="row-start-5" onclick={getBuildId}>Fetch</Button>
        </div>
    </main>
</ModalDialog>