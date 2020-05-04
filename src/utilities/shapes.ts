export class Circle {
    public x: number;
    public y: number;
    public radius: number;

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    public area(): number {
        return Math.PI * (this.radius * this.radius);
    }

    public circumference(): number {
        return 2 * Math.PI * this.radius;
    }

    public intersect(c: Circle): boolean {
        let dx: number = this.x - c.x;
        let dy: number = this.y - c.y;
        let d: number = Math.sqrt((dx * dx) + (dy * dy));

        if (d < this.radius + c.radius) {
            return true;
        }

        return false;
    }

    public serialize(): any {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
        }
    }
}

export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public in(c: Circle): boolean {
        return (Math.pow(this.x - c.x, 2) + Math.pow(this.y - c.y, 2)) < (Math.pow(c.radius, 2));
    }

    public serialize(): any {
        return {
            x: this.x,
            y: this.y
        }
    }
}  