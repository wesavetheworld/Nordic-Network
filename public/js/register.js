var values = [];
var host = "N/A";
var port = -1;

$(document).ready(function() {
    $.get("../properties.txt", function(data) {
        values = data.split("\n");
		
		host = values[0].trim();
		port = Number(values[1]);
	}).fail(function() {
		swal("Failed to get server IP", "Please contact our admins about this error so we can fix it as soon as possible!", "error");
	}).done(function() {
		if(port) {
			var socket = io('http://' + host + ":" + port);
		} else {
			var socket = io('http://' + host);
		}
		
		socket.on('disconnect', function() {
			swal("Unable to connect to server.", "It seems our game servers are down.\nPlease be patient while we work on a fix!", "error");
		});
		
		socket.on('reg-complete', function(data){
			if(data.success){
				location.reload();
			} else {
				swal("Failed to register", "Reason: " + data.reason + "\nID: " + data.id, "error");
			}
		});
		
		$('form').submit(function(){
			if($('#passwrd')[0].val() == $('#passwrd')[1].val()) {
				socket.emit('register', {email: $('#email').val(), pass: $('#passwrd')[0].val()});
			} else {
				swal("Failed to register", "Passwords do not match.", "error");
			}
			
			return false;
		});
    }, 'text');
});
