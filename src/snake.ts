import { Config, SnakeStatus } from "./config";
import Section from "./section";
import Spatial from "./spatial";
import IMouse from "./mouse";

export default class Snake extends Spatial {
    public status: SnakeStatus;
    public id: string;
    public username: string;
    public color: string;
    public sections: Section[];

    constructor(id: string, username: string, x: number, y: number) {
        super();

        this.status = SnakeStatus.ALIVE;
        this.id = id;
        this.username = username;
        this.color = "0x" + this.intToRGB(this.hashCode(username));
        this.sections = [];

        for (let i = 0, length = Config.INITIAL_SNAKE_LENGTH; i < length; i++) {
            this.sections.push(new Section(x, y, Config.INITIAL_SNAKE_RADIUS));
        }
    }

    public moveTo(p: number[]): void {
        // removing tail from snake
        this.sections.splice(-1);

        // adding his new head in front of his old one
        let section: Section = new Section(this.sections[0].x + p[0], this.sections[0].y + p[1], Config.INITIAL_SNAKE_RADIUS);

        // adding the section to the whole snake
        this.sections.unshift(section);
    }

    public chase(mouse: IMouse): void {
        let dx: number = mouse.pointer.x - this.head().x;
        let dy: number = mouse.pointer.y - this.head().y;
        let angle: number = Math.atan2(dy, dx);
        this.setVelocityX(Math.cos(angle) * this.getSpeed());
        this.setVelocityY(Math.sin(angle) * this.getSpeed());
        this.moveTo([this.getVelocityX(), this.getVelocityY()]);
    }

    private hashCode(value: string): number {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash = value.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    private head(): Section {
        return this.sections[0];
    }

    private intToRGB(code: number): string {
        const c = (code & 0x00FFFFFF).toString(16).toUpperCase();
        return "00000".substring(0, 6 - c.length) + c;
    }

    public serialize(): any {
        return {
            status: this.status,
            id: this.id,
            username: this.username,
            color: this.color,
            sections: this.sections.map(s => s.serialize())
        };
    }
}