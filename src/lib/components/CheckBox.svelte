<script lang="ts">
    import { appendClassname } from "$lib/common/classname";

    interface Props {
        value?: boolean,
        placeholder?: string,
        class?: string,
        label?: string
        [key: string]: any
    }

    // just a fucking input element wrapped in a svelte component yes

    let {
        value = $bindable(),
        placeholder = "Input",
        label = undefined,
        class: className,
        ...others
    }: Props = $props();
</script>

{#if label}
    <label class={appendClassname("flex flex-row gap-2 items-center justify-center", className)} {...others}>
        <input bind:checked={value} class="bg-input-bg hover:bg-input-hover active:bg-input-active border border-input-border p-1" placeholder={placeholder} type="checkbox">
        <span>{label}</span>
    </label>
{:else}
    <input bind:checked={value} class={appendClassname("bg-input-bg hover:bg-input-hover active:bg-input-active border border-input-border p-1", className)} placeholder={placeholder} type="checkbox">
{/if}
