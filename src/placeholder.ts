export default class Placeholder {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public serialize(): any {
        return {
            x: this.x,
            y: this.y,
        };
    }
}