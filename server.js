var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var db = require('./db.js');
var moment = require('moment');
var _ = require('underscore');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 3000;


//app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

function loadMessages(socket, user, amount) {
	if (typeof user != 'undefined') {
		db.message.count({
			where: {
				user: user
			}
		}).then(function (count) {
			if (count < amount) count = amount;
			db.message.findAll({
				where: {
					user: user
				},
				//offset: count-amount,
				limit: amount,
				order: 'timestamp DESC'
			}).then(function (messages) {
				socket.emit('message', messages);
			});
		});
	};
};


app.get('/', function(req, res) {
	console.log('index requested');

	//res.clearCookie('personalizedChatCookie');
	res.sendFile(__dirname + '/public/index.html');
});



app.get('/chatblock.html', function(req, res) {
	console.log('chatblock requested');
	console.log(req.query);
	console.log(req.cookies);
	var nameR = req.query.name;
	var nameC;
	if(req.cookies.personalizedChatCookie) {nameC = req.cookies.personalizedChatCookie.substr(0,req.cookies.personalizedChatCookie.length-42)} else {nameC = null}; 
	
	if(req.cookies.personalizedChatCookie == null || nameR != nameC) {
		cookie = (nameR + "11" + crypto.randomBytes(20).toString('hex')).toString();
		console.log(cookie);
		console.log('cookiecreatedandsend')	
		res.cookie('personalizedChatCookie', cookie, {maxAge:90000000000});
	}

//	app.use(express.static(__dirname + '/public'));
	res.sendFile(__dirname + '/public/chatblock.html');

});

app.post('/messagecontrol', function(req, res) {
	
	// should implement ecryption and not just a post request, because then data is sent unencrypted over the internet

	data = _.pick(req.body, 'name', 'password');
	if(data.name == "admin" && data.password == "admin") {
		res.sendFile(__dirname + '/public/messagecontrol.html');	
		// should implement validation middleware before sending messagecontrol, because now you can just acces messagecontrol if you know the url

	} else {
		res.sendFile(__dirname + '/public/error.html');
	};

});

app.get('/messagecontrol/reqChats', function(req, res) {
	var category = req.query.category;
	console.log(category);

	if(category == "archivedChats") {
		db.user.findAll({
			where: {
				isOpen: false
			}
		}).then(function (users) {
			console.log("found users with archived chats");
			res.send(users);
		});

	} else {
		if (category == "answeredChats") {
			db.user.findAll({
				where: {
					isOpen: true,
					isAnswered: true
				}
			}).then(function (users) {
					console.log("found users with answered chats");
					res.send(users);
			});
		} else {
			db.user.findAll({
				where: {
					isOpen: true,
					isAnswered: false
				}
			}).then(function (users) {
					console.log("found users with unanswerd chats");
					res.send(users);
			});
		}
	}
});

app.get('/messagecontrol/chat', function(req,res) {
	console.log(req.query.user);
	db.message.findAll({where: {user: req.query.user}}).then(function(messages) {
		res.send(messages);
	});
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {

	// find the cookieValue
	cookies = socket.handshake.headers.cookie;
	if(cookies.charAt(0) == 'p') {
		cookieData = cookies.split("; ")[0];
		cookieValue = cookieData.substr(23,cookieData.length-1);
	} else {
		cookieData = cookies.split("; ")[1];
		cookieValue = cookieData.substr(23,cookieData.length-1);	
	}	

	// if(cookieValue = "s3rv3r11"+ "00000"+ "00000"+ "00000"+ "00000"+ "00000"+ "00000"+ "00000"+ "00000") {
	// 		// owner socket part
	// 		console.log("serverside connected")
	// } else {

	socket.on('checkChat', function(client) {

		db.user.findOne({where: {name: cookieValue}}).then(function(user) {
			if(user) {
				console.log('user found');
				loadMessages(socket,cookieValue, 3);
			// if user is found, I will gather messages associated, here and send them to client

			} else {
				db.user.create({name: cookieValue, isOpen: true, isAnswered: true});
			}
		}, function(error) {
				console.log('not found nor created');
				console.log(error);
			});
		});


	socket.on('message', function(message) {
		console.log('Message received: ' + message.user + ' @ ' + moment.utc(message.timestamp).local().format('D/M/YYYY HH:mm') + ': ' + message.text);
		socket.emit('message', message);
		db.message.create(message);
		db.user.update({isAnswered: false}, {where: {name: message.user}});

	});

	socket.on('load-messages', function (inf) {
		loadMessages(socket, cookieValue, inf.amount);
	});

	socket.on('messagecontrol', function(usercookie) {
		console.log("sending back messages from " + usercookie);
		db.user.findOne({where: {name: usercookie}}).then(function(user) {
			if(user) {
				console.log('user found');
				loadMessages(socket, user.name, 30);
			// if user is found, I will gather messages associated, here and send them to client

			} else {
				socket.emit('notfound');
			}
		}, function(error) {
				console.log('not found nor created');
				console.log(error);
		});
		
	});

});


db.sequelize.sync().then(function() {
	http.listen(PORT, function() {
		console.log('Server started');
	});
});

