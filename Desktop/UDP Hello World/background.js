chrome.app.runtime.onLaunched.addListener(function() { // Open popup window.html
  
	// Center window on screen.
	var screenWidth = screen.availWidth;
	var screenHeight = screen.availHeight;
	var width = 200;
	var height = 200;

	chrome.app.window.create('window.html', {
		id: "windowID",
		outerBounds: {
			width: width,
			height: height,
			left: Math.round((screenWidth-width)/2),
			top: Math.round((screenHeight-height)/2)
		}
	});
});