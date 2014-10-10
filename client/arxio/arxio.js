Arxio = {};

$(document).ready(function() {
	Client.tabPektis();
	Client.tabKlisimo($('#toolbarRight'));
	Arxio.setup();

	Arena = null;
	if (!window.opener) return;
	Arena = window.opener.Arena;
	if (!Arena) return;
});

Arxio.unload = function() {
	if (!Arena) return;
	if (!Arena.arxio) return;
	if (!Arena.arxio.win) return;

	Arena.arxio.win.close();
	Arena.arxio.win = null;
};

$(window).
on('beforeunload', function() {
	Arxio.unload();
}).
on('unload', function() {
	Arxio.unload();
});

Arxio.setup = function() {
	Client.ofelimoDOM.
	append(Arxio.kritiriaDOM = $('<div>').attr('id', 'kritiria')).
	append(Arxio.apotelesmataDOM = $('<div>').attr('id', 'apotelesmata'));

	Arxio.kritiriaSetup();
};

Arxio.kritiriaSetup = function() {
	Arxio.kritiriaDOM.
	append($('<div>').addClass('formaPrompt').text('Παίκτης')).
	append(Arxio.pektisInputDOM = $('<input>').addClass('formaPedio').css('width', '140px')).
	append($('<div>').addClass('formaPrompt').text('Από')).
	append(Arxio.apoInputDOM = Client.inputDate()).
	append($('<div>').addClass('formaPrompt').text('Έως')).
	append(Arxio.eosInputDOM = Client.inputDate()).
	append($('<div>').addClass('formaPrompt').text('Παρτίδα')).
	append(Arxio.partidaInputDOM = $('<input>').addClass('formaPedio').css('width', '70px')).
	append($('<button>').addClass('formaButton').text('Go!!!')).
	append($('<button>').addClass('formaButton').text('<')).
	append($('<button>').addClass('formaButton').text('>'));
};
