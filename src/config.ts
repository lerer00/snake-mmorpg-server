export class Config {
    static INITIAL_SNAKE_LENGTH: number = 10;
    static INITIAL_SNAKE_SPEED: number = 5;
    static INITIAL_SNAKE_VELOCITY: number = 0.1;
    static INITIAL_SNAKE_RADIUS: number = 12;
    static MAP_WIDTH: number = 100;
    static MAP_HEIGHT: number = 100;
}

export enum SnakeStatus {
    ALIVE = 1,
    DEAD = 2,
}