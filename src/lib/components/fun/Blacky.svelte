<script lang="ts">
    import { browser } from "$app/env";
    import { asset } from "$app/paths";
    import { appendClassname } from "$lib/common/classname";
    import { MathHelper } from "$lib/common/mathCommon";
    import { Vector2, ReactiveVector2, type Vector2Type } from "$lib/types.svelte";
    import Image from "../Image.svelte";

    interface BlackyState {
        moving: boolean,
        facingRight: boolean,
        position: Vector2Type,
        speedMultiplier: number,
        maxSpeed: number,
        walkStartTs: DOMHighResTimeStamp,
        turnSpeed: number
        currentAngle: number
    };

    let catState = $state<BlackyState>(
        { 
            moving: false, 
            facingRight: false, 
            position: new ReactiveVector2(0, 0),
            speedMultiplier: 0,
            maxSpeed: 200,
            walkStartTs: 0,
            turnSpeed: Math.PI,
            currentAngle: 0
        }
    );

    let pathfindState = $state(false);
    let xDest = $state(0);
    let yDest = $state(0);
    let lastTick: DOMHighResTimeStamp = performance.now();
    let catMeowAudio: HTMLAudioElement;
    

    /// Blacky goes towards the specified point
    export function moveTo(x: number, y: number) {
        xDest = x;
        yDest = y;
        if (!pathfindState) {
            pathfindState = true;
            catState.walkStartTs = performance.now();
            lastTick = performance.now();
            requestAnimationFrame(pathfindTick);
        }
        pathfindState = true;
    }

    /// Blacky teleports to that specified point
    export function teleportTo(x: number, y: number) {
        catState.position.set(x, y);
    }

    function onMouseClicked(e: MouseEvent) {
        catMeowAudio.currentTime = 0;
        catMeowAudio.play();
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

        const stopDistance = 60;
        const slowDownDist = 120;
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

        catState.position.x = newX;
        catState.position.y = newY;
        catState.moving = Math.abs(dx) > 0 || Math.abs(dy) > 0;
        catState.facingRight = Math.cos(angle) > 0;

        requestAnimationFrame(pathfindTick);
    }
</script>

<div>
    <Image
        class={"fixed z-3000 " + (!catState.moving ? "w-10 h-10" : "w-16 h-10")}
        style="top: {catState.position.y}px; left: {catState.position.x}px; transform: scaleX({catState.facingRight ? -1 : 1}); -webkit-transform: scaleX({catState.facingRight ? -1 : 1})" 
        onclick={onMouseClicked}
        src={!catState.moving ? asset("/assets/blacky/cat2.gif") : asset("/assets/blacky/final-cat.gif")}>
    </Image>
    <audio src={asset("/assets/blacky/meow.mp3")} bind:this={catMeowAudio}></audio>
</div>