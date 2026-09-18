import type { Vector2Type } from "$lib/types.svelte"

export interface BlackyState {
    moving: boolean,
    facingRight: boolean,
    position: Vector2Type,
    speedMultiplier: number,
    maxSpeed: number,
    walkStartTs: DOMHighResTimeStamp,
    turnSpeed: number
    currentAngle: number
};

export enum Mode {

};

export enum Action {
    PET = "pet",
    CAT = "cat"
};