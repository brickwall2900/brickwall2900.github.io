<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import CheckBox from "$lib/components/CheckBox.svelte";
    import ComboBox from "$lib/components/ComboBox.svelte";
    import TextBox from "$lib/components/TextBox.svelte";
    import TextField from "$lib/components/TextField.svelte";

    let { 
        key = $bindable(), 
        input = $bindable(), 
        mode = $bindable("XOR"),
        compressed = $bindable(false),
        onRemoveClicked = () => {} } = $props();

    function onRemoveClickedWrapper() {
        onRemoveClicked();
    }
</script>

<div class="flex flex-col bg-gray-400 dark:bg-gray-900 p-4 gap-2">
    <TextField bind:value={key} placeholder="Key" />
    <TextBox bind:value={input} placeholder="Input"></TextBox>
    <div class="grid grid-cols-3 grid-flow-col auto-cols-auto items-center">
        <p class="col-start-1 col-end-2">Obfuscation mode:</p>
        <ComboBox bind:value={mode} options={["XOR", "AES_GCM", "AES_GCM_PBKDF2"]} />
    </div>
    <div class="grid grid-cols-3 grid-flow-col auto-cols-auto items-center">
        <p class="col-start-1 col-end-2">Compressed:</p>
        <CheckBox bind:value={compressed} />
    </div>
    <Button onclick={onRemoveClickedWrapper} class="bg-red-700 hover:bg-red-800 active:bg-red-900 border text-white border-black p-1">Remove</Button>
</div>