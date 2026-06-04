<script lang="ts">
    import { appendClassname } from "$lib/common/classname";

    interface Props {
        value?: string,
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

<input bind:value={value} class={appendClassname("bg-white dark:bg-gray-600 border border-black p-1", className)} placeholder={placeholder} type="text" {...others}>
