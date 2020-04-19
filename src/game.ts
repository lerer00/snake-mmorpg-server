import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { Config } from "./config";
import { MessageTypes } from "./constant";
import Snake from "./snake";
import socket from "socket.io";
import IMouse from "./mouse";

export default class Game {
    public snakes: { [id: string]: Snake };
    private sockets: { [id: string]: SocketIO.Socket };
    private shouldSendUpdate = false;

    constructor() {
        this.sockets = {};
        this.snakes = {};

        setInterval(this.update.bind(this), 1000 / 30);
    }

    public addSnake(socket: SocketIO.Socket, username?: string): any {
        this.sockets[socket.id] = socket;

        // set his starting position
        const x: number = Config.MAP_WIDTH * (0.25 + Math.random() * 0.5);
        const y: number = Config.MAP_HEIGHT * (0.25 + Math.random() * 0.5);

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

    public handleInput(socket: socket.Socket, mouse: IMouse): void {
        var snake: Snake = this.snakes[socket.id];
        if (snake !== (null || undefined)) {
            this.snakes[socket.id].chase(mouse);
        }
    }

    public update(): void {
        // calculate time elapsed
        const now: number = Date.now();

        // update each snake
        Object.keys(this.sockets).forEach((id) => {
            const snake: Snake = this.snakes[id];
        });

        // send a game update to each snake every other time
        if (this.shouldSendUpdate) {
            Object.keys(this.sockets).forEach((id) => {
                const socket: SocketIO.Socket = this.sockets[id];
                const Snake: Snake = this.snakes[id];
                socket.emit(
                    MessageTypes.SNAKES_STATE,
                    this.createUpdate(Snake),
                );
            });
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }

    public createUpdate(snake: Snake): any {
        const snakes: Snake[] = Object.values(this.snakes)

        return {
            me: snake.serialize(),
            others: snakes
                .filter((s) => s.id != snake.id)
                .map((s) => s.serialize()),
            t: Date.now(),
        };
    }
}