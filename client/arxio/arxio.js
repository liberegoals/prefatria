Arxio = {};

$(document).ready(function() {
	Client.tabPektis();
	Client.tabKlisimo($('#toolbarRight'));

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
