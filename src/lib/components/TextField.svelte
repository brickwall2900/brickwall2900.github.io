<script lang="ts">
    import { appendClassname } from "$lib/common/classname";

    interface Props {
        value?: string,
        placeholder?: string,
        class?: string,
        theInputBox?: HTMLInputElement,
        [key: string]: any
    }

    // just a fucking input element wrapped in a svelte component yes

    let {
        value = $bindable(),
        placeholder = "Input",
        class: className,
        theInputBox = $bindable(),
        ...others
    }: Props = $props();
</script>

<input bind:value={value} bind:this={theInputBox} class={appendClassname("bg-input-bg border border-input-border p-1", className)} placeholder={placeholder} type="text" {...others}>
