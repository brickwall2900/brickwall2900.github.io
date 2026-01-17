<svelte:head>
    <title>Textfuscator</title> 
</svelte:head>

<script lang="ts">
    import Encoder from "./Encoder.svelte";
    import Decoder from "./Decoder.svelte";
    import { MAJOR_VERSION, MINOR_VERSION } from "$lib/textfuscator/textfuscator";
    import Dropdown from "$lib/components/Dropdown.svelte";
</script>

<div class="flex flex-col bg-gray-200 dark:bg-gray-800 m-4 p-4 gap-2">
    <h1 class="text-5xl font-bold self-center">Textfuscator</h1>
    <p>
        Textfuscator is a tool to merge text strings together into a single output,
        given a pair of "keys" and "inputs".
        Each input can be decoded from output from a key.
    </p>

    <hr>
    <div class="flex flex-col lg:flex-row gap-4">
        <article class="flex flex-col p-4 gap-2 flex-1">
            <Encoder />
        </article>

        <article class="flex flex-col p-4 gap-2 flex-1">
            <Decoder />
        </article>
    </div>
    <hr>
    <h2 class="text-3xl self-center font-bold">Information</h2>
    <section class="flex flex-col p-4 gap-4">
        <Dropdown title="What is Textfuscator?">
            <p>Textfuscator is a text <strong>"obfuscation"</strong> tool that allows users to encode multiple text strings into a single output.</p>
            <p>Each string can be retrieved using its corresponding key, making it useful for scenarios where sensitive information needs to be stored or transmitted securely.</p>
            <p>Textfuscator currently supports <strong>XOR and AES-GCM (with PBKDF2 key derivation)</strong>, and offers <strong>compression</strong> to optimize the size of the encoded output.</p>
        </Dropdown>

        <Dropdown title="Which mode should I use?">
            <p>The choice of mode depends on your specific needs:</p>
            <ul class="list-disc ml-8"> 
                <li>
                    <strong>XOR:</strong> Uses <a class="underline text-blue-700 dark:text-blue-300" href="https://en.wikipedia.org/wiki/XOR_cipher">XOR bitwise operator</a> for obfuscation.
                    Best for fast encode/decode speed, small size, and non-secret messages.
                    Not recommended for sensitive content.
                </li>
                <li>
                    <strong>AES-GCM:</strong> Uses the <a class="underline text-blue-700 dark:text-blue-300" href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard">AES</a> algorithm 
                    with <a class="underline text-blue-700 dark:text-blue-300" href="https://en.wikipedia.org/wiki/Galois/Counter_Mode">GCM</a> for obfuscation.
                    Best for protecting sensitive data when a secure random key is already available. 
                    Slower and larger than XOR.
                </li>
                <li>
                    <strong>AES-GCM (PBKDF2):</strong> Uses the <a class="underline text-blue-700 dark:text-blue-300" href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard">AES</a> algorithm 
                    with <a class="underline text-blue-700 dark:text-blue-300" href="https://en.wikipedia.org/wiki/Galois/Counter_Mode">GCM</a> 
                    deriving the key using <a class="underline text-blue-700 dark:text-blue-300" href="https://en.wikipedia.org/wiki/PBKDF2">PBKDF2</a> for obfuscation.
                    Best for password-based encryption, where users provide a passphrase and a strong key must be derived securely before encryption.
                    Larger than AES-GCM.
                </li>
            </ul>
            <p><strong>Consider the sensitivity of your data and performance requirements when choosing a mode.</strong></p>
            <footer class="text-xs">(!) The supported algorithms are subject to change in another update!</footer> 
        </Dropdown>

        <Dropdown title="What version of Textfuscator is running?">
            <p>The file version Textfuscator is running on is <strong>{MAJOR_VERSION}.{MINOR_VERSION}</strong>.</p>
            <p><strong>Textfuscator is STILL in development. Things are subject to change.</strong> 
                Textfuscator is focused on <strong>forward-compatibilty</strong>, backwards-compatibility works but there may be errors in decoding.</p>
        </Dropdown>

        <Dropdown title="Is Textfuscator really for encrpytion?">
            <p>Textfuscator is primarily an obfuscation tool, with optional real encryption depending on the mode used.</p>
            <p><strong>However, Textfuscator should NOT be used for storing highly sensitive text, such as nuclear launch codes.</strong></p>
        </Dropdown>

        <Dropdown title="How effective is compression?">
            <p>Textfuscator uses <a class="underline text-blue-700 dark:text-blue-300" href="https://en.wikipedia.org/wiki/Gzip">GZIP</a> for compression.</p>
            <p>
                Compression is most effective for <strong>large, repetitive, or human-readable text</strong>
                (such as really long messages). In these cases, the final output size can be significantly reduced.
            </p>
            <p>
                For <strong>small or already compact inputs</strong>, compression may be ineffective.
                Because GZIP adds its own headers and metadata, compressing small inputs can <strong>increase the final output size</strong>.
            </p>
            <p> Compression is always applied <strong>before encryption</strong>. Encrypted data cannot be meaningfully compressed. </p>
        </Dropdown>

        <Dropdown title="Why do I get a notification in Firefox about maximum memory usage?">
            <p>When instantiating a resizable <code>ArrayBuffer</code> then <a class="underline text-blue-700 dark:text-blue-300" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/resize">resizing</a> it:</p>
            <ul class="list-disc ml-8"> 
                <li><strong>Chromium:</strong> It resizes up to the specified <code>newLength</code> parameter. This is normal behavior.</li>
                <li><strong>Firefox:</strong> It resizes up to the specified <code>maxResizeLength</code>, which can result in high memory usage depending on <code>maxResizeLength</code>.
                    This allocates significantly more memory than required.</li>
            </ul>
        </Dropdown>

        <Dropdown title="But why does maximum memory usage matter?">
            <p>
                Textfuscator may process multiple inputs at once, applying compression and
                encryption on a per-block basis. During this process, intermediate data
                (such as obfuscated data and metadata) must be
                held in memory.
            </p>
            <p>
                Higher memory usage can become a problem on systems with limited RAM or
                when processing very large inputs. Excessive memory usage may lead
                to slower performance, errors in encoding/decoding, or even browser crashes.
            </p>
        </Dropdown>

        <Dropdown title="Textfuscator outputs Base64. What are the contents of it when decoded?">
            <p class="italic">See (link) here for Textfuscator's binary block structure.</p>
        </Dropdown>

        <Dropdown title="How come Textfuscator already knows about the obfuscation mode and compression state when decoding?">
            <p>Textfuscator stores the block information and data on encoding, which includes the obfuscation mode and compression state.</p>
            <p class="italic">See (link) here for Textfuscator's binary block structure for more technical information.</p>
        </Dropdown>
    </section>
</div>