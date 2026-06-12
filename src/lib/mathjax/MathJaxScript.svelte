<script lang="ts">
    import { loadMathJax, mathJaxTypeset, unloadMathJax } from "./mathjax.global.svelte";

    $effect(() => {
        loadMathJax();
        mathJaxTypeset();
        return unloadMathJax;
    });
</script>