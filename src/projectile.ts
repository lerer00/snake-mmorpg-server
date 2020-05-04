import { ProjectileStatus, Config } from "./config";
import ISpatial from "./interfaces/spatial";
import { Circle } from "./utilities/shapes";

export default class Projectile extends Circle implements ISpatial {
    private _interval: NodeJS.Timeout;
    public status: ProjectileStatus;
    public owner: string;
    public id: string;
    public speed: number;
    public velocity: [number, number];

    constructor(owner: string, id: string, x: number, y: number) {
        super(x, y, Config.INITIAL_PROJECTILE_RADIUS);

        this.status = ProjectileStatus.ALIVE;
        this.owner = owner;
        this.id = id;
        this.speed = Config.INITIAL_PROJECTILE_SPEED;
        this.velocity = [Config.INITIAL_PROJECTILE_VELOCITY, Config.INITIAL_PROJECTILE_VELOCITY];
    }

    public launch(): void {
        this._interval = setInterval(() => {
            this.progress();
        }, 1000 / 60);
    }

    public progress(): void {
        if (this.x < 2048 && this.x >= 0 && this.y < 2048 && this.y >= 0) {
            this.x += this.getVelocityX() * this.getSpeed();
            this.y += this.getVelocityY() * this.getSpeed();;
        } else {
            this.destroy();
        }
    }

    public explode(): void {
        this.status = ProjectileStatus.EXPLODED;
        clearInterval(this._interval);
    }

    public destroy(): void {
        this.status = ProjectileStatus.EXPLODED;
        clearInterval(this._interval);
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
            ...(super.serialize()),
            status: this.status,
            owner: this.owner,
            id: this.id
        };
    }
}