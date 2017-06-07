console.log(document.cookie);

var hasNumber = /\d/;

var $suggestion = jQuery('#possibleSuggestion');

if(document.cookie) {
	console.log(document.cookie);
	splittedCookie = document.cookie.split("=");
	name = splittedCookie[1].substr(0,splittedCookie[1].length-42);

	$suggestion.append("If you want to continue a previous talk with us or find out whether we answered your question, please use the name you used last time you visited us on this device.");
	$suggestion.append("The name you previously used on this machine is " + '<b>' + name + '</b>');
} else {
	console.log("no cookie found");
};

var $openChatForm = jQuery('#openChatForm');

$openChatForm.on('submit', function(event) {
	var $inputName = $openChatForm.find('input[name=name]').val();

	if($inputName.length == 0 || $.trim($inputName).length == 0) {
		event.preventDefault();
		$('#inputFieldName').val('');
		$('#nameWarning').html('<b><font color="red">' + "Please provide us with a name" + '</font></b>');
		console.log("empty or spaces provided");
	} else if(hasNumber.test($inputName)) {
		event.preventDefault();
		$('#nameWarning').html('<b><font color="red">' + "Please do not use numbers in your name" + '</font></b>');
		$('#inputFieldName').val('');
		console.log("contains numbers");
	} else {
		console.log("get req made with name" + $inputName);
	}

});