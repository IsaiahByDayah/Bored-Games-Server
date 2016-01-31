var express = require("express");
var app = express();
var server = require('http').createServer(app);
var fs = require('fs');
var io = require('socket.io')(server);

var port = process.env.PORT || 18000;
//serve static files from www folder
app.use(express.static(process.cwd() + '/www'));

app.get('/', function(req, res, next){
res.sendFile(__dirname+'/index.html');

});

server.listen(port);

io.on("connection", function(socket){
	console.log("Socket connected...");

	socket.on('disconnect', function(clientResponse){

		/*MARK: Using in future to update amount of user in the room
		var clients = io.sockets.adapter.rooms[clientResponse["room"]];   

		//to get the number of clients
		var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
		*/

		console.log('Socket disconnected.');
	});

	socket.on("JOIN_ROOM", function(clientResponse){
		socket.join(clientResponse["room"]);
		io.to(clientResponse["room"]).emit("MESSAGE", clientResponse);
	});

	socket.on("MESSAGE", function(clientResponse){
		io.to(clientResponse["room"]).emit("MESSAGE", clientResponse);
	});

	socket.on("chat message", function(message){
		console.log(message);
		io.emit("chat message", message);
	});

	socket.emit("message", "Hello World");
});

console.log("Listening on port " + port);
console.log("Directory name: " + __dirname);
console.log();