<!-- the wordle component -->
<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import TextBox from '$lib/components/TextBox.svelte';
    import TextField from '$lib/components/TextField.svelte';
    import { onMount } from 'svelte';
    import { WordleLetterResult, type WordleResult } from './wordleCommon';
    import Dropdown from '$lib/components/Dropdown.svelte';

    export interface Props {
        class?: string,
        endpoint: string,
        chances: number,

        // wordle game context
        // must be kept by someone to persist game data
        won?: boolean,
        lost?: boolean,
        words?: string[],
        results?: WordleResult[]
        badLetters?: string[]
    }

    let {
        class: className = $bindable(""),
        chances = 6,
        endpoint,
        won = $bindable(false),
        lost = $bindable(false),
        words = $bindable([]),
        results = $bindable([]),
        badLetters = $bindable([])
    }: Props = $props();

    let wordCount = $state(5);
    let input = $state("");
    let message = $state("");
    
    let theInputBox: HTMLInputElement | undefined = $state();

    function forceFocusOnInput(e: Event) {
        e.preventDefault();
        theInputBox?.focus();
    }

    async function onWordleSubmit(e: SubmitEvent) {
        e.preventDefault();
        if (won || lost) {
            return;
        }

        const value = input.toUpperCase();

        if (value.length !== wordCount) {
            message = `${wordCount} letters are required.`;
            return;
        }

        let result: WordleResult = [];
        try {
            message = "";
            const resp = await (await fetch(endpoint, { method: "POST", body: value })).text();
            result = JSON.parse(resp).result;
        } catch (e) {
            message = String(e);
        } finally {
            input = "";
            results.push(result);
            words.push(value);
            
            let good = true;
            for (let i = 0; i < value.length; i++) {
                const letter = value.charAt(i);
                const letterResult = result[i];
                if (badLetters.indexOf(letter) === -1 && letterResult === WordleLetterResult.BAD) {
                    badLetters.push(letter);
                }

                good = good && (letterResult === WordleLetterResult.CORRECT);
            }

            if (good) {
                won = true;
                message = "You won!";
            }

            if (words.length >= chances) {
                lost = true;
            }
        }
    }

    function determineBackgroundColor(result?: WordleLetterResult) {
        console.log(result);
        if (result === WordleLetterResult.CORRECT) {
            return "#538d4e";
        } else if (result === WordleLetterResult.FOUND) {
            return "#b59f3b";
        }
        return "#00000000";
    }

    onMount(async () => {
        wordCount = JSON.parse(await (await fetch(endpoint)).text()).result;
    });
</script>

{#snippet letter(letter: string, result?: WordleLetterResult)}
    <div class="border m-0 text-center grid grid-cols-1 grid-rows-1 items-center align-text-bottom size-10 text-xl select-none" style="background-color: {determineBackgroundColor(result)};">
        <p tabindex="-1">{letter}</p>
    </div>
{/snippet}

{#snippet box(word: string, result?: WordleResult)}
    <div class="flex flex-row gap-1">
        {#each new Array(wordCount) as _, i}
            {#if wordCount >= i}
                {@render letter(word.charAt(i), result && result[i] !== undefined ? result[i] : undefined)}
            {:else}
                {@render letter("?")}
            {/if}
        {/each}
    </div>
{/snippet}

<!-- the board -->
<section class="flex flex-col items-center gap-2">
    <div class="flex flex-col gap-1 cursor-pointer" onclick={forceFocusOnInput} onkeydown={forceFocusOnInput} role="button" tabindex="0">
        {#each new Array(chances) as _, i}
            {#if words.length > i}
                {@render box(words[i], results[i])}
            {:else}
                {@render box(" ".repeat(wordCount))}
            {/if}
        {/each}
    </div>

    <Dropdown title="bad letters" class="self-start">
        <p>{badLetters.join(", ")}</p>
    </Dropdown>
    
    <form class="flex flex-col items-center gap-2" onsubmit={onWordleSubmit}>
        <TextField bind:value={input} bind:theInputBox={theInputBox} />
        <Button class="p-1 w-full" type="submit" disabled={won || lost}>Submit</Button>
        <p>{message}</p>
    </form>    
</section>