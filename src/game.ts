import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { Config, ProjectileStatus, HealthStatus } from "./config";
import { MessageTypes } from "./constant";
import Snake from "./snake";
import socket from "socket.io";
import IMouse from "./mouse";
import Projectile from "./projectile";

export default class Game {
    public snakes: { [id: string]: Snake };
    public projectiles: { [id: string]: Projectile };
    private sockets: { [id: string]: SocketIO.Socket };
    private shouldSendUpdate = false;

    constructor() {
        this.sockets = {};
        this.snakes = {};
        this.projectiles = {};

        setInterval(this.update.bind(this), 1000 / 60);
    }

    public addSnake(socket: SocketIO.Socket, username?: string): any {
        this.sockets[socket.id] = socket;

        // set his starting position
        const x: number = Config.MAP_WIDTH * Math.random();
        const y: number = Config.MAP_HEIGHT * Math.random();

        if (username === undefined) {
            username = uniqueNamesGenerator({
                dictionaries: [adjectives, animals, colors],
                length: 2,
            });
        }
        this.snakes[socket.id] = new Snake(socket.id, username, x, y);

        console.log("[+] snake:\t" + username + "\tsocket (" + socket.id + ")");
    }

    public removeSnake(socket: SocketIO.Socket): void {
        const snake = this.snakes[socket.id];

        delete this.sockets[socket.id];
        delete this.snakes[socket.id];

        console.log("[-] snake:\t" + snake.username + "\tsocket (" + socket.id + ")");
    }

    public handleChase(socket: socket.Socket, mouse: IMouse): void {
        var snake: Snake = this.snakes[socket.id];
        if (snake !== (null || undefined)) {
            this.snakes[socket.id].chase(mouse);
        }
    }

    public handleShoot(socket: socket.Socket): void {
        var snake: Snake = this.snakes[socket.id];
        if (snake !== (null || undefined)) {
            var projectile: Projectile = this.snakes[socket.id].shoot();
            this.projectiles[projectile.id] = projectile;
        }
    }

    public update(): void {
        this.checkCollision();

        // send a game update
        if (this.shouldSendUpdate) {
            Object.keys(this.sockets).forEach((id) => {
                const socket: SocketIO.Socket = this.sockets[id];
                const snake: Snake = this.snakes[id];
                socket.emit(
                    MessageTypes.SNAKES_STATE,
                    this.createSnakesUpdate(snake),
                );
                if (Object.keys(this.projectiles).length > 0) {
                    socket.emit(
                        MessageTypes.PROJECTILES_STATE,
                        this.createProjectilesUpdate(snake),
                    );
                }
            });
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }

    public checkCollision(): void {
        var explodedProjectiles: string[] = [];
        var deadSnakes: string[] = [];

        for (let [projectileKey, projectile] of Object.entries(this.projectiles)) {
            for (let [snakeKey, snake] of Object.entries(this.snakes)) {
                if (projectile.owner === snakeKey) {
                    continue;
                }

                for (let i = 0; i <= snake.sections.length - 1; i++) {
                    if (projectile.intersect(snake.sections[i])) {
                        if (snake.hit(20) === HealthStatus.DEAD) {
                            deadSnakes.push(snake.id);
                            delete this.snakes[snake.id];
                        }
                        projectile.explode();

                        break;
                    }
                }

                if (projectile.status === ProjectileStatus.EXPLODED ||
                    snake.status === HealthStatus.DEAD) {
                    break;
                }
            }

            if (projectile.status == ProjectileStatus.EXPLODED) {
                explodedProjectiles.push(projectile.id);
                delete this.projectiles[projectileKey];
                continue;
            }
        }

        if (deadSnakes.length > 0 || explodedProjectiles.length > 0) {
            Object.keys(this.sockets).forEach((id) => {
                const socket: SocketIO.Socket = this.sockets[id];
                socket.emit(
                    MessageTypes.SWEEP_STATE,
                    this.createSweepUpdate(deadSnakes, explodedProjectiles),
                );
            });
        }
    }

    public createSnakesUpdate(snake: Snake): any {
        var me = null;
        var snakes: Snake[] = Object.values(this.snakes)
        if (snake !== undefined) {
            me = snake.serialize();
            snakes = snakes.filter(s => s.id != snake.id);
        }

        return {
            me: me,
            others: snakes.map((s) => s.serialize()),
            t: Date.now(),
        };
    }

    public createProjectilesUpdate(snake: Snake): any {
        const projectiles: Projectile[] = Object.values(this.projectiles)

        return {
            projectiles: projectiles
                .map((p) => p.serialize()),
            t: Date.now(),
        };
    }

    public createSweepUpdate(snakes: string[], projectiles: string[]): any {
        return {
            snakes: snakes,
            projectiles: projectiles,
            t: Date.now(),
        };
    }

    public clear(): void {
        console.log("[~] reset server");
        this.sockets = {};
        this.snakes = {};
        this.projectiles = {};
    }
}