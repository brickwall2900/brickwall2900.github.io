<script lang="ts">
    import CheckBox from '$lib/components/CheckBox.svelte';
    import Codeblock from '$lib/components/Codeblock.svelte';
    import Image from '$lib/components/Image.svelte';
    import Link from '$lib/components/Link.svelte';
    import Spoiler from '$lib/components/Spoiler.svelte';
    import WriteupContent from '../WriteupContent.svelte';
    import { header } from '../WriteupContent.svelte';
    import type { PageProps } from './$types';
    import { getContext, setContext } from 'svelte';

    let { data }: PageProps = $props();

    let options = getContext<{ swearing: boolean }>("options");

</script>

<!-- markdown to html type shit -->
<Image 
    src="/assets/writeups/linux-first-experience/photo1.png"
    alt="My Linux Mint Cinammon desktop"
    caption="My Linux Desktop"
    requiresImageViewer={true} />
<p>I've switched to Linux since mid-April of 2026 and it's been quite great so far! Coming from Windows, I can confidently say that I'm never going back again, and that I'm willing to install Linux again in another machine if I had one.</p>
<p>But how is the overall experience like? How was your installation? Did everything from your Windows installation work as well as it did in Linux?</p>
<p>I'm going to talk about what my overall experience in Linux has been, and how I'll use this "operating system" in the future.<br>
Spoilers: it has been okay so far with some minor hiccups here and there, you'll see...</p>
{@render header(2, "Background and My First Actual Linux Experience")}
<p>I was aware about Linux in like... the 2021s or so, when <Link href="https://www.youtube.com/watch?v=OAy945DZvp8">SomeOrdinaryGamers told me to install Linux</Link>, and when <Link href="https://youtu.be/0506yDSgU7M?t=632">Linux from LTT blew up his installation just by installing Steam</Link>. I actually had prior operating system knowledge at that time... that pertaining to only Windows and only other Windows versions. I knew how to program code at a beginner level, making Java-based desktop apps in NetBeans, which just looks horrifying looking back at it now.</p>
<p>I had a Lenovo ThinkPad E430 at that time. It is the one I used back until 2025.</p>
<p>I explored different WIndows versions, installing them in VirtualBox, all ranging from Windows XP, Windows 7 (my beloved), even Windows 10. The stupid ThinkPad ran Windows 7 out-of-the-box, and it has a hard drive in it!! Imagine how slow it is and how long you had to wait trying to even boot from it in the first place, I was suffering through HDD speeds at the start. That's why running Windows 10 on this thing was not such a great experience, it was just subpar at best.</p>
<p>When my eyes landed on Linux, well -- I naturally tried <Link href="https://ubuntu.com/">Ubuntu</Link> first. Searching from Google told me that it was this "beginner friendly distro" and that I should try it out. I quickly grabbed the Ubuntu 22.04 ISO image, created an operating system in VirtualBox, and it was time for me to boot and try Linux for the very first time!!</p>
<p>It went... terrible. Installing it was a hurdle enough because of the hard drive speeds, using it even was terrible in it itself. My computer only had 4 GB of RAM. Windows as the host OS was thrashing memory and Ubuntu was dying even more. I assigned 2 GB of RAM to Ubuntu so anything barely worked, no surprises. They were crawling for that little RAM usage and the swap was getting used up so much (I DID set up the <code>vm.swappiness</code> value to a high number, that's why lol).</p>
<p>After a few days of using it, I just didn't even touch Linux from VirtualBox. Maybe I wasn't ready for it, maybe another time.</p>
{@render header(2, "My Second Linux Experience")}
<p>Now in mid-April of 2022, I set up... <Link href="https://ph-live-01.slatic.net/p/0c7115b6684f32a01dec9c27f328a26e.jpg">this... thing</Link>, this time with an SSD in it to make it faster! I installed Windows 7 in it, months after it has hit End of Life, maybe I miss Windows 7. It was my childhood operating system after all.</p>
<p>The machine specification goes like this:</p>
<ul class="list-disc ml-8">
<li>CPU: Intel Core i3-2350M @ 2.30 GHz</li>
<li>GPU: NVIDIA GeForce GT 520M</li>
<li>RAM: 4 GB; DDR3</li>
<li>SSD: Crucial MX500 500 GB</li>
<li>WiFi Adapter: Intel Centrino Wireless-N 2230
</li>
This thing is really really ancient.
</ul>
<p>Here is the point where I try Linux again, specifically Ubuntu again.</p>
<p>This time, I was installing it on real hardware. It had the benefits of not being stuck inside a virtual machine, full 4 GB of RAM usage, and a blazing fast SSD!</p>
<p>Surely, nothing will not let me down in my Linux journey, right?</p>
<p>I installed it, which was pretty quick. I had to install alongside the Windows partition -- just to be safe of course, then I booted into Ubuntu.</p>
<p>I logged in to my accounts in Firefox, installed Java and NetBeans to work on my projects, even created a Canonical account to use with Ubuntu.</p>
<p>But there were one or many things wrong that made the transition ROUGH. I'll list them out for you.</p>
<ol class="list-disc ml-8">
<li>I did NOT expect Caps Lock to act differently in Linux and Windows.<br>
<em>See, I (used to) press Caps Lock for every word I capitalized...</em><br>
When I was trying to type out words, I was confused on why the second letter was left capitalized. I searched this problem on Google and I found out about this behavior..<br>
Pressing the Caps Lock key the second time when it's toggled on presents some differences between Windows and Linux.
<ul class="list-disc ml-8">
<li>On Windows, pressing the Caps Lock key in this state IMMEDIATELY toggles it in the off state.</li>
<li>On LInux however, pressing the Caps Lock key in this state does NOT immediately toggle it to the off state.<br>
I got really frustrated on that behavior alone and I just went insane about it.</li>
</ul>
</li>
<li>There was screen tearing and I couldn't toggle it off. Things also didn't feel snappy and smooth. It kinda threw me off to be honest.</li>
<li>I felt that... GNOME (the desktop environment being used here) is kinda hogging up my system resources.<br>
No shade to GNOME though, but it felt graphically intense for this weak, ancient ahh computer to the point where it slows down and eats up all the CPU. Not a good combination in my honest opinion. I should've used a distro with a lighter desktop environment.</li>
<li>My files and projects could not be transferred smoothly.<br>
All my stuff was on the Windows partition and I could not immediately transfer it all onto the Linux partition. This made it really hard to switch seamlessly to Linux even if I wanted it to. I had no external hard drives at the time.</li>
</ol>
<p>Then after a few days, I just straight up uninstalled Ubuntu. I deleted the partition Ubuntu resides in, not before making a minor slip-up...</p>
{@render header(3, "How I manage to UNINSTALL Windows (and recover it back)")}
<p>I booted a live USB image of Windows 7 PE so I can mess with <code>diskpart</code> stuff there without messing with my Windows installation, at least that was the plan. I opened the Command Prompt, opened <code>diskpart</code>, and selected the disk and partition I was going to erase.</p>
<p>My partition table looked like:</p>
<Spoiler>
<Codeblock language="text" copyEnabled={false} filename="diskpart output kinda" code={`
partition 1: system reserved via Windows
partition 2: windows installation
partition 3: ???
partition 4: ubuntu installation
`} /></Spoiler>
<p>I typed: <code>sel partition 2</code>.<br>
then because of the nature of primary and active disks, I could not do a regular old <code>delete partition</code>. I had to override it.</p>
<p>so then I executed <code>delete partition override</code> and confidently pressed Enter.</p>
<Spoiler><p>It was the moment that I knew, I {options.swearing ? "fucked" : "screwed"} up. I deleted my Windows installation instead of my Ubuntu one.</p></Spoiler>
<p>I proceeded to just delete the Ubuntu installation and burned another Windows PE from another computer, this time with <Link href="https://www.cgsecurity.org/wiki/TestDisk">TestDisk</Link> installed since I intuitively knew deleting a partition was like deleting a file: it only marks the partition as unused space, so if I could bring it back as used space again, them I'm all good.</p>
<p>I recovered back my partition, set it to bootable... this and that...</p>
<p>... minor mistake over. I'll move on and try Linux someday soon.</p>
{@render header(2, "My Current Linux Experience")}
<p>I thought of installing Linux since 2024. I also used <Link href="https://distrochooser.de/">https://distrochooser.de/</Link> and did some process of elimination for me to choose a distro. Maybe it's Ubuntu, but I suppose I'll try something new this time.</p>
<p>My choices and decisions have let me to finally choose one distro: <Spoiler><Link href="https://www.linuxmint.com/">Linux Mint</Link></Spoiler>.</p>
<p>I heard it's really beginner friendly, is based in Ubuntu, and said to have a Windows-like experience without disrupting existing workflows within the Windows environment.</p>
<p>Remember the laptop I installed Ubuntu on a while ago? That laptop suddenly died on me without explanation and I had to switch to the ThinkPad. Don't worry, it has Windows 10 in it so switching disks and running it on completely different hardware went totally okay -- except for the license.</p>
<p>Yeah, I had to get the Windows license off from died laptop, you know the sticker some manufacturers put at the bottom with the license key in it. That's all taken care of. (also I transferred the 4 GB RAM from the dead laptop so the ThinkPad has 8 GB of RAM now)</p>
<p>Now I want to install Linux Mint, or at least try it. So I grabbed a spare USB, then put Linux Mint on it. I have learned my lessons on running a heavy desktop environment on such an ancient piece of tech, and that I learned Xfce runs great on low-end hardware, so I grabbed that <Link href="https://www.linuxmint.com/download.php#:~:text=Xfce,usage">type of desktop environment</Link> as advertised in their download page.</p>
<Image 
    src="/assets/writeups/linux-first-experience/photo2.jpg" 
    alt="My ThinkPad running Linux Mint, it's on the terminal booting up"
    caption="My ThinkPad running Linux Mint... (trust me it's the only picture I could find ;-;)"
    requiresImageViewer={true} />
<p>It worked great! I saw the resource usage, particularly the RAM usage decreased compared to Windows. I explored around the Live desktop environment for a bit, logged into Firefox and then into my Google account, and everything worked great.</p>
<p>Except of course... the Caps Lock problem is still there. It was the moment when I found out people <strong>normally</strong> use Shift instead of Caps Lock for capitalizing one letter. <strong>Yikes</strong>.</p>
<p>I decided to defer installing Linux Mint for a moment. Because of one detail I left out, and that the ThinkPad laptop was acting {options.swearing ? "like shit" : "horribly"}, worse than the other laptop where it died suddenly, as you can see from the picture, the ThinkPad has a pink -- whatever looking thing on the screen that glitches occasionally, and keys are getting pressed randomly without me even pressing them.</p>
<p>Some weird {options.swearing ? "shit" : "stuff"} is going on with that ThinkPad and I think it's haunted.</p>
<p>Some time in April 2025, it bit the dust. It died and it won't boot up ever again. That's a shame, now I have no more computers to work with. If only I could count Android as a Linux distro I use often...</p>
{@render header(3, "The \"almost\" Great Linux Installation... (and a brand new nugget)")}
<p>But on October 2025, some miracle happened and I got an Acer Aspire 3. It's my current laptop I'm using right now and mind you, it's neither okay nor bad. It just works. I'm using it for programming, school, and some light gaming on here.</p>
<p>System Specifications:</p>
<ul class="list-disc ml-8">
<li>Model: Acer Aspire 3: A315-59</li>
<li>CPU: 12th Gen Intel© Core™ i5-1235U × 10</li>
<li>GPU: just integrated graphics ;(</li>
<li>RAM: 8 GB; DDR4</li>
<li>WiFi card: MediaTek MT7902</li>
<li>SSD: WD PC SN740 NVMe; 1 free NVMe slot; 1 free SATA slot</li>
</ul>
<p>It had Windows 11 preinstalled (<em>I hoped I did NOT get Windows 11 preinstalled.</em>) I customized my Windows 11 installation to my liking, and it looked pretty nice. Faster than my two ancient laptops by the way. I got the ThinkPad's drive and installed it onto the free SATA slot, and now I have access to all of my files.</p>
<p><strong>But from the very beginning, I thought about Linux FROM THE START!</strong></p>
<p>I did not waste time backing up my files, formatting the SSD drive from the ThinkPad, then organizing my files in such a way that I could access it easily within both operating systems.</p>
<p>I also had a spare NVMe drive -- somehow, maybe it was luck. Introducing the WDC PC SN730. I now had 512 GB + 512 GB + 500 GB of storage, one for Windows, one for the soon-to-be Linux installation, and one for my files. All SSDs so I need to be careful about my writes on there. The Crucial MX500 has gotten significant wear on its writes because Windows was installed on there previously.</p>
<p>After 5 or so months of having this laptop, being so busy in schoolwork amongst other things, I finally got the chance of installing Linux once I was free from school by graduation.</p>
<p>One night, I have the really sudden urge out of nowhere to install Linux. After not having slept for 20+ hours, I chose to install Linux Mint right there on my Linux drive. This time, it's the <Link href="https://www.linuxmint.com/download.php#:~:text=Cinnamon,features">Cinnamon version</Link>. It's now or never, I feel more confident in using this damn operating system.</p>
<p>I tested it, and yes I actually tested Linux Mint weeks before actually installing this thing onto my laptop.</p>
<p>One tiny minor issue: <Spoiler><strong>There was no WiFi support.</strong></Spoiler></p>
<p>My network card, that being the MediaTek MT7902, has NO driver support for Linux at the time. I searched around it on Google, and I hear people complain about the same problem. I see there being an out-of-tree kernel module, but not knowing how to compile such a thing at the time stopped me from installing Linux at that time.</p>
<p>Any other Linux distro wouldn't even help me here (I think) since there was literally no WiFi support in the kernel for my specific network card.</p>
<p>What should I do...?</p>
{@render header(3, "The ACTUAL Installing of Linux (and figuring out how to compile kernel modules)")}
<p>I've contemplated for so many weeks, wanting Linux to be installed but having no knowledge about how to install an out-of-tree kernel module.</p>
<p>Until I saw some articles floating around: (yes I was searching about this topic in a regular...)<br>
<Link href="https://www.cnx-software.com/2026/02/20/mediatek-mt7902-wireless-chipset-finally-gets-linux-drivers/">MediaTek MT7902 wireless chipset finally gets a Linux driver</Link><br>
<Link href="https://www.phoronix.com/news/Mediatek-MT7902-Linux-Patches">Mediatek MT7902 WiFi Finally Seeing Open-Source Linux Driver Activity</Link><br>
<strong>I was {options.swearing ? "fucking" : "really"} excited.</strong> My Linux dream was about to come true. It DID say that all these changes will come out in kernel version 7.1 so all I had to do was waiting.</p>
<p>NAHHH I was impatient. The articles I've read finally fueled my urge to the <strong>MAX</strong> for me to install Linux Mint onto my system. Installation went and finished without a hitch.</p>
<p>For temporary internet, I used USB tethering from my phone to provide some internet access. I've hoped that I wouldn't have to do this forever, and my hopes were answered...!</p>
<p>... by installing this random kernel module from a stranger: <Link href="https://github.com/OnlineLearningTutorials/mt7902_temp">https://github.com/OnlineLearningTutorials/mt7902_temp</Link></p>
<p>I <code>git clone</code>'d the repository over to a local folder, hey -- before that, I had to figure out where my SSD drive should be mounted...</p>
<p>Using the Disks utility preinstalled in my distro, I was about to set a mount point towards <code>/home/brickwall2900/Data</code>, mounted at system startup.</p>
<p><em>Hey, is it a good idea to mount stuff in your home folder? Let me know about your thoughts about it, because I {!options.swearing ? "literally" : ""} have no {options.swearing ? "fucking" : ""} clue if what I'm doing is okay...</em></p>
<p>Anyway, back to compiling the MT7902 kernel module drivers.</p>
<p>I <code>git clone</code>'d the repository over to a local folder, followed what-looked-to-be vibe-coded instructions. I literally had to fix their script with a language I never knew before (Bash), and just used my intuition from Batch as a scripting shell language to make it all work.</p>
<p>and ta-da.. wait just one second. If my Secure Boot was on, that means unsigned kernel drivers cannot be loaded in the kernel because they cannot be verified.</p>
<p>... and Secure Boot just so happens to be on. So I have to sign my own {options.swearing ? "fucking" : "gosh damn"} kernel drivers now.</p>
<p>After looking at the internet, looking at a bunch of AI overviews... I stumbled upon <code>sign-tool</code>.<br>
Here's my command if you want it:</p>
{#if options.swearing}
<Codeblock filename="sign-my-fucking-driver.sh" language="bash" code={`
#!/bin/bash

set -e

if [ "$#" -ne 1 ]; then
echo "sign-my-fucking-driver.sh [driver].ko"
exit 1
fi

sudo /usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 /var/lib/shim-signed/mok/MOK.priv /var/lib/shim-signed/mok/MOK.der "$1"

echo "signing successful for $1!!"
`} />
{:else}
<Codeblock filename="sign-my-driver.sh" language="bash" code={`
#!/bin/bash

set -e

if [ "$#" -ne 1 ]; then
echo "sign-my-driver.sh [driver].ko"
exit 1
fi

sudo /usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 /var/lib/shim-signed/mok/MOK.priv /var/lib/shim-signed/mok/MOK.der "$1"

echo "signing successful for $1!!"
`} />
{/if}
<p>It just signs kernel drivers and nothing else.</p>
<p>I've done it before actually, and that is used to sign my Acer WMI Battery kernel driver to stop my nugget reaching more than 80% of battery while charging, you know, battery saving features. (<Link href="https://github.com/frederik-h/acer-wmi-battery">https://github.com/frederik-h/acer-wmi-battery</Link>)</p>
<p>Yes, I had to compile another kernel module myself. At least it wasn't as painful as the MT7902 drivers.</p>
<p>And with the MT7902 modules signed and loaded, my WiFi and Bluetooth was working! DKMS wasn't even set up, so I had to do this for every kernel version upgrade. But at least I won't have to wait long until official support comes out!</p>
{@render header(2, "How am I now?")}
<p>It's working well as intended. I've modified Cinnamon enough for me to be okay and comfy with it, maybe I'll try out another desktop environment or even another distro soon once I really really get the hang of this thing.</p>
<Image 
    src="/assets/writeups/linux-first-experience/photo3.png"
    alt="My Linux Mint Cinammon desktop, open with applications showing the capabilities of my computer"
    caption="My Linux Desktop, again"
    requiresImageViewer={true} />
<p>All my Java applications work on Linux ;)<br>
It's fantastic, write once and run anywhere!!</p>
<p>Although some hiccups happen when I open Git repositories under IntelliJ IDEA, or VS Code, or anything with Git even. Weird issues were being caused by line separators, "dubious" ownership (I am literally the same person, just from another world!!) Both issues can be fixed though, so no problem there.</p>
<p>I've put symlinks on some directories to point to my shared drive, so no matter which OS I use, it points to the same location. I also may or may not have rewritten an <Link href="https://store.steampowered.com/app/1150690/OMORI/">application</Link> to run natively on Linux...</p>
<p>And, I trained myself enough to use Shift instead of Caps Lock for single-word capitalization, nice!</p>
<p>I used this over Windows for the past few weeks now. I tried logging in onto Windows to try some software and do data recovery on an almost-dead hard drive, but it sabotaged me... TWICE!</p>
<ul>
<li>First issue was my user account was not even getting detected in the login screen, I fixed that already, so that was nice.</li>
<li>Second issue was the operating system not even responding to anything I do, literally. I intuitively mapped this behavior to when the Windows kernel stops responding, so I had to check and see my drivers and I removed the faulty one.</li>
</ul>
<p>Granted, I was on 22H2. I never updated my Windows installation because it seems so damn risky to even do that... Imagine risking your Windows installation JUST to upgrade it. It feels like a {options.swearing ? "fucking" : "risky"} investment I have to make because of <em>Microslop</em>.</p>
<p>Ever since me installing kernel modules and exploring around Linux a bit, my curiosity has gotten a bit higher around Linux, how it works and stuff, and how it differs from Windows. I have to get pretty creative around cross-platform when writing Java code, because these two operating systems differ by a lot.</p>
<p>...and don't even get me started on Mac OS. If someone tells me how to test my applications and software in Mac OS, it would be really appreciative and helpful to catch the remaining ~10% of what I would call "Apple" users (Statcounter, n.d.).</p>
<p>Thank you for reading my first writeup! It's my first and I want to write more of these, more about my experiences overall. Maybe I have to keep this talent hidden because it's {options.swearing ? "so shit" : "painful"} to even comprehend. Eh... we'll {options.swearing ? "fuck" : "mess"} around and find out and maybe learn.</p>
{@render header(2, "References")}
<p>Desktop Operating System Market Share Worldwide | Statcounter Global Stats. (n.d.). StatCounter Global Stats. Retrieved June 6, 2026, from <Link href="https://gs.statcounter.com/os-market-share/desktop/worldwide/">https://gs.statcounter.com/os-market-share/desktop/worldwide/</Link></p>