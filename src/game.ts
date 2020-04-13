import Player from "./player";
import Config from "./config";
import { MessageTypes } from "./constant";


export default class Game {
    private _sockets: { [id: string]: SocketIO.Socket };
    private _players: { [id: string]: Player };
    private _shouldSendUpdate = false;

    constructor() {
        this._sockets = {};
        this._players = {};
        setInterval(this.update.bind(this), 1000 / 60);
    }

    public addPlayer(socket: SocketIO.Socket, username: string): void {
        this._sockets[socket.id] = socket;

        // set his starting position
        const x: number = Config.MAP_SIZE * (0.25 + Math.random() * 0.5);
        const y: number = Config.MAP_SIZE * (0.25 + Math.random() * 0.5);
        this._players[socket.id] = new Player(socket.id, username, x, y);
    }

    public removePlayer(socket: SocketIO.Socket): void {
        delete this._sockets[socket.id];
        delete this._players[socket.id];
    }

    public handleInput(socket: SocketIO.Socket, dir: any): void {
        if (this._players[socket.id]) {
            this._players[socket.id].setDirection(dir);
        }
    }

    public update(): void {
        // calculate time elapsed
        const now: number = Date.now();

        // update each player
        Object.keys(this._sockets).forEach(playerID => {
            const player: Player = this._players[playerID];
        });

        // send a game update to each player every other time
        if (this._shouldSendUpdate) {
            Object.keys(this._sockets).forEach(playerID => {
                const socket: SocketIO.Socket = this._sockets[playerID];
                const player: Player = this._players[playerID];
                socket.emit(
                    MessageTypes.GAME_UPDATE,
                    this.createUpdate(player),
                );
            });
            this._shouldSendUpdate = false;
        } else {
            this._shouldSendUpdate = true;
        }
    }

    public createUpdate(player: Player): any {
        const nearbyPlayers: Array<Player> = Object
            .values(this._players)
            .filter(p => p !== player && p.interspace(player) <= Config.MAP_SIZE / 2);

        return {
            t: Date.now(),
            me: player.serialize(),
            others: nearbyPlayers.map(p => p.serialize()),
        };
    }
}