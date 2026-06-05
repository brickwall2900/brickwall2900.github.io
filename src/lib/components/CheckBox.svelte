<script lang="ts">
    import { appendClassname } from "$lib/common/classname";

    interface Props {
        value?: boolean,
        placeholder?: string,
        class?: string,
        [key: string]: any
    }

    // just a fucking input element wrapped in a svelte component yes

    let {
        value = $bindable(),
        placeholder = "Input",
        class: className,
        ...others
    }: Props = $props();
</script>

<input bind:checked={value} class={appendClassname("bg-input-bg hover:bg-input-hover active:bg-input-active border border-input-border p-1", className)} placeholder={placeholder} type="checkbox" {...others}>
