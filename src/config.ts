export class Config {
    static INITIAL_SNAKE_LENGTH: number = 10;
    static INITIAL_SNAKE_SPEED: number = 5;
    static INITIAL_SNAKE_RADIUS: number = 8;
    static INITIAL_SNAKE_HEALTH: number = 100;
    static INITIAL_SNAKE_VELOCITY: number = 0.1;
    static INITIAL_PROJECTILE_SPEED: number = 5;
    static INITIAL_PROJECTILE_RADIUS: number = 4;
    static INITIAL_PROJECTILE_VELOCITY: number = 0.1;
    static MAP_WIDTH: number = 100;
    static MAP_HEIGHT: number = 100;
}

export enum ProjectileStatus{
    ALIVE = 1,
    EXPLODED = 2,
    LOST = 3
}

export enum HealthStatus{
    ALIVE = 1,
    DEAD = 2,
}