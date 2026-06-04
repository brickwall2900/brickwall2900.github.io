<script lang="ts">
    import { appendClassname } from "$lib/common/classname";

    interface Props {
        value?: string,
        placeholder?: string,
        class?: string
        [key: string]: any
    }

    let {
        value = $bindable(),
        placeholder = "Input",
        class: className,
        ...others
    }: Props = $props();

    // say wallahi bro ;;
    // and i gotta paste this shit 50 times bruh moments
</script>

<textarea bind:value={value} class={appendClassname("bg-white dark:bg-gray-600 border border-black p-1", className)} placeholder={placeholder} {...others}></textarea>