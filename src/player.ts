import Placeholder from "./placeholder";
import Config from "./config";

export default class Player extends Placeholder {
    public username: string;

    constructor(socketID: string, username: string, x: number, y: number) {
        super(socketID, x, y, 0, 0);
        this.socketID = socketID;
        this.username = username;
        this.x = x;
        this.y = y;
    }

    public update(direction: number): void {
        super.update(direction);

        // make sure the player stays in bounds
        this.x = Math.max(0, Math.min(Config.MAP_SIZE, this.x));
        this.y = Math.max(0, Math.min(Config.MAP_SIZE, this.y));
    }

    public serialize(): any {
        return {
            ...(super.serialize()),
            direction: this.direction,
        };
    }
}