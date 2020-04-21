import Game from "./game";
import socket from "socket.io";
import http from "http";
import IMouse from "./mouse";

const app = http.createServer()
const io = socket(app);

app.listen(process.env.PORT || 3000);

// Single game server.
const game = new Game();

io.on("connect", (socket: socket.Socket) => {
  game.addSnake(socket);
  socket.on("chase", (mouse: IMouse) => game.handleInput(socket, mouse));
  socket.on("pingz", function() {
    socket.emit("pongz", {});
  });
});