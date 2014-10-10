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

	h = Client.ofelimoDOM.height();
	h -= Arxio.kritiriaDOM.height();
	Arxio.apotelesmataDOM.css('height', h + 'px');

	Arxio.kritiriaSetup();
};

Arxio.kritiriaSetup = function() {
	var date, mera, minas, etos;

	Arxio.kritiriaDOM.
	append($('<div>').addClass('formaPrompt').text('Παίκτης')).
	append(Arxio.pektisInputDOM = $('<input>').addClass('formaPedio').css('width', '140px')).
	append($('<div>').addClass('formaPrompt').text('Από')).
	append(Arxio.apoInputDOM = Client.inputDate()).
	append($('<div>').addClass('formaPrompt').text('Έως')).
	append(Arxio.eosInputDOM = Client.inputDate()).
	append($('<div>').addClass('formaPrompt').text('Παρτίδα')).
	append(Arxio.partidaInputDOM = $('<input>').addClass('formaPedio').css('width', '70px')).
	append(Arxio.goButtonDOM = $('<button>').addClass('formaButton').text('Go!!!')).
	append(Arxio.prevButtonDOM = $('<button>').addClass('formaButton').text('<')).
	append(Arxio.nextButtonDOM = $('<button>').addClass('formaButton').text('>'));

	if (Client.isPektis())
	Arxio.pektisInputDOM.val(Client.session.pektis);

	date = new Date();
	mera = date.getDate();
	minas = date.getMonth();
	etos = date.getFullYear();
	Arxio.eosInputDOM.val(mera + '-' + minas + '-' + etos);

	date = new Date(date.getTime() - (7 * 24 * 3600 * 1000));
	mera = date.getDate();
	minas = date.getMonth();
	etos = date.getFullYear();
	Arxio.apoInputDOM.val(mera + '-' + minas + '-' + etos);

	Arxio.goButtonDOM.on('click', function(e) {
		if (Arxio.kritiriaLathos())
		return;

		Client.ajaxService('arxio/epilogi.php', 'pektis=' + Arxio.pektisInputDOM.val(),
			'apo=' + Arxio.apoInputDOM.val(), 'eos=' + Arxio.eosInputDOM.val(),
			'partida=' + Arxio.partidaInputDOM.val()).
		done(function(rsp) {
			var tlist;

			try {
				tlist = ('[' + rsp + ']').evalAsfales();
			} catch (e) {
				Client.fyi.epano('Επεστράφησαν ακαθόριστα δεδομένα');
				Client.sound.beep();
				return;
			}

			Globals.awalk(tlist, function(i, trapezi) {
				new Trapezi(trapezi).trapeziArxioDisplay();
			});
		}).
		fail(function(err) {
			Client.ajaxFail(err);
		});
	});

	Arxio.pektisInputDOM.focus();
};

Arxio.kritiriaLathos = function() {
	return false;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziArxioDisplay = function() {
	var trapezi = this, kodikos, dom;

	kodikos = this.trapeziKodikosGet();

	Arxio.apotelesmataDOM.
	append(dom = $('<div>').addClass('trapeziTsoxa arxioTrapeziTsoxa'));

	dom.append($('<div>').addClass('trapeziData').text(kodikos));
	Prefadoros.thesiWalk(function(thesi) {
		dom.append($('<div>').addClass('pektis trapeziPektis').text(trapezi.trapeziPektisGet(thesi)));
	});

	arxio = trapezi.trapeziArxioGet();
	arxio = arxio ? Globals.poteOra(arxio) : '&mdash;';
	dom.append($('<div>').addClass('arxioTrapeziArxio').html(arxio));

	return this;
};
