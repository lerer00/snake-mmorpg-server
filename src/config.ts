export class Config {
    static INITIAL_SNAKE_LENGTH: number = 10;
    static INITIAL_SNAKE_SPEED: number = 5;
    static INITIAL_SNAKE_RADIUS: number = 9;
    static INITIAL_SNAKE_HEALTH: number = 100;
    static INITIAL_SNAKE_VELOCITY: number = 0.1;
    static INITIAL_PROJECTILE_SPEED: number = 3;
    static INITIAL_PROJECTILE_RADIUS: number = 3;
    static INITIAL_PROJECTILE_VELOCITY: number = 0.1;
    static INITIAL_COOLDOWN_INTERVAL: number = 500;
    static MAP_WIDTH: number = 2000;
    static MAP_HEIGHT: number = 1000;
    static MOUSE_SHIELD_RADIUS: number = 30;
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