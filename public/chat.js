// jshint esversion:6
// Make connection
const socket = io.connect('http://localhost:3000'); 

// query DOM
let message  = document.getElementById('message'),
	handle = document.getElementById('handle'),
	button = document.getElementById('send'),
	output = document.getElementById('output'),
	feedback = document.getElementById('feedback');

// front end events
button.addEventListener('click', () => {
	socket.emit('chat', {
		message: message.value,
		handle: handle.value
	});
});

message.addEventListener('keypress', () => {
	socket.emit('typing', handle.value);
});

// on key up, the 'is typing...' message will not be displayed
message.addEventListener('keyup', () => {
	socket.emit('no-typing');
});


// backend socket (server) events
socket.on('chat', (data) => {
	feedback.innerHTML = "";
	message.value = "";
	output.innerHTML += `<p><strong>${data.handle}:</strong> ${data.message}</p>`;
});

socket.on('typing', (data) => {
	feedback.innerHTML = `<p><em>${data} is typing message...</em></p>`;
});

socket.on('no-typing', () => {
	// set delay so the 'is typing...' is not flashing
	const emptyFeedback = () => feedback.innerHTML = "";
	setTimeout(emptyFeedback, 1900);
});


