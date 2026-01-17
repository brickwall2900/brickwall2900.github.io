<svelte:head>
    <title>Projects</title> 
</svelte:head>

<script>
    import ProjectItem from "./ProjectItem.svelte";
    import { asset } from "$app/paths";
    import Image from "$lib/components/Image.svelte";
    import Content from "$lib/components/Content.svelte";

</script>

<main>
    <Content title="Projects I Made" description="These are the projects I actually MADE!!">
        <hr>
        <ProjectItem name="Birthday Reminder" links={["https://github.com/brickwall2900/BirthdayReminder"]}>
            <div class="grid grid-cols-3 gap-2">
                <div class="col-span-2">
                    <p>quoted from README: "🍰🎉 Never forget any of your friends' birthdays with this one!"</p>
                    <p>A desktop app built in Java that simply stores birthdays and reminds you of upcoming ones.</p>
                    <p>I made this simply because I tend to forget my friends' birthdays. (Please don't take that the wrong way!)</p>
                </div>
                <Image src={asset("/assets/projects/birthdayReminder.png")} alt="Birthday Reminder's window." class="place-self-end" />
            </div>
        </ProjectItem>
        <ProjectItem name="1/10000 chance for Withered Foxy Jumpscare every second" links={["https://github.com/brickwall2900/Java-Foxy-Jumpscare"]}>
            <div class="grid grid-cols-3 gap-2">
                <div class="col-span-2">
                    <p class="inline">Inspired by </p>
                    <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3481943642" class="underline text-blue-700 dark:text-blue-300">this Terarria mod.</a>
                    <p>For every second, a jumpscare might appear in your screen in every 1 in 10000 chance.</p>
                    <p>In this application, there's only one built-in jumpscare: foxy himself. However, other jumpscares can be added via a configuration file.</p>
                </div>
                <Image src={asset("/assets/projects/foxy.png")} alt="Birthday Reminder's window." class="place-self-end" />
            </div>
        </ProjectItem>
        <ProjectItem name="brickwall2900.github.io" links={["https://github.com/brickwall2900/brickwall2900.github.io", "https://brickwall2900.github.io"]}>
            <p>Yes. It's the website you're looking at right now. I consider this as one of my projects.</p>
            <p>My own personal website that I can throw anything in.</p>
            <p>Current built in Svelte and hosted on GitHub Pages.</p>
        </ProjectItem>
        <ProjectItem name="Textfuscator" links={["https://brickwall2900.github.io/textfuscator"]}>
            <div class="grid grid-cols-3 gap-2">
                <div class="col-span-2">
                    <p>A text obfuscation tool designed to obfuscate MULTIPLE texts onto a SINGLE text by a key-based retrival system.</p>
                    <p>It can obfuscate text by XOR and AES encryption.</p>
                </div>
                <Image src={asset("/assets/projects/textfuscator.png")} alt="Textfuscator" class="place-self-end" />
            </div>
        </ProjectItem>
    </Content>

    <Content title="Projects I Helped" description="The following are the projects I have helped and contributed in!">
        <hr>
        <ProjectItem name="Sequestree" links={["https://sequestree.net", "https://sequestree.streamlit.app/"]}>
            <div class="grid grid-cols-3 gap-2">
                <div class="col-span-2">
                    <p>A website I have helped made for my friend in their research and their science fair competition!</p>
                    <p>It is a website in Streamlit that visualizes the tree biomass, carbon stock, and carbon sequestration potential of Quezon City, Philippines.</p>
                </div>
                <Image src={asset("/assets/projects/sequestree.png")} alt="Sequestree website in Streamlit." class="place-self-end" />
            </div>
        </ProjectItem>
    </Content>

    <Content 
        title="Projects I'm Working On" 
        description="These are projects that have never (yet) seen the light of day ever. 
            One day, these may go public if I wish so (and if there's a use case for it).
            Projects here MAY get shelved or will be forever abandoned... Please bug me if that's the case.">
            <hr>
        <ProjectItem name="Autostarts">
            <p>An application that starts on OS boot that starts up more applications.</p>
            <p>I know, a startup hog, even written in Java... It can be easily customized for what applications to run on boot and IF it can run on boot.</p>
        </ProjectItem>
        <ProjectItem name="Arcana">
            <p>A Java Swing framework that majorly changes how we use Swing.</p>
            <p>Introducing...</p>
            <ul class="list-disc ml-8">
                <li>controllers for JComponents</li>
                <li>target fields that can be assigned to any JComponent</li>
                <li>subscriber methods listening to an EventListener for any JComponent</li>
            </ul>
            <p>It is work in progress, I just need to test out its features to see if this project is easy to use developer experience (DX) wise.</p>
        </ProjectItem>
        <ProjectItem name="Polonium">
            <p>In this application, files decay over time. As the files grow older and older, they move themselves into trash and later, they eventually delete themselves.</p>
            <p>This helps with disk space management... where you have hundreds of files you don't need anymore and you need to clean up space.</p>
            <p>Not being worked on right now, I need to find a way how to NOT annoy the user about their files getting deleted all the time while doing its own actual job.</p>
        </ProjectItem>
        <p>I'm planning to work on a game specifically made for someone :) ...but let's keep that a secret!</p>
    </Content>
</main>