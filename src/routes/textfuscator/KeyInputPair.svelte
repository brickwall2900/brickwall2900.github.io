<script lang="ts">
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

<div class="flex flex-col bg-gray-400 dark:bg-gray-700 p-4 gap-2">
    <input bind:value={key} class="bg-white dark:bg-gray-600 border border-black p-1" placeholder="Key" type="text">
    <textarea bind:value={input} class="bg-white dark:bg-gray-600 border border-black p-1" placeholder="Input"></textarea>
    <div class="grid grid-cols-3 grid-flow-col auto-cols-auto">
        <p class="col-start-1 col-end-2">Obfuscation mode:</p>
        <select bind:value={mode} class="bg-white dark:bg-gray-600 border hover:bg-gray-500 border-black col-start-2 col-end-4 p-1">
            <option value="XOR">XOR</option>
            <option value="AES_GCM">AES_GCM</option>
            <option value="AES_GCM_PBKDF2">AES_GCM_PBKDF2</option>
        </select>
    </div>
    <div class="grid grid-cols-3 grid-flow-col auto-cols-auto">
        <p class="col-start-1 col-end-2">Compressed:</p>
        <input type="checkbox" bind:checked={compressed} class="bg-white border col-start-2 col-end-4 object-right" />
    </div>
    <button onclick={onRemoveClickedWrapper} class="bg-red-700 hover:bg-red-800 active:bg-red-900 border text-white border-black p-1">Remove</button>
</div>