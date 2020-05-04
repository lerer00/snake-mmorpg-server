import { Config, HealthStatus } from "./config";
import Section from "./section";
import IMouse from "./mouse";
import IHealth from "./interfaces/health";
import Projectile from "./projectile";
import { Guid } from "guid-typescript";
import ISpatial from "./interfaces/spatial";
import ICooldown from "./interfaces/cooldown";
import { intToRGB } from "./utilities/util";
import { Circle, Point } from "./utilities/shapes";

export default class Snake implements IHealth, ISpatial, ICooldown {
    private _target: Point;
    public status: HealthStatus;
    public health: [number, number];
    public id: string;
    public username: string;
    public color: string;
    public sections: Section[];
    public speed: number;
    public velocity: [number, number];
    public cooldownUntil: number;
    public cooldownInterval: number;

    public r: number;

    constructor(id: string, username: string, x: number, y: number) {
        this._target = new Point(0, 0);

        this.status = HealthStatus.ALIVE
        this.health = [Config.INITIAL_SNAKE_HEALTH, Config.INITIAL_SNAKE_HEALTH];
        this.id = id;
        this.username = username;
        this.color = "0x" + intToRGB(this.hashCode(username));
        this.sections = [];
        this.speed = Config.INITIAL_SNAKE_SPEED;
        this.velocity = [Config.INITIAL_SNAKE_VELOCITY, Config.INITIAL_SNAKE_VELOCITY];
        this.cooldownUntil = 0;
        this.cooldownInterval = Config.INITIAL_COOLDOWN_INTERVAL;

        this.r = 0;

        for (let i = 0, length = Config.INITIAL_SNAKE_LENGTH; i < length; i++) {
            this.sections.push(new Section(x, y, Config.INITIAL_SNAKE_RADIUS));
        }
    }

    public move(): void {
        // adding his new head in front of his old one
        if (this.sections[0].x + this.getVelocityX() < 0 || this.sections[0].x + this.getVelocityX() > Config.MAP_WIDTH ||
            this.sections[0].y + this.getVelocityY() < 0 || this.sections[0].y + this.getVelocityY() > Config.MAP_HEIGHT) {
            return;
        }

        // removing tail from snake
        this.sections.splice(-1);

        let section: Section = new Section(this.sections[0].x + this.getVelocityX(), this.sections[0].y + this.getVelocityY(), Config.INITIAL_SNAKE_RADIUS);

        // setting new head
        section.isHead = true;
        this.sections[0].isHead = false;

        // adding the section to the whole snake
        this.sections.unshift(section);
    }

    public chase(mouse: IMouse): void {
        // check if mouse has moved
        if (this._target.x == mouse.pointer.x && this._target.y == mouse.pointer.y) {
            this.move();
            return;
        }

        // set new target
        this._target.x = mouse.pointer.x;
        this._target.y = mouse.pointer.y;

        let dx: number = mouse.pointer.x - this.head().x;
        let dy: number = mouse.pointer.y - this.head().y;
        let angle: number = Math.atan2(dy, dx);

        var projectedVelocity: [number, number] = [Math.cos(angle) * this.getSpeed(), Math.sin(angle) * this.getSpeed()];
        var projectedDestination: Point = new Point(this.head().x + projectedVelocity[0], this.head().y + projectedVelocity[1]);

        if (!projectedDestination.in(new Circle(mouse.pointer.x, mouse.pointer.y, Config.MOUSE_SHIELD_RADIUS))) {
            this.setVelocityX(projectedVelocity[0]);
            this.setVelocityY(projectedVelocity[1]);
        }

        this.move();
    }

    public shoot(): Projectile {
        if (Date.now() > this.cooldownUntil) {
            this.cooldownUntil = Date.now() + this.cooldownInterval;
            var projectile = new Projectile(this.id, Guid.create().toString(), this.head().x, this.head().y);
            projectile.setVelocityX(this.getVelocityX());
            projectile.setVelocityY(this.getVelocityY());
            projectile.launch();

            return projectile;
        }

        return null;
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