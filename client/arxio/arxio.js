Arxio = {
	limit: 30,
	skip: 0,
};

$(document).ready(function() {
	Client.tabPektis();
	Client.tabKlisimo($('#toolbarRight'));
	Arxio.setup();

	// Κατά την ανάπτυξη του προγράμματος βολεύει καλύτερα
	// να έχουμε αυτόματα κάποιο select set.

	if (Debug.flagGet('development')) {
		$('input').val('');
		Arxio.goButtonDOM.trigger('click');
	}

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
	h = Client.ofelimoDOM.innerHeight();
	h -= Arxio.kritiriaDOM.outerHeight(true) + 20;
	Arxio.apotelesmataDOM.css('height', h + 'px');

	$(document).
	on('keyup', function(e) {
		switch (e.which) {
		case 27:
			Arxio.resetButtonDOM.trigger('click');
			break;
		}
	}).
	on('mouseenter', '.trapezi', function(e) {
		$(this).find('.arxioKapikia').addClass('arxioKapikiaTrexon');
	}).
	on('mouseleave', '.trapezi', function(e) {
		$('.arxioKapikia').removeClass('arxioKapikiaTrexon');
	});
};

Arxio.kritiriaSetup = function() {
	var imerominia, mera, minas, etos;

	Arxio.kritiriaDOM.
	append($('<form>').
	append($('<div>').addClass('formaPrompt').text('Παίκτης')).
	append(Arxio.pektisInputDOM = $('<input>').addClass('formaPedio').css('width', '140px')).
	append($('<div>').addClass('formaPrompt').text('Από')).
	append(Arxio.apoInputDOM = Client.inputDate()).
	append($('<div>').addClass('formaPrompt').text('Έως')).
	append(Arxio.eosInputDOM = Client.inputDate()).
	append($('<div>').addClass('formaPrompt').text('Παρτίδα')).
	append(Arxio.partidaInputDOM = $('<input>').addClass('formaPedio').css('width', '70px').
	on('keyup', function(e) {
		switch (e.which) {
		case 13:
			break;
		default:
			$(this).removeClass('inputLathos');
			break;
		}
	})).
	append(Arxio.goButtonDOM = $('<button>').attr('type', 'submit').addClass('formaButton').text('Go!!!')).
	append(Arxio.resetButtonDOM = $('<button>').attr('type', 'reset').addClass('formaButton').text('Reset')).
	append(Arxio.moreButtonDOM = $('<button>').addClass('formaButton').text('Περισσότερα…')));

	Arxio.goButtonDOM.on('click', function(e) {
		Arxio.apotelesmataDOM.empty();
		Arxio.skipReset();
		Arxio.zitaData();
		return false;
	});

	Arxio.resetButtonDOM.on('click', function(e) {
		Arxio.kritiriaReset();
		return false;
	});

	Arxio.moreButtonDOM.on('click', function(e) {
		Arxio.skip += Arxio.limit;
		Arxio.zitaData();
		return false;
	});

	Arxio.kritiriaReset();
};

Arxio.zitaData = function() {
	if (!Arxio.processKritiria())
	return;

	Client.fyi.pano('Παρακαλώ περιμένετε…');
	Client.ajaxService('arxio/epilogi.php', 'pektis=' + Arxio.pektisInputDOM.val().uri(),
		'apo=' + Arxio.apoInputDOM.data('timestamp'), 'eos=' + Arxio.eosInputDOM.data('timestamp'),
		'partida=' + Arxio.partidaInputDOM.val().uri(), 'limit=' + Arxio.limit,
		'skip=' + Arxio.skip).
	done(function(rsp) {
		Client.fyi.pano();
		Arxio.paralavi(rsp);
	}).
	fail(function(err) {
		Client.ajaxFail(err);
	});
};

Arxio.kritiriaReset = function() {
	var imerominia, mera, minas, etos;

	if (Client.isPektis())
	Arxio.pektisInputDOM.val(Client.session.pektis);

	imerominia = new Date();
	mera = imerominia.getDate();
	minas = imerominia.getMonth() + 1;
	etos = imerominia.getFullYear();
	Arxio.eosInputDOM.val(mera + '-' + minas + '-' + etos);

	imerominia = new Date(imerominia.getTime() - (7 * 24 * 3600 * 1000));
	mera = imerominia.getDate();
	minas = imerominia.getMonth() + 1;
	etos = imerominia.getFullYear();
	Arxio.apoInputDOM.val(mera + '-' + minas + '-' + etos);

	Arxio.partidaInputDOM.val('');

	Arxio.apotelesmataDOM.empty();
	Arxio.pektisInputDOM.focus();

	Arxio.skipReset();
	return Arxio;
};

Arxio.skipReset = function() {
	Arxio.skip = 0;
	Arxio.moreButtonDOM.prop('disabled', true);
	return Arxio;
};

// Η function "paralavi" καλείται κατά την επιστροφή των αποτελεσμάτων,
// και σκοπό έχει τη διαχείριση των αποτελεσμάτων αυτών.

Arxio.paralavi = function(data) {
	var tlist;

	try {
		tlist = ('[' + data + ']').evalAsfales();
	} catch (e) {
		console.error(data);
		Client.fyi.epano('Επεστράφησαν ακαθόριστα δεδομένα');
		Client.sound.beep();
		return;
	}

	Arxio.moreButtonDOM.prop('disabled', tlist.length < Arxio.limit);
	Globals.awalk(tlist, Arxio.trapeziProcess);
};

// Η function "trapeziProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας τραπεζιών που επεστράφησαν από τον server.

Arxio.trapeziProcess = function(i, trapeziEco) {
	var trapezi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties του σχετικού τραπεζιού
	// έναντι των οικονομικών τοιαύτων.

	trapezi = {};
	for (prop in Arxio.trapeziEcoMap) {
		trapezi[Arxio.trapeziEcoMap[prop]] = trapeziEco[prop];
	}

	ts = parseInt(trapezi.stisimo);
	if (ts) trapezi.stisimo = ts + Client.timeDif;

	ts = parseInt(trapezi.arxio);
	if (ts) trapezi.arxio = ts + Client.timeDif;

	// Δημιουργούμε το τραπέζι ως αντικείμενο και προβαίνουμε στην
	// επεξεργασία και στην παρουσίαση αυτού του τραπεζιού.

	new Trapezi(trapezi).
	trapeziArxioKapikia().
	trapeziArxioDisplay();
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties του τραπεζιού είναι συντομογραφικά.
// Η λίστα "trapeziEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τού τραπεζιού στα πραγαμτικά τους ονόματα.

Arxio.trapeziEcoMap = {
	k: 'kodikos',
	s: 'stisimo',
	p1: 'pektis1',
	p2: 'pektis2',
	p3: 'pektis3',
	a: 'arxio',
	t: 'trparam',
	d: 'dianomi',
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arxio.processKritiria = function() {
	if (!Arxio.pektisCheck())
	return false;

	if (!Arxio.imerominiaCheck(Arxio.apoInputDOM))
	return false;

	if (!Arxio.imerominiaCheck(Arxio.eosInputDOM))
	return false;

	if (!Arxio.partidaCheck())
	return false;

	return true;
};

Arxio.pektisCheck = function() {
	var pektis;

	pektis = Arxio.pektisInputDOM.val();
	pektis = pektis ? pektis.trim() : '';
	Arxio.pektisInputDOM.val(pektis);

	return true;
};

Arxio.imerominiaCheck = function(input) {
	var val, dmy;

	input.data('timestamp', 0);

	val = input.val();
	val = val ? val.trim() : '';
	input.val(val);
	if (val === '')
	return true;

	dmy = val.split(/[^0-9]/);
	if (dmy.length !== 3) {
		Client.sound.beep();
		Client.fyi.epano('Λανθασμένη ημερομηνία αρχής');
		input.addClass('inputLathos').focus();
		return false;
	}

	input.data('timestamp', parseInt(new Date(dmy[2], dmy[1] - 1, dmy[0]).getTime() / 1000));
	return true;
};

Arxio.partidaCheck = function() {
	var partida;

	partida = Arxio.partidaInputDOM.val();
	partida = partida ? partida.trim() : '';
	Arxio.partidaInputDOM.val(partida);
	if (partida === '')
	return true;

	if (partida.match(/^[0-9]+$/))
	return true;

	if (partida.match(/^([0-9]+)-([0-9]+)$/))
	return true;

	if (partida.match(/^[<>]([0-9]+)$/))
	return true;

	if (partida.match(/^-([0-9]+)$/))
	return true;

	if (partida.match(/^([0-9]+)-$/))
	return true;

	Client.sound.beep();
	Client.fyi.epano('Λανθασμένο κριτήριο κωδικού παρτίδας');
	Arxio.partidaInputDOM.addClass('inputLathos').focus();
	return false;
};

Arxio.aplomaDianomi = function(trapezi) {
	console.log(trapezi.data('trapezi'));
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
	else Arxio.apotelesmataDOM.append(this.DOM = $('<div>').addClass('trapezi'));

	kodikos = this.trapeziKodikosGet();

	this.DOM.
	data('trapezi', kodikos).
	append($('<div>').addClass('trapeziData').
	append($('<div>').addClass('trapeziDataContent').
	append($('<div>').addClass('trapeziDataKodikos').text(kodikos)).
	append($('<div>').addClass('trapeziDataIpolipo').text(this.ipolipo)))).
	on('click', function(e) {
		Arxio.aplomaDianomi($(this));
	});

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
