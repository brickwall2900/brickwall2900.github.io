<script lang="ts">
    import { browser } from '$app/environment';
    import ModalDialog from '$lib/components/ModalDialog.svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    type AssetType = number;
    const ASSET_TYPE_IMAGE: AssetType = 0;
    const ASSET_TYPE_AUDIO: AssetType = 1;

    class AssetManager {
        #assets = new Map<string, any>();
        #loaded: [string?] = [];

        private loadImage(name: string, source: string) {
            const image = new Image();
            image.onload = () => {
                this.#assets.set(name, image);
                this.#loaded.push(name);
            };
            image.src = source;
        }

        private loadAudio(name: string, source: string, ctx: AudioContext) {
            const audio = new Audio();
            audio.autoplay = true;
            audio.preload = "auto";
            audio.onloadeddata = () => {
                const track = ctx.createMediaElementSource(audio);
                this.#assets.set(name, track);
                this.#loaded.push(name);
            };
            audio.src = source;
        }

        load(name: string, type: AssetType, source: string, ctx?: any): void {
            if (this.#assets.has(name)) {
                return;
            }

            if (type === ASSET_TYPE_IMAGE) {
                this.loadImage(name, source);
            } else if (type === ASSET_TYPE_AUDIO) {
                if (ctx instanceof AudioContext) {
                    this.loadAudio(name, source, ctx);
                } else {
                    throw new TypeError("No audio context provided");
                }
            } else {
                throw new TypeError("Unknown type " + type);
            }
        }

        get<T>(name: string): T | null {
            if (this.#assets.has(name) && this.#loaded.includes(name)) {
                return this.#assets.get(name);
            }

            return null;
        }
    }

    type GameScene = number;
    const GAME_SCENE_LETTER: GameScene = 0;

    interface TooltipState {
        text: string,
        delay: number,
        canShow?: boolean,
        _timer?: number,
        _visibility?: number
    }

    interface GameContext {
        gameStartTimestamp: number,
        distributedGameTime: number,
        cursor: {
            x: number,
            y: number,
            holdingLeft: boolean,
            clickedLeft: boolean
        },
        screen: {
            width: number,
            height: number
        }
        scene: GameScene | null,
        insetTop: number,
        sceneData: {
            letter: {
                letterScale: number,
                viewTooltip: TooltipState,
                topText: string,
                timeClicked: number,
                shakeIntensity: number,
                clickCount: number,
                timeProvoked: number,
                provoked: boolean,
                dialogState: number
                timeDialog: number
            }
        },
        dialog: {
            characterName: string,
            content: string
        }
    }

    const game: GameContext = {
        gameStartTimestamp: 0,
        get distributedGameTime() {
            return (performance.now() - this.gameStartTimestamp) / 1e3;
        },
        cursor: {
            x: 0,
            y: 0,
            holdingLeft: false,
            clickedLeft: false
        },
        screen: {
            width: 0,
            height: 0
        },
        scene: null,
        insetTop: 40,
        sceneData: {
            letter: {
                letterScale: 0.3,
                topText: "Hover over the letter!!",
                viewTooltip: {
                    text: "Do you want to view the letter?",
                    delay: 0
                },
                shakeIntensity: 0,
                timeClicked: 0,
                clickCount: 0,
                timeProvoked: 0,
                provoked: false,
                dialogState: 0,
                timeDialog: 0
            }
        },
        dialog: {
            characterName: "",
            content: ""
        }
    };

    let assetManager: AssetManager | null = new AssetManager();
    let container: HTMLElement;
    let canvas: HTMLCanvasElement;
    let audioContext: AudioContext | undefined;
    let running = true;
    let lastGameScene: GameScene | null | undefined = undefined;
    let lastTimestamp: DOMHighResTimeStamp = performance.now();

    let dialogShowing: boolean = $state(false);
    let dialogTitle: string = $state("");
    let dialogContent: string = $state("");

    function hit(x: number, y: number, w: number, h: number): boolean {
        return x <= game.cursor.x
            && y <= game.cursor.y
            && x + w >= game.cursor.x
            && y + h >= game.cursor.y;
    }

    function lerp(a: number, b: number, f: number): number {
        return a * (1.0 - f) + (b * f);
    }

    function clamp(x: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, x));
    }

    function playSound(track: MediaElementAudioSourceNode) {
        if (audioContext !== undefined) {
            track.disconnect();
            track.connect(audioContext.destination);
            track.mediaElement.currentTime = 0;
            track.mediaElement.play();
        }
    }

    function showDialog() {
        dialogTitle = game.dialog.characterName;
        dialogContent = game.dialog.content;
        dialogShowing = true;
    }

    function hideDialog() {
        dialogShowing = false;
    }

    function onGameSceneSwitched(scene: GameScene) {
        if (assetManager === null) {
            throw new TypeError("should not reach here");
        }

        if (scene == GAME_SCENE_LETTER) {
            assetManager?.load("letter", ASSET_TYPE_IMAGE, "/_1031game/letter.png");
            assetManager?.load("mouseClick", ASSET_TYPE_AUDIO, "/_1031game/mouseclick.mp3", audioContext);
            assetManager?.load("letterCatProvoke1", ASSET_TYPE_AUDIO, "/_1031game/cat_provoke_layer1.mp3", audioContext);
            assetManager?.load("letterCatProvoke2", ASSET_TYPE_AUDIO, "/_1031game/cat_provoke_layer2.mp3", audioContext);
        }
    }

    function switchGameScene(scene: GameScene) {
        game.scene = scene;
        if (lastGameScene !== scene) {
            onGameSceneSwitched(scene);
            lastGameScene = scene;
        }
    }

    function showTooltip(ctx: CanvasRenderingContext2D, tooltip: TooltipState, delta: number, x: number, y: number, showing: boolean) {
        let canShow = tooltip.canShow !== undefined ? tooltip.canShow : true;
        if (!canShow) {
            return;
        }

        let visibility = tooltip._visibility || 0;
        let timer = tooltip._timer || 0;

        if (!showing && visibility <= 0) {
            tooltip._timer = 0;
            return;
        }

        if (showing) {
            timer += delta;
        }
        tooltip._timer = timer;

        if (timer < tooltip.delay) {
            return;
        }

        if (!showing) {
            visibility = clamp(lerp(visibility, 0, 10 * delta), 0, 1);
        } else {
            visibility = clamp(lerp(visibility, 1, 10 * delta), 0, 1);
        }

        tooltip._visibility = visibility;

        ctx.font = "16px monospace";

        const text = tooltip.text;
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const padding = 8;
        const calcX = Math.max(0, Math.min(x, game.screen.width - textWidth));
        const calcY = Math.max(0, Math.min(y, game.screen.height - textHeight));

        const prevGlobalAlpha = ctx.globalAlpha;
        ctx.globalAlpha = visibility;
        ctx.fillStyle = "rgb(0 0 0 / 30%)"
        ctx.fillRect(calcX, calcY - (textHeight), textWidth + padding, textHeight + padding);

        ctx.fillStyle = "white";
        ctx.fillText(text, calcX + (padding / 2), calcY + (padding / 2));
        ctx.globalAlpha = prevGlobalAlpha;
    }

    function renderBackground(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, game.screen.width, game.screen.height);
    }

    function renderMouse(ctx: CanvasRenderingContext2D) {
        const cursorX = game.cursor.x;
        const cursorY = game.cursor.y;
        const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, 10);
        gradient.addColorStop(0, "lightblue");
        gradient.addColorStop(1, "rgb(0 0 0 / 0%)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, 10, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function renderLetterScene(ctx: CanvasRenderingContext2D, delta: number) {
        const width = game.screen.width;
        const height = game.screen.height;
        const image = assetManager?.get<HTMLImageElement>("letter");
        if (image) {
            // figure out the letter animation
            const clickScale = 0.32;
            const minScale = 0.3;
            const maxScale = 0.35;

            const minLetterWidth = image.width * minScale;
            const minLetterHeight = image.height * minScale;
            const minLetterX = (width / 2) - (minLetterWidth / 2);
            const minLetterY = (height / 2) - (minLetterHeight / 2);
            
            let scale = game.sceneData.letter.letterScale;
            const holding = game.cursor.holdingLeft;
            const scaleSpeed = 10;
            const cursorHit = hit(minLetterX, minLetterY, minLetterWidth, minLetterHeight);
            if (cursorHit && !holding) {
                scale = clamp(lerp(game.sceneData.letter.letterScale, maxScale, scaleSpeed * delta), minScale, maxScale);
            } else if (cursorHit && holding && game.sceneData.letter.clickCount < 12) {
                scale = clamp(lerp(game.sceneData.letter.letterScale, clickScale, scaleSpeed * delta), minScale, maxScale);
            } else if (!cursorHit && !holding) {
                scale = clamp(lerp(game.sceneData.letter.letterScale, minScale, scaleSpeed * delta), minScale, maxScale);
            }
            game.sceneData.letter.letterScale = scale;

            // OK we figured out the scale, now render the letter
            const letterWidth = image.width * scale;
            const letterHeight = image.height * scale;
            const letterX = (width / 2) - (letterWidth / 2);
            const letterY = (height / 2) - (letterHeight / 2);

            // shake the letter
            const shakeX = Math.random() * game.sceneData.letter.shakeIntensity;
            const shakeY = Math.random() * game.sceneData.letter.shakeIntensity;
            ctx.translate(shakeX, shakeY);
            ctx.drawImage(image, letterX, letterY, letterWidth, letterHeight);
            ctx.translate(-shakeX, -shakeY);

            // render hover over me
            ctx.fillStyle = "rgb(255 255 255 / 70%)"
            ctx.font = "24px monospace";
            const clickLetterText = game.sceneData.letter.topText;
            const clickLetterMeasure = ctx.measureText(clickLetterText);
            const clickLetterTextWidth = clickLetterMeasure.width;
            const clickLetterTextHeight = clickLetterMeasure.actualBoundingBoxAscent + clickLetterMeasure.actualBoundingBoxDescent;
            ctx.fillText(clickLetterText, (width / 2) - (clickLetterTextWidth / 2), (height / 2) - (clickLetterTextHeight / 2) - (letterHeight / 2) - 40);

            // render tooltip
            showTooltip(ctx, game.sceneData.letter.viewTooltip, delta, game.cursor.x, game.cursor.y, cursorHit);
        } else {
            ctx.fillStyle = "white";
            ctx.fillText("WAIT", game.cursor.x, game.cursor.y);
        }

        // draw darkness
        ctx.fillStyle = "rgb(0 0 0 / 30%)"
        ctx.fillRect(0, 0, width, height);
    }

    function renderScene(ctx: CanvasRenderingContext2D, delta: number) {
        if (game.scene === GAME_SCENE_LETTER) {
            renderLetterScene(ctx, delta);
        }
    }

    function render(ctx: CanvasRenderingContext2D, delta: number) {
        renderBackground(ctx);
        renderMouse(ctx);
        renderScene(ctx, delta);
    }

    function tickLetterScene(delta: number) {
        const letter = game.sceneData.letter;

        if (letter.provoked) {
            if (performance.now() - letter.timeProvoked >= 8000) {
                if (!dialogShowing) {
                    if (letter.dialogState === 0) {
                        game.dialog.characterName = "Cat?";
                        game.dialog.content = "*MEOW!!* (Hey! Quit knocking me over!)";
                        showDialog();
                        letter.dialogState = 1;
                    } else if (letter.dialogState === 1) {
                        game.dialog.content = "*meow...* (I'm so tired, and you wake me up like this) *hiss!*";
                        showDialog();
                        letter.dialogState = 2;
                    } else if (letter.dialogState === 2) {
                        game.dialog.content = "...";
                        showDialog();
                        letter.dialogState = 3;
                    } else if (letter.dialogState === 3) {
                        game.dialog.content = "*meow?* (wait... I recognize you.)";
                        showDialog();
                        letter.dialogState = 4;
                    } else if (letter.dialogState === 4) {
                        game.dialog.characterName = "Blacky";
                        game.dialog.content = "*meows happily* (Oh! It's you! Aubrey!)";
                        showDialog();
                        letter.dialogState = 4;
                    }
                }
            } else if (performance.now() - letter.timeProvoked >= 4000) {
                letter.topText = "What have you done!?";
            }
        } else if (game.cursor.clickedLeft) {
            const clickSound = assetManager?.get<MediaElementAudioSourceNode>("mouseClick");
            if (clickSound) {
                playSound(clickSound);
            }

            if (letter.clickCount === 0) {
                letter.timeClicked = performance.now();
                letter.viewTooltip.canShow = false;
                letter.topText = "...";
                letter.clickCount++;
            } else if (letter.clickCount > 0 && (performance.now() - letter.timeClicked) >= 2000) {
                if (letter.clickCount >= 12) {
                    letter.topText = "!!!";

                    if (letter.clickCount === 12) {
                        const layer1 = assetManager?.get<MediaElementAudioSourceNode>("letterCatProvoke1");
                        const layer2 = assetManager?.get<MediaElementAudioSourceNode>("letterCatProvoke2");
                        if (layer1) {
                            playSound(layer1);
                        }
                        if (layer2) {
                            playSound(layer2);
                        }

                        letter.timeProvoked = performance.now();
                        letter.provoked = true;
                    }
                } else {
                    // letter jumps up and down and a cat appears!!
                    letter.shakeIntensity += letter.clickCount;
                }
                letter.clickCount++;
            }
        }

        if (letter.clickCount > 0 && (performance.now() - letter.timeClicked) >= 3000) {
            if (letter.clickCount <= 12) {
                letter.topText = "Maybe try clicking it again..?";
            }
            letter.shakeIntensity = Math.max(letter.shakeIntensity - ((letter.clickCount / 4) * delta), 0);
        }
    }

    function tickScene(delta: number) {
        if (game.scene === GAME_SCENE_LETTER) {
            tickLetterScene(delta);
        }
    }

    function heartbeat(delta: number) {
        tickScene(delta);
    }

    function onMouseMoved(e: MouseEvent) {
        game.cursor.x = e.offsetX;
        game.cursor.y = e.offsetY - game.insetTop;
    }

    function onMouseDown(e: MouseEvent) {
        if (e.button === 0) {
            game.cursor.holdingLeft = true;
        }
    }

    function onMouseUp(e: MouseEvent) {
        if (e.button === 0) {
            if (game.cursor.holdingLeft) {
                game.cursor.clickedLeft = true;
            }
            game.cursor.holdingLeft = false;
        }
    }

    function tick(delta: number) {
        const context = canvas.getContext("2d");
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        const insetTop = game.insetTop;
        const width = canvas.width;
        const height = canvas.height - insetTop;

        game.screen.width = width;
        game.screen.height = height;

        if (context) {
            context.translate(0, insetTop);

            heartbeat(delta);
            render(context, delta);
        }
    }

    function step(timestamp: DOMHighResTimeStamp) {
        if (!running) {
            return;
        }

        const delta = (performance.now() - lastTimestamp) / 1e3;
        lastTimestamp = timestamp;

        tick(delta);

        requestAnimationFrame(step);
        game.cursor.clickedLeft = false;
    }

    function init() {
        if (browser) {
            audioContext = new AudioContext();
            game.gameStartTimestamp = performance.now();

            canvas.addEventListener("mousemove", onMouseMoved);
            canvas.addEventListener("mousedown", onMouseDown);
            canvas.addEventListener("mouseup", onMouseUp);

            switchGameScene(GAME_SCENE_LETTER);

            requestAnimationFrame(step);
        }
        return () => {
            console.log("stopped");
            running = false;
            assetManager = null;
        };
    }
    
    $effect(init);
</script>

<!-- OK what the fuck is going on?? -->
<main bind:this={container} class="absolute top-0 left-0 w-full h-full">
    <canvas bind:this={canvas} class="w-full h-full block"></canvas>
</main>

<ModalDialog bind:showing={dialogShowing} title={dialogTitle} hasCloseButton={false} ondialogclosing={function () { return false; }}>
    <div class="flex flex-col gap-4">
        <div class="flex flex-row gap-4">
            <p>{dialogContent}</p>
        </div>
        <button onclick={hideDialog}>Next</button>
    </div>
</ModalDialog>