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
	console.log("\nSocket - " + socket.id + " connected...\n");

	socket.on('disconnect', function(clientResponse){

		/*MARK: Using in future to update amount of user in the room
		var clients = io.sockets.adapter.rooms[clientResponse["room"]];

		//to get the number of clients
		var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
		*/

		console.log("\nSocket - " + socket.id + " disonnected.\n");
	});

	socket.on("JOIN_ROOM", function(clientResponse){
		socket.join(clientResponse["room"]);

		console.log("\nSocket - " + socket.id + " \n\tjoined room - " + clientResponse["room"] + "\n");

		io.to(clientResponse["room"]).emit("MESSAGE", JSON.stringify(clientResponse));
	});

	socket.on("MESSAGE", function(clientResponse){
		console.log("\nSocket - " + socket.id + " \n\tmessage - " + clientResponse + "\n");
		io.to(clientResponse["room"]).emit("MESSAGE", JSON.stringify(clientResponse));
	});

	socket.on("RETURN", function(clientResponse){
		socket.emit("RETURN", clientResponse);
	});

	socket.on("chat message", function(message){
		console.log(message);
		io.emit("chat message", message);
	});

	var response = {
		"type": "CONNECT_INFO",
		"socketID": socket.id,
		"from": {
			"role": "SERVER"
		},
		"to": "Sender"
	}

	socket.emit("MESSAGE", JSON.stringify(response));
});

console.log("Listening on port " + port);
console.log("Directory name: " + __dirname);
console.log();