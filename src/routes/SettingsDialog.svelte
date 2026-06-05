<script lang="ts">
    import { applySettings, settings, THEMES_DEF } from "$lib/common/settings";
    import Button from "$lib/components/Button.svelte";
    import CheckBox from "$lib/components/CheckBox.svelte";
    import ComboBox from "$lib/components/ComboBox.svelte";
    import ModalDialog from "$lib/components/ModalDialog.svelte";

    let theme = $state(settings.theme);
    let badgeNotifs = $state(settings.bagdeNotifications);

    interface Props {
        showing: boolean
    }

    let { 
        showing = $bindable(false)
    }: Props = $props();

    $effect(() => {
        settings.theme = theme;
        settings.bagdeNotifications = badgeNotifs;
        applySettings();
    });
</script>

<ModalDialog bind:showing={showing} title="Settings">
    <main class="flex flex-col gap-2">
        <div class="grid grid-cols-2 grid-rows-2 grid-flow-col gap-2 items-center">
            <p>Theme:</p>
            <ComboBox bind:value={theme} options={Object.keys(THEMES_DEF)} />
            <p>Badge Notifications:</p>
            <CheckBox bind:value={badgeNotifs} />
        </div>
    </main>
</ModalDialog>