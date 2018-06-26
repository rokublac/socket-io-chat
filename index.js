// jshint esversion:6
const express = require('express');
const socket = require('socket.io');


// express app setup
const app = express();
const port = 3000;
const server = app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

// static files - will get index.html from 'public' folder
app.use(express.static('public'));

// socket setup
const io = socket(server);
// listen to 'connection' event - socket instance is created
io.on('connection', (socket) => {
	console.log('socket connected', socket.id);

	// listen for handle chat event
	socket.on('chat', (data) => {
		// emit data to all clients that are connected
		io.emit('chat', data);
	});

	// listen for message being typed
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', data);
	});

	socket.on('no-typing', () => {
		// emit on every other client besides the the one that's emitting.
		socket.broadcast.emit('no-typing');
	});

});