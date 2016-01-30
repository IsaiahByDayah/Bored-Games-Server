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

	socket.on('disconnect', function(){
		console.log('Socket disconnected.');
	});

	socket.emit("message", "Hello World");
});

console.log("Listening on port " + port);
console.log("Directory name: " + __dirname);
console.log();