$(document).ready(function() {
	var ofelimoDOM;

	Kitapi.opener = window.opener;
	Client.bodyDOM.css({
		backgroundImage: "url('../ikona/paraskinio/kitapi.jpg')",
	});

/*
	ofelimoDOM = $('#ofelimo');
	Kitapi.perioxi3 = $('<div>').attr('id', 'kitapiPerioxi3').
	addClass('kitapiPerioxi').appendTo(ofelimoDOM);
	Kitapi.perioxi2 = $('<div>').attr('id', 'kitapiPerioxi2').
	addClass('kitapiPerioxi').appendTo(ofelimoDOM);
	Kitapi.perioxi1 = $('<div>').attr('id', 'kitapiPerioxi1').
	addClass('kitapiPerioxi').appendTo(ofelimoDOM);
*/
});

Kitapi = {};

Kitapi.unload = function() {
	if (Kitapi.unloaded) return;
	Kitapi.unloaded = true;
	if (!Kitapi.opener) return;
	if (!Kitapi.opener.Arena) return;
	Kitapi.opener.Arena.kitapi.klisimo();
}

$(window).on('beforeunload', function() {
	Kitapi.unload();
});

$(window).on('unload', function() {
	Kitapi.unload();
});
