var name =  getQueryVariable('name') || "Anonymous";
var cookie = document.cookie.substr(23,);
console.log(cookie);

function getName() {
	var name = getQueryVariable('name');
	if (typeof name === 'undefined') {
		return "Anonymous";
	}
	return name;
};

function createMessage(user, message) {
	var momentTimestamp = moment.utc(message.timestamp);

	if (message.sender == "client") {
		var $message = jQuery('<li class="list-group-item" style="text-align: right"></li>');	
	} else {
		var $message = jQuery('<li class="list-group-item"></li>');	
	} 
	$message.append('<p> <strong>' + message.userName + ' @ ' + momentTimestamp.local().format('DD MMM HH:mm') + '</strong></p>');
	$message.append('<p style="margin: 0 0 0 5px">' + message.text + '</p>');

	return $message;
};

var socket = io();

socket.on('connect', function () {
	console.log('connected to socket.io server');
	socket.emit('checkChat', {
		name: cookie
	});
});


socket.on('message', function(message) {
	var $messages = jQuery('.messages');
	if (Array.isArray(message) == true) {
		$(".messages").html(''); //I remove the html of .messages because I load all last 60 messages instead of an extra 30, needs fixin'

		for (var j = 0; j < message.length; j++) {
			$messages.prepend(createMessage(getName(), message[j]));
		}
	} else {
		console.log('New message:');
		console.log(moment.utc(message.timestamp).local().format('DD MMM YYYY HH:mm') + ' - ' + message.text);
		$messages.append(createMessage(getName(), message));
	};
});


var $form = jQuery('#message-form');
$form.on('submit', function(event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		text: $message.val(),
		user: cookie,
		sender: "client",
		userName: cookie.substr(0,cookie.length-42),
		timestamp: moment().valueOf()
	});

	console.log("msg sent");

	$message.val('');
});

//load more messages
var $loading = jQuery('#load-messages');
var messages_amount = 0;

$loading.on('submit', function(event) {
	event.preventDefault();

	messages_amount += 30;
	socket.emit('load-messages', {
		amount: messages_amount
	});
});
