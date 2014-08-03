$(document).ready(function() {
	Kitapi.opener = window.opener;
	Client.bodyDOM.css({
		backgroundImage: "url('../ikona/paraskinio/kitapi.jpg')",
	});
});

Kitapi = {};

Kitapi.unload = function() {
	if (Kitapi.unloaded) return;
	Kitapi.unloaded = true;
	if (!Kitapi.opener) return;

	Kitapi.opener.Arena.kitapi.klisimo();
}

$(window).on('beforeunload', function() {
	Kitapi.unload();
});

$(window).on('unload', function() {
	Kitapi.unload();
});
