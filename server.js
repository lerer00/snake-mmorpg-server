import { io } from "socket.io";
const server = io(8081);
 
server.on("connect", function(socket) {
  console.log("user connected");
  socket.emit("connect", "welcome man");
});

server.on("movement", function(socket) {
  setInterval(function() {
	console.log("moving player");
	sockets.emit('state', players);
	}, 1000 / 60)
});