// jshint esversion:6

// Make connection
// grab the host of the client - this will allow other machines on the localhost network to access the chat
const host = window.location.host;
const socket = io.connect(`http://${host}`); 

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

// 
message.addEventListener('keypress', (e) => {
	// on enter, sumbit chat message
	if(e.keyCode === 13){
		socket.emit('chat', {
		message: message.value,
		handle: handle.value
		});	
	}
	// 'is typing...'
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
	setTimeout(emptyFeedback, 2500);
});


