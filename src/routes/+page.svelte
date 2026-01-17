<svelte:head>
    <title>Home</title> 
    <!-- google SEO verification heheheheehhe -->
    <meta name="google-site-verification" content="ft2V6Ak_UxJv8bkfeytbSQ3X4Q1NlqIe2ghcMLLT8Ss" />
</svelte:head>
<script lang="ts">
    import { asset, assets, base, resolve, resolveRoute } from '$app/paths';
    import Dropdown from '$lib/components/Dropdown.svelte';
    import LinkList from '$lib/components/LinkList.svelte';
    import Spoiler from '$lib/components/Spoiler.svelte';
</script>



<h1 class="text-xl font-bold">six seven</h1>

<!-- lowkey TODO: make this more professional for smth like a j*b -->

<section class="flex flex-col p-4 gap-4 bg-gray-200 dark:bg-gray-800 m-4 max-w-7xl mx-auto">
    <p>I am <code>brickwall2900</code>, someone who actively develops stuff... because they love it.</p>
    <!-- okay what the hell -->

    <p>I use Java as my main programming language, but I also use Python, JavaScript/TypeScript, Lua... maybe a bit of C.</p>
</section>

<section class="flex flex-col p-4 bg-gray-200 dark:bg-gray-800 m-4 max-w-7xl mx-auto">
    <h2 class="text-3xl font-bold w-full text-center">Hosted Projects</h2>
    <p>so far i just have a few things here:</p>
    <ul class="list-disc ml-8">
        <li><a href={resolve("/textfuscator")}>Textfuscator</a></li>
    </ul>
</section>

<section class="flex flex-col p-4 gap-4 bg-gray-200 dark:bg-gray-800 m-4 max-w-7xl mx-auto">
    <h2 class="text-3xl font-bold w-full text-center">Fun facts about me!</h2>
    <Dropdown title="What is my favorite color?">
        <span>My favorite color is</span>
        <span class="bg-green-300 dark:bg-green-600">GREEN!!!</span>
    </Dropdown>
    <Dropdown title="What is my personality type?">
        <span>I've taken multiple personality tests before</span>
        <a class="underline text-blue-700 dark:text-blue-300" href="https://www.google.com/search?q=personality+test">(by that i just looked up "personality tests" on Google)</a>
        <span>and I have come to a conclusion that my MBTI personality type is either an</span>
        <Spoiler>INFP or an ISFP</Spoiler>
    </Dropdown>
    <Dropdown title="What is my favorite videogame?">
        <p>OMORI!!!!</p>
        <p>I like this game not only for its story, but for how these characters relate to each other.</p>
        <p class="text-amber-600 dark:text-amber-500"><strong>Warning: there are spoilers from OMORI in the following dropdowns!</strong></p>
        <Dropdown title="Can you go in-depth on why?">
            <p>Let me start by acknowledging that <Spoiler>I have NOT pushed my sister down the stairs.</Spoiler></p>
            <Spoiler>
                <p>
                    I like the parts of the game where Sunny is in the real world.
                    It's like he's rediscovering what it has become since the past 4 years he locked himself up.
                    Over time, with the help of Kel and Hero, they eventually rebuild what was left of the friend group.
                </p>
            </Spoiler>
        </Dropdown>
        <Dropdown title="Who is your favorite character?">
            <p><strong>MARI!</strong></p>
            <p>
                She's a kind, nurturing figure that holds everyone together in the friend group.
                We never see her in the real world but based on Sunny's headspace, she was really caring about him.
                <!-- TODO -->
                I wish she was real, I wish I had a MARI in my life...
            </p>
        </Dropdown>
        <Dropdown title="Who do you most relate to?">
            <p><strong>Sunny.</strong></p>
        </Dropdown>
    </Dropdown>
    <Dropdown title="My favorite programming language?">
        <p>
            You'd think it would be Java... but I on't appreciate it as much as I like to.
            It is a good programming language, but I'd rather choose something like Lua since it's a bit simpler.
        </p>
    </Dropdown>
    <Dropdown title="Am I proficient in X programming language?">
        <p>please don't expect me to be lvl 100 in any programming language /ᐠ｡ꞈ｡ᐟ\... maybe except Java.</p>
    </Dropdown>
    <Dropdown title="Where can you find my social media?">
        <LinkList links={["https://github.com/brickwall2900"]} />
        <p>My other social media are kept private.</p>
    </Dropdown>
    <Dropdown title="Do I vibecode?">
        <p>
            Nope. I don't rely on AI ALL OF THE TIME.
            It's fine if I use it as a tool but I don't vibecode entire projects with AI.
            <!-- ts getting removed when i need to get into a j*b, corporations suuuuck i hope the ai bubble bursts -->
            I agree that AI art is bad too.
        </p>
        <span>No AI involved for projects I make</span> 
        <span>
            <small class="inline">
            except for the parts that I wanted assistance.
            <strong>I don't vibecode ENTIRE projects and I am against AI art!</strong></small>
        </span>
        <!-- HAHAHAHAHAHAHAHAA yessir -->
    </Dropdown>
    <button class="rounded bg-red-600 text-white p-1 px-4 cursor-not-allowed" disabled>Okay, quiz me about the fun facts! (WIP)</button>
</section>