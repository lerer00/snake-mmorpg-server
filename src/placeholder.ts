export default class Placeholder {
    public socketID: string;
    public x: number;
    public y: number;
    public direction: number;
    public speed: number;

    constructor(socketID: string, x: number, y: number, direction: number, speed: number) {
        this.socketID = socketID;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
    }

    public update(direction: number): void {
        this.x += direction * this.speed * Math.sin(this.direction);
        this.y -= direction * this.speed * Math.cos(this.direction);
    }

    public interspace(placeholder: Placeholder): number {
        const dx: number = this.x - placeholder.x;
        const dy: number = this.y - placeholder.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public setDirection(direction: number): void {
        this.direction = direction;
    }

    public serialize(): any {
        return {
            id: this.socketID,
            x: this.x,
            y: this.y,
        };
    }
}