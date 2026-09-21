// why the fuck are there multiple ways to create a thingy in JavaScript?
export class MathHelper {
    constructor() {
        throw new Error("Invalid constrcutor call");
    }

    public static lerp(v0: number, v1: number, t: number): number {
        return (1 - t) * v0 + t * v1;
    }

    /**
     * Rotates `current` angle toward `target` angle by at most `maxStep` radians.
     */
    public static rotateToward(current: number, target: number, maxStep: number): number {
        let diff = target - current;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

        if (Math.abs(diff) <= maxStep) {
            return target;
        }
        return current + Math.sign(diff) * maxStep;
    }

    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}