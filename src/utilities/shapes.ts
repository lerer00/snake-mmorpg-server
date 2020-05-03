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

    // export function intersectRectangle(c: PIXI.Circle, r: PIXI.Rectangle): boolean {
    //     let x: number = c.x;
    //     let y: number = c.y;
    
    //     if (c.x < r.left) {
    //         x = r.left;
    //     } else if (c.x > r.left + r.width) {
    //         x = r.left + r.width;
    //     }
    //     if (c.y < r.top) {
    //         y = r.top;
    //     } else if (c.y > r.top + r.height) {
    //         y = r.top + r.height;
    //     }
    
    //     let dx: number = c.x - x;
    //     let dy: number = c.y - y;
    //     let d: number = Math.sqrt((dx * dx) + (dy * dy));
    
    //     if (d <= c.radius) {
    //         return true;
    //     }
    //     return false;
    // }

    public serialize(): any {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
        }
    }
}  