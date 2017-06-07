$( document ).ready(function () {
	$( ".caty" ).click(function () {
		category = this.id;
		if ($("#"+this.id+"Art").is(':empty')){
			var chats = $.ajax({
				url: "/messagecontrol/reqChats",
				type: "GET",
				data: {
					category: this.id
				} 
			}).then(function (chats) {
				

				chats.forEach(function (chat) {
					var userName = chat.name.substr(0,chat.name.length-42);
					
					$("#"+category+"Art").append('<li class="btn btn-custom btn-block '+ category +'" id="' + chat.name + '"><a>' + userName + "<a></li>");
				});
				return category
			}).then(function (category) {
				$("."+category).click(function() {
					var user = this.id;

					document.cookie = "personalizedChatCookie=s3rv3r11" + "00000"+ "00000"+ "00000"+ "00000"+ "00000"+ "00000"+ "00000"+ "00000";
					console.log(document.cookie);



					var socket = io();


					function createMessage(message) {
						var momentTimestamp = moment.utc(message.timestamp);

						if (message.sender == "server") {
							var $message = jQuery('<li class="list-group-item" style="text-align: right"></li>');	
						} else {
							var $message = jQuery('<li class="list-group-item"></li>');	
						} 
						$message.append('<p> <strong>' + message.userName + ' @ ' + momentTimestamp.local().format('DD MMM HH:mm') + '</strong></p>');
						$message.append('<p style="margin: 0 0 0 5px">' + message.text + '</p>');

						return $message;
					};


					socket.on('connect', function () {
						console.log('now connected to socket.io server');
						console.log(user);
						socket.emit('messagecontrol', user);
						$('#content').html('<div class="container"><div class="row"><div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 well"><a class="btn btn-default" href="/index.html">Go back to homepage</a><h1 class="chat-name text-center"></h1><form id="load-messages"><div class="form-group"><input class="btn btn-default btn-block" type="submit" value="^ Load earlier messages ^"/></div></form><ul class="messages list-group"><!-- //here comes the messages and stuff--></ul><form id="message-form"><div class="form-group"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-comment"></i></span><input type="text" name="message" class="form-control"/></div></div><div class="form-group"><input class="btn btn-custom btn-block" type="submit" value="Send message"/></div></form><p id="backlink"></p><script>$("#backlink").append("<a class href=" + document.referrer + ">Back to overview (login required)</a>")</script></div></div></div>');			

						socket.on('message', function (message) {
							$messages = jQuery('.messages');
							if (Array.isArray(message) == true) {
								$messages.html(''); //I remove the html of .messages because I load all last 60 messages instead of an extra 30, needs fixin'
							
								for (var j = 0; j < message.length; j++) {
									$messages.prepend(createMessage(message[j]));
								}
							} else {
								console.log('New message:');
								console.log(moment.utc(message.timestamp).local().format('DD MMM YYYY HH:mm') + ' - ' + message.text);
								$messages.append(createMessage(message));
							};
						});

						socket.on('notfound', function() {
							console.log("chat not found in database");
						});

						$form = jQuery('#message-form');
						$form.on('submit', function(event) {
							event.preventDefault();

							var $message = $form.find('input[name=message]');
							socket.emit('message', {
								text: $message.val(),
								user: user,
								sender: "server",
								userName: "server",
								timestamp: moment().valueOf()
							});

							console.log("msg sent");

							$message.val('');
						});

					});




					// var responseMessages;
					// console.log(user);
					// var messages = $.ajax({
					// 	url: "/messagecontrol/chat",
					// 	type: "GET",
					// 	data: {
					// 		user: user
					// 	},
					// 	success: function(res, status, xhr) {
					// 		responseMessages= xhr.getResponseHeader("foundMessages");
					// 	} 
					// }).then(function (messages) {
					// 	window.location = '/ownerchat.html';
					// 	console.log(messages);
					// });
				});
			});
		}
	});
});

// 				category = articleTitles.splice(0,1);
// 				articleTitles.forEach(function (articleTitle) {
// 					$( "#"+category[0]+"Art").append('<li class="'+ category[0] +'" id="' + articleTitle + '"><a>' + articleTitle + "<a></li>");
// 				});
// 				return category[0];
// 			}).then(function (category) {
// 				$( "."+category).click(function () {
// 					var title = this.id;
// 					$.ajax({
// 						url: "/browse/article/content",
// 						type: "GET",
// 						data: {
// 							title: title,
// 							category: category
// 						}
// 					}).then(function (articles) {
// 						articleTitle=articles[0].title;
// 						articleText=articles[0].text;
// 						articleAuthor=articles[0].author;
// 						$(".content").html('<h1>'+articleTitle+'</h1><br/><br/>'+articleText+'<br/><br/><p><i><small> Written by: '+articleAuthor+'</i></small></p><br/><br/><br/><br/><a href="/browse">Back to Explorer</a>');
// 					});
// 				});
// 			});	
// 		} else {
// 			$("#"+this.id+"Art").empty();
// 		}
// 	});
// });
