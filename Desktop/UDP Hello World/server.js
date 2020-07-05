button.addEventListener('click', function() { // When "Say Hello" is clicked
		console.log("Running");
		
		var screenWidth = screen.availWidth;
		var screenHeight = screen.availHeight;
		var width = 200;
		var height = 200;
		
        var socketId;
		// Convert message to arrayBuffer 
        var arrayBuffer = stringToArrayBuffer("Hello World");
		
		// Handle the "onReceive" event.
		var onReceive = function(info) {
		if (info.socketId !== socketId)
			return;
			console.log("Received, Data: " + info.data);
			
			// Print the received message to console 
			var data = new DataView(info.data);
			var decoder = new TextDecoder("utf-8");
			var string = decoder.decode(data);
			console.log("Message: " + string);
			
			// Show message went throught with popup.html
 			chrome.app.window.create('popup.html', {
				id: "popupID",
				outerBounds: {
				width: width,
				height: height,
				left: Math.round((screenWidth-width)/2),
				top: Math.round((screenHeight-height)/2)
				}
			});
			
			// Close socket after receiving
			chrome.sockets.udp.close(socketId);
		};
		
		// Create socket
		chrome.sockets.udp.create({}, function (socketInfo) {
			socketId = socketInfo.socketId;
					
			chrome.sockets.udp.onReceive.addListener(onReceive); // Listen for Hello World
			chrome.sockets.udp.bind(socketId, "0.0.0.0", 9001, function(result) { // Bind Socket to be able to send message
				if (result < 0) {
					console.log("Error Binding");
					return;
				}
			
			// Send Hello World
			chrome.sockets.udp.send(socketId, arrayBuffer, "127.0.0.1", 9001, function (sendInfo) {
				if (sendInfo < 0) {
					console.log("Error Sending");
					return;
				}
				console.log("Sent, Data: " + sendInfo.data);
			});
		});
	});
});

// Converts string to arraybuffer to be able to send message
function stringToArrayBuffer(string) {
    var arrayBuffer = new ArrayBuffer(string.length * 2);
    var buffer = new Uint8Array(arrayBuffer);
    for (var i = 0, stringLength = string.length; i < stringLength; i++) {
        buffer[i] = string.charCodeAt(i);
    }
    return buffer;
}