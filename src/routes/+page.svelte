<svelte:head>
    <title>Home</title> 
    <!-- google SEO verification heheheheehhe -->
    <meta name="google-site-verification" content="ft2V6Ak_UxJv8bkfeytbSQ3X4Q1NlqIe2ghcMLLT8Ss" />
</svelte:head>
<script lang="ts">
    import { asset, assets, base, resolve, resolveRoute } from '$app/paths';
    import Content from '$lib/components/Content.svelte';
    import Dropdown from '$lib/components/Dropdown.svelte';
    import Link from '$lib/components/Link.svelte';
    import LinkList from '$lib/components/LinkList.svelte';
    import Spoiler from '$lib/components/Spoiler.svelte';
</script>

<!-- lowkey TODO: make this more professional for smth like a j*b -->
<main>
    <h1 class="text-xl font-bold">six seven</h1>

    <Content>
        <p>I am <code>brickwall2900</code>, someone who actively develops stuff... because they love it.</p>
        <!-- okay what the hell -->

        <p>I use Java as my main programming language, but I also use Python, JavaScript/TypeScript, Lua... maybe a bit of C.</p>
    </Content>

    <Content title="Hosted Projects" description="so far i just have a few things here...">
        <ul class="list-disc ml-8">
            <li><Link href={resolve("/textfuscator")}>Textfuscator</Link></li>
        </ul>
    </Content>

    <Content title="Fun facts about me!">
        <Dropdown title="What is my favorite color?">
            <span>My favorite color is</span>
            <span class="bg-green-300 dark:bg-green-600">GREEN!!!</span>
        </Dropdown>
        <Dropdown title="What is my personality type?">
            <span>I've taken multiple personality tests before</span>
            <Link href="https://www.google.com/search?q=personality+test">(by that i just looked up "personality tests" on Google)</Link>
            <span>and I have come to a conclusion that my MBTI personality type is either an</span>
            <Spoiler>INFP or an ISFP</Spoiler>
        </Dropdown>
        <Dropdown title="What is my favorite video game?">
            <p>OMORI!!!!</p>
            <p>I like this game not only for its story, but for how these characters relate to each other.</p>
            <br>
            <p class="text-amber-600 dark:text-amber-500"><strong>Warning: there are spoilers from OMORI in the following dropdowns!</strong></p>
            <Dropdown title="Can you go in-depth on why?">
                <p>Let me start by acknowledging that...</p>
                <Spoiler>I have NOT done what Sunny accidentally did to his big sister.</Spoiler>
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
                    I wish she was real, I wish I had a Mari in my life...
                </p>
            </Dropdown>
            <Dropdown title="Who do you most relate to?">
                <p><strong>Sunny.</strong></p>
                <p>I'll list out his qualities I personally relate to:</p>
                <ul class="ml-8 list-disc">
                    <li>he is quiet</li>
                    <li>he is pretty shy</li>
                    <li>he likes to daydream</li>
                </ul>
                <p>Here's what does NOT match with me and Sunny:</p>
                <ul class="ml-8 list-disc">
                    <li><Spoiler>Mari</Spoiler></li>
                    <li><Spoiler>what happened to Mari</Spoiler></li>
                    <li><Spoiler>playing violin</Spoiler></li>
                </ul>
            </Dropdown>
            <Dropdown title="Favorite song of the OMORI OST?">
                <Link href="https://www.youtube.com/watch?v=7GIWV__qx4M"><strong>OMORI OST - 005 By Your Side.</strong></Link>
                <p>
                    It was the first song I was intrigued by,
                    first song I searched while playing through the game,
                    and it represents Mari!! 
                </p>
                <Spoiler>
                    ...the positive qualities of her at least, it's shown in headspace that 
                    she cares about everyone and she'll always be there for them, 
                    always being by her side.
                </Spoiler>
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
            <!-- ts getting removed when i need to get into a j*b, corporations suuuuck i hope the ai bubble bursts -->
            <span>No AI involved for projects I make</span> 
            <span><small class="inline">except for the parts that I wanted assistance.</small></span>
            <p><strong>I don't vibecode ENTIRE projects and I am against AI art!</strong></p>
            <!-- HAHAHAHAHAHAHAHAA yessir -->
        </Dropdown>
        <Dropdown title="Why list X programming language?">
            <Dropdown title="Why list Java as my programming language?">
                <p>It is the language I use the most when programming.</p>
                <br>
                <p>
                    I started programming in Java when I was looking for ways to <strong>mod Minecraft myself.</strong>
                    I was interested how Minecraft mods modify the game and how I could do it myself too.
                </p>
                <br>
                <p>
                    I never did made my first Minecraft mod knowing absolutely nothing about the language
                    but it was when I started watching tutorials and making projects that my programming knowledge
                    <strong>shined</strong> and here we are today.
                </p>
            </Dropdown>
            <Dropdown title="Why list JavaScript/TypeScript as my programming language?">
                <p>Technically, it was my first programming language I have ever learned.</p>
                <p>I just wanted to learn what programming is and this was my starting ground.</p>
            </Dropdown>
            <Dropdown title="Why list Python as my programming language?">
                <p>Yeah...</p>
                <p>
                    I admit, I don't know half of Python's standard libraries and its features.
                    But I know just enough to make a... calculator in it I suppose.
                </p>
            </Dropdown>
            <Dropdown title="Why list Lua as my programming language?">
                <p>Because of Roblox.</p>
                <p>And because of Roblox, I am more familliar with their own version of Lua, Luau.</p>
                <em><small>I'm so used to types that for me, Lua feels cursed without types...</small></em>
            </Dropdown>
            <Dropdown title="Why list C as my programming language?">
                <p>I wanted to make an operating system by myself.</p>
                <br>
                <p>Little did I knew, it was an overcomplicated mess of assembly code first just to run C code.</p>
                <br>
                <p>
                    I'm probably exaggerating it a bit, 
                    it's just do THIS and THAT then THIS to
                    set up the environment for an operating system <small><em>(ehermm the kernel)</em></small>.

                    Still though, it's hard and tedious.
                </p>
                <em><p>I never got past making the kernel though.</p></em>
            </Dropdown>
        </Dropdown>
        <button class="rounded bg-red-600 text-white p-1 px-4 cursor-not-allowed" disabled>Okay, quiz me about the fun facts! (WIP)</button>
    </Content>
</main>