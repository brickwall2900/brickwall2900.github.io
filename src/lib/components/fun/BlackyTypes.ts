import type { Vector2Type } from "$lib/types.svelte"

export interface BlackyState {
    moving: boolean,
    facingRight: boolean,
    position: Vector2Type,
    speedMultiplier: number,
    maxSpeed: number,
    walkStartTs: DOMHighResTimeStamp,
    turnSpeed: number
    currentAngle: number,
    isDragging: boolean,
    dragFinishTs: DOMHighResTimeStamp,
    dragPos: Vector2Type,
    willFollowCursor: boolean,
};

export enum Mode {

};

export enum Action {
    PET = "pet",
    CAT = "cat",
    SIT = "sit",
    STAND = "stand",
    ASK_HELP = "ask_help",
};