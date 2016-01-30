var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

var port = process.env.PORT || 18000;

var server = http.createServer(function(req, res){
	// console.log("URL: " + req.url);

	fs.readFile(__dirname+"/../www/index.html", function(err, data){
		if (err) {
			res.writeHead(500);
			return res.end("Error loading index.html");
		}

		res.writeHead(200);
		res.end(data);
	});
});

var io = socketio(server);

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

	socket.on("join room", function(clientResponse){
		console.log("Socket attempting to join room...");

		socket.join(clientResponse["room"]);

		console.log("socket - " + socket.id + " \njoined room - " + clientResponse["room"]);

		io.to(clientResponse["room"]).emit("message", JSON.stringify(clientResponse));
	});

	socket.on("message", function(clientResponse){
		console.log("Socket attempting to send message...");

		console.log("socket - " + socket.id + " \nmessage - " + clientResponse);

		io.to(clientResponse["room"]).emit("message", JSON.stringify(clientResponse));
	});

	var response = {
		"type": "CONNECT_INFO",
		"socketID": socket.id,
		"from": "Server",
		"to": "Sender"
	}

	socket.emit("message", JSON.stringify(response));
});

console.log("Listening on port " + port);
console.log("Directory name: " + __dirname);
console.log();