<script lang="ts">
    import { browser } from "$app/env";
    import { asset } from "$app/paths";
    import { appendClassname } from "$lib/common/classname";
    import { MathHelper } from "$lib/common/mathCommon";
    import { Vector2, ReactiveVector2, type Vector2Type } from "$lib/types.svelte";
    import Button from "../Button.svelte";
    import section from "../Content.svelte";
    import Image from "../Image.svelte";
    import Window from "../Window.svelte";
    import { Action, type BlackyState } from "./BlackyTypes";

    let catState = $state<BlackyState>(
        { 
            moving: false, 
            facingRight: false, 
            position: new ReactiveVector2(0, 0),
            speedMultiplier: 0,
            maxSpeed: 200,
            walkStartTs: 0,
            turnSpeed: Math.PI * 2,
            currentAngle: 0,
            isDragging: false,
            dragFinishTs: 0,
            dragPos: new ReactiveVector2(0, 0),
            willFollowCursor: true
        }
    );

    let pathfindState = $state(false);
    let xDest = $state(0);
    let yDest = $state(0);
    let lastTick: DOMHighResTimeStamp = performance.now();
    let catMeowAudio: HTMLAudioElement;
    let longPressTimer = $state<any>();

    let actionWindowVisible = $state(false);

    /// Blacky goes towards the specified point
    export function moveTo(x: number, y: number) {
        if (xDest !== x || yDest !== y) {
            xDest = x;
            yDest = y;
            if (!pathfindState) {
                pathfindState = true;
                catState.walkStartTs = performance.now();
                lastTick = performance.now();
                requestAnimationFrame(pathfindTick);
            }
        }
    }

    /// Blacky goes towards the specified point, unless if he doesn't want to.
    export function followTo(x: number, y: number) {
        if ((xDest !== x || yDest !== y) && catState.willFollowCursor) {
            xDest = x;
            yDest = y;
            if (!pathfindState) {
                pathfindState = true;
                catState.walkStartTs = performance.now();
                lastTick = performance.now();
                requestAnimationFrame(pathfindTick);
            }
        }
    }

    /// Blacky teleports to that specified point
    export function teleportTo(x: number, y: number) {
        catState.position.set(x, y);
    }

    export function doAction(actionId: Action) {
        actionWindowVisible = false;

        if (actionId === Action.SIT) {
            catState.willFollowCursor = false;
        } else if (actionId === Action.STAND) {
            catState.willFollowCursor = true;
        }
    }

    function onMouseClicked(e: MouseEvent) {
        e.preventDefault();

        actionWindowVisible = true;
    }

    function onMouseDown(e: MouseEvent) {
        if (e.button === 0) {
            catMeowAudio.currentTime = 0;
            catMeowAudio.play();
            catState.isDragging = true;
            catState.dragPos = new ReactiveVector2(e.pageX, e.pageY);

            longPressTimer = setTimeout(() => {
                actionWindowVisible = true;
            }, 1000);
        }
    }

    function onMouseUp(e: PointerEvent) {
        if (e.button === 0) {
            catState.isDragging = false;
            catState.dragFinishTs = performance.now();
            catState.dragPos = new ReactiveVector2(e.pageX, e.pageY);

            if (longPressTimer !== undefined) {
                clearTimeout(longPressTimer);
                longPressTimer = undefined;
            }
        }
    }

    function onMouseMoved(e: PointerEvent) {
        if (catState.isDragging) {
            const pageX = e.pageX;
            const pageY = e.pageY;

            catState.position.x = pageX;
            catState.position.y = pageY;
            
            if (new Vector2(pageX, pageY).scalarDistanceFrom(catState.dragPos) <= 50) {
                if (longPressTimer !== undefined) {
                    clearTimeout(longPressTimer);
                    longPressTimer = undefined;
                }
            }
        }
    }

    function pathfindTick(timestamp: DOMHighResTimeStamp) {
        const deltaSeconds = (timestamp - lastTick) / 1e3;
        lastTick = timestamp;

        const maxSpeed = catState.maxSpeed;
        const prevX = catState.position.getX();
        const prevY = catState.position.getY();

        const dx = xDest - prevX;
        const dy = yDest - prevY;
        const distance = Math.hypot(dx, dy);

        const stopDistance = 100;
        const slowDownDist = 140;
        const accelTimeSec = 0.4;

        if (distance <= stopDistance) {
            catState.moving = false;
            pathfindState = false;
            return;
        }

        const timeElapsedSec = (performance.now() - catState.walkStartTs) / 1e3;
        const accelFactor = Math.min(timeElapsedSec / accelTimeSec, 1);
        const decelFactor = Math.min(distance / slowDownDist, 1);

        const speedMultiplier = Math.max(Math.min(accelFactor, decelFactor), 0.15);
        catState.speedMultiplier = speedMultiplier;

        const targetAngle = Math.atan2(dy, dx);
        const angle = catState.currentAngle = MathHelper.rotateToward(catState.currentAngle, targetAngle, catState.turnSpeed * deltaSeconds);
        const speedX = Math.cos(angle) * maxSpeed * speedMultiplier * deltaSeconds;
        const speedY = Math.sin(angle) * maxSpeed * speedMultiplier * deltaSeconds;
        const newX = prevX + speedX;
        const newY = prevY + speedY; 

        if (!catState.isDragging) {
            catState.position.x = newX;
            catState.position.y = newY;
            catState.moving = Math.abs(dx) > 0 || Math.abs(dy) > 0;
            catState.facingRight = prevX - xDest < 0;
        }

        requestAnimationFrame(pathfindTick);
    }

    $effect(() => {
        document.addEventListener("pointermove", onMouseMoved);
        document.addEventListener("pointerup", onMouseUp);
        return () => {
            document.removeEventListener("pointermove", onMouseMoved);
            document.removeEventListener("pointerup", onMouseUp);
        };
    });
</script>

<div>
    <Image
        class={"fixed z-3000 select-none touch-none " + (!catState.moving ? "w-10 h-10" : "w-16 h-10")}
        style="top: {catState.position.y}px; left: {catState.position.x}px; transform: scaleX({catState.facingRight ? -1 : 1}); -webkit-transform: scaleX({catState.facingRight ? -1 : 1})" 
        oncontextmenu={onMouseClicked}
        onpointerdown={onMouseDown}
        draggable={false}
        src={!catState.moving ? asset("/assets/blacky/cat2.gif") : asset("/assets/blacky/final-cat.gif")}>
    </Image>
    <audio src={asset("/assets/blacky/meow.mp3")} bind:this={catMeowAudio}></audio>
</div>
{#if actionWindowVisible}
    <Window title="Blacky - Actions" class="z-2999" globalParent initialX={catState.position.x} initialY={catState.position.y} bind:showing={actionWindowVisible}>
        <div class="flex flex-col gap-2 w-full">
            {#snippet defineAction(name: string, id: Action, desc?: string)}
                <Button title={desc} onclick={() => doAction(id)}>{name}</Button>
            {/snippet}

            {@render defineAction("Pet", Action.PET, "Pet the cat.")}
            {@render defineAction("Cat", Action.CAT, "Press CAT to CAT.")}
            {@render defineAction("Sit", Action.SIT, "Makes him stay in his position.")}
            {@render defineAction("Stand", Action.STAND, "Makes him follow your cursor.")}
            {@render defineAction("Ask for Help", Action.ASK_HELP, "He might not be Verity but he can try to help! He'll describe the current page.")}
        </div>
    </Window>
{/if}