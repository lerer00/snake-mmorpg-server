import { Config, HealthStatus } from "./config";
import Section from "./section";
import IMouse from "./mouse";
import IHealth from "./interfaces/health";
import Projectile from "./projectile";
import { Guid } from "guid-typescript";
import ISpatial from "./spatial";

export default class Snake implements IHealth, ISpatial {
    public status: HealthStatus;
    public health: [number, number];
    public id: string;
    public username: string;
    public color: string;
    public sections: Section[];
    public speed: number;
    public velocity: [number, number];

    constructor(id: string, username: string, x: number, y: number) {
        this.status = HealthStatus.ALIVE
        this.health = [Config.INITIAL_SNAKE_HEALTH, Config.INITIAL_SNAKE_HEALTH];
        this.id = id;
        this.username = username;
        this.color = "0x" + this.intToRGB(this.hashCode(username));
        this.sections = [];
        this.speed = Config.INITIAL_SNAKE_SPEED;
        this.velocity = [Config.INITIAL_SNAKE_VELOCITY, Config.INITIAL_SNAKE_VELOCITY];

        for (let i = 0, length = Config.INITIAL_SNAKE_LENGTH; i < length; i++) {
            this.sections.push(new Section(x, y, Config.INITIAL_SNAKE_RADIUS));
        }
    }

    public moveTo(p: number[]): void {
        // removing tail from snake
        this.sections.splice(-1);

        // adding his new head in front of his old one
        let section: Section = new Section(this.sections[0].x + p[0], this.sections[0].y + p[1], Config.INITIAL_SNAKE_RADIUS);
        section.isHead = true;
        this.sections[0].isHead = false;

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

    public shoot(): Projectile {
        var projectile = new Projectile(this.id, Guid.create().toString(), this.head().x, this.head().y);
        projectile.setVelocityX(this.getVelocityX());
        projectile.setVelocityY(this.getVelocityY());
        projectile.launch();
        return projectile;
    }

    public hit(value: number): HealthStatus {
        this.health[0] -= value;
        if (this.health[0] <= 0) {
            this.health[0] = 0;
            return HealthStatus.DEAD;
        }

        return HealthStatus.ALIVE;
    }

    public heal(value: number): HealthStatus {
        this.health[0] += value;
        if (this.health[0] > this.health[1]) {
            this.health[0] = this.health[1];
        }

        return HealthStatus.ALIVE;
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

    public getSpeed(): number {
        return this.speed;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public getVelocity(): [number, number] {
        return this.velocity;
    }

    public getVelocityX(): number {
        return this.velocity[0];
    }

    public getVelocityY(): number {
        return this.velocity[1];
    }

    public setVelocityX(v: number): void {
        this.velocity[0] = v;
    }

    public setVelocityY(v: number): void {
        this.velocity[1] = v;
    }

    public setVelocity(v: [number, number]): void {
        this.velocity = v;
    }

    public serialize(): any {
        return {
            status: this.status,
            health: this.health,
            id: this.id,
            username: this.username,
            color: this.color,
            sections: this.sections.map(s => s.serialize())
        };
    }
}