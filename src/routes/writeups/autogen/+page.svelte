<script lang="ts">
    import { downloadFile, uploadDirectory, uploadFile } from '$lib/common/downloadHelper';
    import Button from '$lib/components/Button.svelte';
    import Content from '$lib/components/Content.svelte';
    import TextBox from '$lib/components/TextBox.svelte';
    import TextField from '$lib/components/TextField.svelte';
    import { BlobReader, ZipReader } from '@zip.js/zip.js';
    import type { PageProps } from './$types';
    import UploadBox from '$lib/components/UploadBox.svelte';
    import { generateWriteup } from '$lib/common/writeups';

    let { data }: PageProps = $props();

    const TEXT_DECODER: TextDecoder = new TextDecoder("UTF-8");

    let status: string = $state("Upload");

    let name: string = $state("");
    let description: string = $state("");

    let markdown: File[] | null = $state(null);
    let coverImage: File | null = $state(null);
    let statusMessage: string | null = $state(null);

    function uploadMarkdown(directory: File[] | null) {
        markdown = directory;
    }

    function uploadCoverImage(image: File | null) {
        coverImage = image;
    }

    function onGenerate(e: Event) {
        try {
            if (name.length == 0) {
                throw TypeError("Name is left blank");
            }

            if (markdown === null) {
                throw TypeError("Markdown missing");
            }

            statusMessage = "Creating...";

            generateWriteup(name, description, markdown, coverImage)
                .then((writeupData) => {
                    const writeupDataString = JSON.stringify(writeupData);
                    downloadFile(new Blob([writeupDataString]), "writeup.json");
                })
                .catch((e) => {
                    if (e instanceof Error) {
                        const err = e as Error;
                        statusMessage = err.message;
                    } else {
                        statusMessage = "IDK please js look at the console";
                    }
                    console.error(e);
                });

            statusMessage = "";
        } catch (e: any) {
            if (e instanceof Error) {
                const err = e as Error;
                statusMessage = err.message;
            } else {
                statusMessage = "IDK please js look at the console";
            }
            console.error(e);
        }
    }
</script>

<Content title="Writeup Generator">
    This generates the nessecary data for displaying a writeup on my website.

    <article class="grid grid-cols-2 auto-cols-auto gap-2 items-center">
        <p>Name:</p>
        <TextField bind:value={name} placeholder="My Awesome Project" />

        <p>Description:</p>
        <TextBox bind:value={description} />

        <p>Content:</p>
        <div class="flex flex-col gap-2">
            <UploadBox fileUploadMode="DIRECTORY" onupload={uploadMarkdown} />
        </div>

        <p>Cover Image:</p>
        <div class="flex flex-col gap-2">
            <UploadBox fileUploadMode="FILE" onupload={uploadCoverImage} accept="image/*" />
        </div>
    </article>
    <Button class="w-full" onclick={onGenerate}>Generate!</Button>
    {#if statusMessage}
        <p class="text-orange-500 font-bold">{statusMessage}</p>
    {/if}
</Content>