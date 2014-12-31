// ΣΑΠ -- Σελίδα Αναψηλάφησης Παρτίδας
// -----------------------------------
// Η παρούσα σελίδα επιτρέπει την αναψηλάφηση παρτίδων, δηλαδή το replay
// των διανομών της παρτίδας, είτε σε πραγματικό χρόνο, είτε βήμα βήμα.

$(document).ready(function() {
	Client.
	tabPektis().
	tabKlisimo();

	Movie.
	setup().
	setupPanel();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Movie = {
	// Η ΣΑΠ κάνει αναψηλάφηση της «τρέχουσας» παρτίδας. Η τρέχουσα
	// παρτίδα κρατείται στο property "trapezi" και τίθεται είτε από
	// το URL, είτε στην τρέχουσα παρτίδα του τρέχοντος παίκτη, εφόσον
	// έχουμε επώνυμη χρήση.

	trapezi: {},

	// Η property "dianomiKodikos" περιέχει τον κωδικό της τρέχουσας
	// διανομής.

	dianomiKodikos: null,

	// Η property "dianomiIndex" περιέχει το index της τρέχουσας διανομής
	// στο array διανομών της παρτίδας.

	dianomiIndex: -1,

	dianomiZebra: 0,
};

Movie.setup = function() {
	Movie.dianomesDOM = $('#dianomes');
	Movie.panelDOM = $('#panel');
	Movie.tsoxaDOM = $('#tsoxa');

	try {
		// Αρχικά επιχειρούμε να πάρουμε τα στοιχεία της τρέχουσας
		// παρτίδας από τη ΣΕΑΠ, προκειμένου να μην απασχολούμε τον
		// server.

		Movie.arxioData();
	} catch (e) {
		// Αν δεν ήταν επιτυχής η προσάρτηση των στοιχείων παρτίδας από
		// την ΣΕΑΠ, προχωρούμε στην αναζήτηση των στοιχεών παρτίδας από
		// τον server.

		Movie.zitaData();
	}

	return Movie;
};

Movie.arxioData = function() {
	Movie.trapezi = self.opener.Arxio.movie.trapezi;
	Movie.displayTrapezi();
	return Movie;
};

// Η function "zitaData" αποστέλλει query αναζήτησης παρτίδων στον server και διαχειρίζεται
// την απάντηση, η οποία περιέχει τα στοιχεία των επιλεγμένων παρτίδων.

Movie.zitaData = function() {
	if (!Movie.trapezi.kodikos)
	return Movie;

	Client.fyi.pano('Αναζήτηση διανομών. Παρακαλώ περιμένετε…');
	Client.ajaxService('arxio/epilogi.php', 'partida=' + Movie.trapezi.kodikos).
	done(function(rsp) {
		Client.fyi.pano();
		Movie.paralaviData(rsp);
		Movie.displayTrapezi();
	}).
	fail(function(err) {
		Client.ajaxFail('Παρουσιάστηκε σφάλμα κατά την αναζήτηση παρτίδων');
	});

	return Movie;
};

Movie.displayTrapezi = function() {
	var i, dianomi;

	Movie.trapezi.movieDisplayDianomes();
	Movie.dianomiTrexousaSet();

	return Movie;
};

Movie.dianomiTrexousaSet = function() {
	var i, dianomi;

	Movie.dianomiIndex = -1;

	if (!Movie.dianomiKodikos)
	return Movie;

	for (i = 0; i < Movie.trapezi.dianomiArray.length; i++) {
		dianomi = Movie.trapezi.dianomiArray[i];
		if (dianomi.dianomiKodikosGet() === Movie.dianomiKodikos) {
			Movie.dianomiIndex = i;
			break;
		}
	}

	Movie.trapezi.movieDisplayDianomi(dianomi);
	return Movie;
};

Movie.checkOpen = function() {
	return self;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Movie.setupPanel = function() {
	Movie.panel.bpanelRefresh();
	Movie.panelDOM.empty().
	append(Movie.panel.bpanelVertical().bpanelGetDOM());

	return Movie;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "paralaviData" καλείται κατά την επιστροφή των αποτελεσμάτων,
// και σκοπό έχει τη διαχείριση των αποτελεσμάτων αυτών.

Movie.paralaviData = function(data) {
	var trapezi;

	try {
		trapezi = data.evalAsfales();
	} catch (e) {
		console.error(data);
		Client.fyi.epano('Επεστράφησαν ακαθόριστα δεδομένα');
		return Movie;
	}

	Movie.trapezi = Movie.trapeziProcess(trapezi);
	return Movie;
};

Movie.trapeziProcess = function(trapeziEco) {
	var trapezi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties του σχετικού τραπεζιού
	// έναντι των οικονομικών τοιαύτων.

	trapezi = new Trapezi();
	for (prop in Movie.trapeziEcoMap) {
		trapezi[Movie.trapeziEcoMap[prop]] = trapeziEco[prop];
	}

	Globals.awalk(trapezi.dianomiArray, function(i, dianomi) {
		dianomi = Movie.dianomiProcess(dianomi);
		trapezi.dianomiArray[i] = dianomi;
		trapezi.trapeziDianomiSet(dianomi);
	});

	ts = parseInt(trapezi.stisimo);
	if (ts) trapezi.stisimo = ts + Client.timeDif;

	ts = parseInt(trapezi.arxio);
	if (ts) trapezi.arxio = ts + Client.timeDif;

	return trapezi;
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties του τραπεζιού είναι συντομογραφικά.
// Η λίστα "trapeziEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τού τραπεζιού στα πραγαμτικά τους ονόματα.

Movie.trapeziEcoMap = {
	k: 'kodikos',
	s: 'stisimo',
	p1: 'pektis1',
	p2: 'pektis2',
	p3: 'pektis3',
	a: 'arxio',
	t: 'trparam',
	d: 'dianomiArray',
};

// Η function "energiaProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας ενεργειών που επεστράφησαν από τον server.

Movie.energiaProcess = function(energiaEco) {
	var energia, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής ενέργειας
	// έναντι των οικονομικών τοιαύτων.

	energia = new Energia();
	for (prop in Movie.energiaEcoMap) {
		energia[Movie.energiaEcoMap[prop]] = energiaEco[prop];
	}

	ts = parseInt(energia.pote);
	if (ts) energia.pote = ts + Client.timeDif;

	return energia;
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties της ενέργειας είναι συντομογραφικά.
// Η λίστα "energiaEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τής ενέργειας στα πραγαμτικά τους ονόματα.

Movie.energiaEcoMap = {
	k: 'kodikos',
	p: 'pektis',
	t: 'pote',
	i: 'idos',
	d: 'data',
};

// Η function "dianomiProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας διανομών που επεστράφησαν από τον server.

Movie.dianomiProcess = function(dianomiEco) {
	var dianomi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής διανομής
	// έναντι των οικονομικών τοιαύτων.

	dianomi = {};
	for (prop in Movie.dianomiEcoMap) {
		dianomi[Movie.dianomiEcoMap[prop]] = dianomiEco[prop];
	}

	ts = parseInt(dianomi.enarxi);
	if (ts) dianomi.enarxi = ts + Client.timeDif;

	return new Dianomi(dianomi).
		processEnergiaList(dianomiEco['e']);
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties της διανομής είναι συντομογραφικά.
// Η λίστα "dianomiEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τής διανομής στα πραγαμτικά τους ονόματα.

Movie.dianomiEcoMap = {
	k: 'kodikos',
	d: 'dealer',
	s: 'enarxi',
	k1: 'kasa1',
	m1: 'metrita1',
	k2: 'kasa2',
	m2: 'metrita2',
	k3: 'kasa3',
	m3: 'metrita3',
};

Dianomi.prototype.processEnergiaList = function(elist) {
	var dianomi = this;

	Globals.awalk(elist, function(i, energiaEco) {
		var energia;

		energia = Movie.energiaProcess(energiaEco);
		dianomi.dianomiEnergiaSet(energia);
		dianomi.energiaArray[i] = energia;
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.movieDisplayDianomes = function() {
	Movie.dianomesDOM.empty();
	this.trapeziDianomiWalk(function() {
		this.movieDisplayDianomi();
	});

	return this;
};

Trapezi.prototype.movieDisplayDianomi = function(dianomi) {
	dianomi.movieDianomiTrexousa();
	return this;
};

Dianomi.prototype.movieDisplayDianomi = function() {
	var kodikos, agoraDOM;

	kodikos = this.dianomiKodikosGet();
	Movie.trapezi.partidaReplay(kodikos);
	agoraDOM = Movie.trapezi.movieAgoraDisplay();

	this.DOM = $('<div>').addClass('dianomi dianomi' + (Movie.dianomiZebra++ % 2)).
	data('kodikos', kodikos).
	on('click', function(e) {
		var kodikos;

		Movie.dianomiKodikos = $(this).data('kodikos');
		Movie.dianomiTrexousaSet();
	}).
	append(agoraDOM).
	append($('<div>').addClass('dianomiKodikos').text(kodikos));

	Movie.dianomesDOM.
	append(this.DOM);

	return this;
};

Dianomi.prototype.movieDianomiTrexousa = function() {
	$('.dianomiTrexousa').removeClass('dianomiTrexousa');
	this.DOM.addClass('dianomiTrexousa');
	return this;
};

Trapezi.prototype.movieAgoraDisplay = function() {
	var agora, dom;

	dom = $('<div>').addClass('agora');

	agora = this.partidaAgoraGet();
	if (!agora)
	return dom.addClass('agoraPaso').html('&mdash;');

	dom = $('<div>').addClass('agora').
	attr('title', 'Αγορά: ' + agora.dilosiLektiko());
	dom.append($('<div>').addClass('agoraBazes').text(agora.dilosiBazesGet()));
	dom.append($('<img>').addClass('agoraXroma').
	attr('src', '../ikona/trapoula/xroma' + agora.dilosiXromaGet() + '.png'));

	if (agora.dilosiIsAsoi())
	dom.
	append($('<div>').addClass('tsoxaDilosiAsoi').
	append($('<img>').addClass('tsoxaDilosiAsoiIcon').
	attr('src', '../ikona/panel/asoiOn.png')));

	return dom;
};
