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

	dianomiIndex: 0,
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

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
		// τη ΣΕΑΠ, προχωρούμε στην αναζήτηση των στοιχεών παρτίδας από
		// τον server.

		Movie.zitaData();
	}

	return Movie;
};

Movie.setupPanel = function() {
	Movie.panel.bpanelRefresh();
	Movie.panelDOM.empty().disableSelection().
	append(Movie.panel.bpanelVertical().bpanelGetDOM());

	return Movie;
};

Movie.checkOpen = function() {
	return self;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "arxioData" επιχειρεί να προσαρτήσει τα στοιχεία της παρτίδας από τη
// ΣΕΑΠ και κατόπιν εμφανίζει την παρτίδα στην παρούσα σελίδα.

Movie.arxioData = function() {
	Movie.trapezi = self.opener.Arxio.movie.trapezi;
	Movie.displayTrapezi();
	return Movie;
};

// Η function "zitaData" αποστέλλει query αναζήτησης των διανομών της τρέχουσας
// παρτίδας στον server και ανασκευάζει την παρτίδα με βάση τα στοιχεία που θα
// παραλάβει.

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "displayTrapezi" παρουσιάζει όλα τα δεδομένα του τραπεζιού στη ΣΑΠ.
// Στο δεξί μέρος της σελίδας υπάρχει διαδραστική λίστα διανομών, ενώ στο αριστερό
// υπάρχει τσόχα στην οποία παρουσιάζονται τα τεκταινόμενα στην παρτίδα.

Movie.displayTrapezi = function() {
	Movie.dianomesDOM.empty();
//for (var i = 0; i < 3; i++)
	Movie.trapezi.trapeziDianomiWalk(function() {
		this.movieDisplayDianomi();
	});
	$('.dianomi:odd').addClass('dianomiOdd');

	Movie.entopismosTrexousasDianomis();
	Movie.displayDianomi();

	return Movie;
};

Movie.entopismosTrexousasDianomis = function() {
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

	return Movie;
};

Movie.displayDianomi = function() {
	var dianomi;

	Movie.tsoxaDOM.empty();
	$('.dianomiTrexousa').removeClass('dianomiTrexousa');

	Movie.trapezi.movieDisplayTrapeziData();

	if (Movie.dianomiIndex < 0)
	return Movie;

	dianomi = Movie.trapezi.dianomiArray[Movie.dianomiIndex];
	dianomi.DOM.addClass('dianomiTrexousa');

	Movie.trapezi.partidaReplay({eosxoris: dianomi.dianomiKodikosGet()});

	return Movie;
};

Trapezi.prototype.movieDisplayTrapeziData = function() {
	var dataDOM, optsDOM, dianomi;

	dataDOM = $('<div>').attr('id', 'trapeziData');
	dataDOM.append($('<div>').attr({
		id: 'dataTrapeziKodikos',
		title: 'Κωδικός τραπεζιού',
	}).text(this.trapeziKodikosGet()));
	if (Movie.dianomiIndex >= 0) {
		dianomi = this.dianomiArray[Movie.dianomiIndex];
		dataDOM.append($('<div>').attr({
			id: 'dataDianomiKodikos',
			title: 'Κωδικός διανομής',
		}).text(dianomi.dianomiKodikosGet()));
	}

	optsDOM = $('<div>').attr('id', 'options');

	if (Movie.trapezi.trapeziOxiAsoi())
	Movie.optionDOM(optsDOM, 'asoiOn.png', 'Δεν παίζονται οι άσοι');

	if (Movie.trapezi.trapeziIsPaso())
	Movie.optionDOM(optsDOM, 'pasoOn.png', 'Παίζεται το πάσο');

	Movie.tsoxaDOM.
	append(dataDOM).
	append(optsDOM);

	Movie.pektisDOM = {};
	this.trapeziThesiWalk(function(thesi) {
		var dom;

		dom = $('<div>').addClass('pektis').attr('id', 'pektis' + thesi);
		dom.append($('<div>').addClass('pektisLogin tsoxaPektisOnoma').attr('id', 'pektisLogin' + thesi).
		text(this.trapeziPektisGet(thesi)));
		Movie.tsoxaDOM.append(dom);
		Movie.pektisDOM[thesi] = dom;
	});

	return this;
};

Movie.optionDOM = function(dom, icon, desc) {
	dom.append($('<img>').addClass('option').attr({
		src: '../ikona/panel/' + icon,
		title: desc,
	}));
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Dianomi.prototype.movieDisplayDianomi = function() {
	var kodikos, agoraDOM;

	kodikos = this.dianomiKodikosGet();
	Movie.trapezi.partidaReplay({eoske: kodikos});
	agoraDOM = Movie.trapezi.movieAgoraDisplay();

	this.DOM = $('<div>').addClass('dianomi').
	data('kodikos', kodikos).
	on('click', function(e) {
		var kodikos;

		Movie.dianomiKodikos = $(this).data('kodikos');
		Movie.entopismosTrexousasDianomis();
		Movie.displayDianomi();
	}).
	append(agoraDOM).
	append($('<div>').addClass('dianomiKodikos').text(kodikos));

	Movie.dianomesDOM.
	append(this.DOM);

	return this;
};

Trapezi.prototype.movieAgoraDisplay = function() {
	var agora, dom;

	dom = $('<div>').addClass('agora');

	agora = this.partidaAgoraGet();
	if (!agora)
	return dom.addClass('agoraBazes').html('&ndash;');

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
