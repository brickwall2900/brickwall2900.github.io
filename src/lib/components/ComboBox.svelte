<script lang="ts">
    import { appendClassname } from "$lib/common/classname";

    interface Props {
        value?: string,
        placeholder?: string,
        class?: string,
        options: string[],
        [key: string]: any
    }

    // at least it's not an input element this time

    let {
        value = $bindable(),
        placeholder = "Input",
        class: className,
        options,
        ...others
    }: Props = $props();
</script>

<select bind:value={value} class={appendClassname("bg-input-bg border hover:bg-input-hover active:bg-input-active border-input-border col-start-2 col-end-4 p-1", className)} {...others}>
    {#each options as option}
        <option value={option}>{option}</option>
    {/each}
</select>