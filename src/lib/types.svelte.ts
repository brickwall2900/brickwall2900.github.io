export interface Vector2Type {
    x: number;
    y: number;
    getX(): number;
    getY(): number;
    set(x: number, y: number): void;
    setX(x: number): void;
    setY(y: number): void;
    scalarDistanceFrom(point: Vector2): number;
}

export class Vector2 implements Vector2Type {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public setX(x: number) {
        this.x = x;
    }

    public setY(y: number) {
        this.y = y;
    }

    public scalarDistanceFrom(point: Vector2): number {
        return Math.sqrt(((point.x - this.x)*(point.x - this.x)) + ((point.y - this.y)*(point.y - this.y)));
    }

    x: number;
    y: number;
}

export class ReactiveVector2 implements Vector2Type {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public setX(x: number) {
        this.x = x;
    }

    public setY(y: number) {
        this.y = y;
    }

    public scalarDistanceFrom(point: Vector2): number {
        return Math.sqrt(((point.x - this.x)*(point.x - this.x)) + ((point.y - this.y)*(point.y - this.y)));
    }

    x: number = $state(0);
    y: number = $state(0);
}

export interface RectangleType {
    top: number;
    bottom: number;
    left: number;
    right: number;
    getTop(): number;
    getBottom(): number;
    getLeft(): number;
    getRight(): number;
    getX(): number;
    getY(): number;
    getWidth(): number;
    getHeight(): number;
}

export class Rectangle implements RectangleType {
    constructor(top: number, bottom: number, left: number, right: number) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    }

    public static ofBounds(top: number, bottom: number, left: number, right: number): Rectangle {
        return new Rectangle(top, bottom, left, right);
    }

    public static ofWidthHeight(x: number, y: number, width: number, height: number): Rectangle {
        return new Rectangle(y, y + height, x, x + width);
    }

    public getTop(): number {
        return this.top;
    }

    public getBottom(): number {
        return this.bottom;
    }

    public getLeft(): number {
        return this.left;
    }

    public getRight(): number {
        return this.right;
    }

    public getX(): number {
        return this.getLeft();
    }

    public getY(): number {
        return this.getTop();
    }

    public getWidth(): number {
        return this.getRight() - this.getLeft();
    }

    public getHeight(): number {
        return this.getBottom() - this.getTop();
    }

    top: number;
    bottom: number;
    left: number;
    right: number;
}

export class ReactiveRectangle implements RectangleType {
    constructor(top: number, bottom: number, left: number, right: number) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    }

    public static ofBounds(top: number, bottom: number, left: number, right: number): ReactiveRectangle {
        return new ReactiveRectangle(top, bottom, left, right);
    }

    public static ofWidthHeight(x: number, y: number, width: number, height: number): ReactiveRectangle {
        return new ReactiveRectangle(y, y + height, x, x + width);
    }

    public getTop(): number {
        return this.top;
    }

    public getBottom(): number {
        return this.bottom;
    }

    public getLeft(): number {
        return this.left;
    }

    public getRight(): number {
        return this.right;
    }

    public getX(): number {
        return this.getLeft();
    }

    public getY(): number {
        return this.getTop();
    }

    public getWidth(): number {
        return this.getRight() - this.getLeft();
    }

    public getHeight(): number {
        return this.getBottom() - this.getTop();
    }

    top: number = $state(0);
    bottom: number = $state(0);
    left: number = $state(0);
    right: number = $state(0);
}

export class TypesHelper {
    public static domRectToRectangle(given: DOMRect): RectangleType {
        return new Rectangle(given.top, given.bottom, given.left, given.right);
    }
}