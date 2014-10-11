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
	minas = date.getMonth() + 1;
	etos = date.getFullYear();
	Arxio.eosInputDOM.val(mera + '-' + minas + '-' + etos);

	date = new Date(date.getTime() - (7 * 24 * 3600 * 1000));
	mera = date.getDate();
	minas = date.getMonth() + 1;
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
				console.error(rsp);
				Client.fyi.epano('Επεστράφησαν ακαθόριστα δεδομένα');
				Client.sound.beep();
				return;
			}

			Globals.awalk(tlist, function(i, trapeziEco) {
				var deco, trapezi, prop;

				// Τα αποτελέσματα έχουν παραληφθεί σε «οικονομική» μορφή, δηλαδή
				// τα ονόματα των properties του τραπεζιού είναι συντομογραφικά.

				deco = {
					k: 'kodikos',
					e: 'enarxi',
					p1: 'pektis1',
					p2: 'pektis2',
					p3: 'pektis3',
					a: 'arxio',
					t: 'trparam',
					d: 'dianomi',
				};

				trapezi = {};
				for (prop in deco) {
					trapezi[deco[prop]] = trapeziEco[prop];
				}

				new Trapezi(trapezi).
				trapeziArxioKapikia().
				trapeziArxioDisplay();
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

Trapezi.prototype.trapeziArxioKapikia = function() {
	var trapezi = this, kasa;

	kasa = parseInt(this.trparam['ΚΑΣΑ']);
	if (isNaN(kasa)) kasa = (this.trparam['ΚΑΣΑ'] = 50);

	this.trapeziThesiWalk(function(thesi) {
		this['kapikia' + thesi] = -kasa * 10;
	});

	kasa *= 30;
	this.trapeziDianomiWalk(function() {
		var dianomi = this;

		Prefadoros.thesiWalk(function(thesi) {
			trapezi['kapikia' + thesi] += parseInt(dianomi['k' + thesi]) + parseInt(dianomi['m' + thesi]);
			kasa -= parseInt(dianomi['k' + thesi]);
		});
	});

	this.ipolipo = kasa;
	kasa = Math.floor(kasa / 3);

	this['kapikia1'] += kasa;
	this['kapikia2'] += kasa;
	this['kapikia3'] = -this['kapikia1'] - this['kapikia2'];

	return this;
};

Trapezi.prototype.trapeziArxioDisplay = function() {
	var trapezi = this, kodikos;

	if (this.DOM) this.DOM.emtpy();
	else Arxio.apotelesmataDOM.append(this.DOM = $('<div>').addClass('trapeziTsoxa'));

	kodikos = this.trapeziKodikosGet();

	this.DOM.
	append($('<div>').addClass('trapeziData').
	append($('<div>').addClass('trapeziDataKodikos').text(kodikos)).
	append($('<div>').addClass('trapeziDataIpolipo').text(this.ipolipo)));
	Prefadoros.thesiWalk(function(thesi) {
		var pektis, dom, kapikia, kapikiaKlasi;

		pektis = trapezi.trapeziPektisGet(thesi);
		if (!pektis) pektis = '&#8203;';
		trapezi.DOM.append(dom = $('<div>').addClass('pektis trapeziPektis').html(pektis));

		kapikia = parseInt(trapezi['kapikia' + thesi]);
		if (isNaN(kapikia)) kapikia = 0;
		if (!kapikia) kapikia = '&#8203;';

		kapikiaKlasi = 'arxioKapikia';
		if (kapikia < 0) kapikiaKlasi += ' arxioKapikiaMion';

		dom.append($('<div>').addClass(kapikiaKlasi).html(kapikia));
	});

	arxio = trapezi.trapeziArxioGet();
	if (arxio) this.DOM.append($('<div>').addClass('trapeziArxio').text(Globals.poteOra(arxio)));
	else this.DOM.append($('<div>').addClass('trapeziArxio plagia').text('Σε εξέλιξη…'));

	this.trapeziArxioOptions();
	return this;
};

Trapezi.prototype.trapeziArxioOptions = function() {
	this.DOM.
	append(this.optsDOM = $('<div>').addClass('trapeziOpts'));

	if (this.trapeziIsPaso()) this.trapeziOptionIcon('Παίζεται το πάσο', 'pasoOn.png');
	if (this.trapeziOxiAsoi()) this.trapeziOptionIcon('Δεν παίζονται οι άσοι', 'asoiOn.png');
	if (this.trapeziTeliomaAnisoropo())
	this.trapeziOptionIcon('Ανισόρροπη πληρωμή τελευταίας αγοράς', 'postel/anisoropo.png');
	else if (this.trapeziTeliomaDikeo())
	this.trapeziOptionIcon('Δίκαιη πληρωμή τελευταίας αγοράς', 'postel/dikeo.png');
	if (this.trapeziIsFiliki()) this.trapeziOptionIcon('Εκπαιδευτική/Φιλική παρτίδα', 'filiki.png');
	if (this.trapeziIsKlisto()) this.trapeziOptionIcon('Κλειστό τραπέζι', 'klisto.png');
	if (this.trapeziIsPrive()) this.trapeziOptionIcon('Πριβέ τραπέζι', 'prive.png');
	if (this.trapeziIsIdioktito()) this.trapeziOptionIcon('Ιδιόκτητο τραπέζι',
		this.trapeziThesiPekti(Client.session.pektis) === 1 ? 'elefthero.png' : 'idioktito.png');
	return this;
};

Trapezi.prototype.trapeziOptionIcon = function(desc, img) {
	this.optsDOM.append($('<img>').addClass('trapeziOption').attr({
		title: desc,
		src: '../ikona/panel/' + img,
	}));
	return this;
};
