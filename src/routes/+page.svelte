<svelte:head>
    <title>ROOT</title> 
</svelte:head>
<script lang="ts">
    import { asset, assets, base, resolve, resolveRoute } from '$app/paths';
</script>



<h1 class="text-xl font-bold">hi welcome to my site</h1>
<p>so far i just have a few things here:</p>
<ul class="list-disc ml-8">
    <li><a href={resolve("/textfuscator")}>Textfuscator</a></li>
</ul>