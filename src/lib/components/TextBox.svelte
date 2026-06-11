<script lang="ts">
    import { appendClassname } from "$lib/common/classname";

    interface Props {
        value?: string,
        placeholder?: string,
        class?: string,
        readonly?: boolean,
        [key: string]: any
    }

    let {
        value = $bindable(),
        placeholder = "Input",
        class: className,
        readonly = false,
        ...others
    }: Props = $props();

    // say wallahi bro ;;
    // and i gotta paste this shit 50 times bruh moments
</script>

<textarea bind:value={value} readonly={readonly} class={appendClassname("bg-input-bg border border-input-border p-1", className)} placeholder={placeholder} {...others}>{value}</textarea>