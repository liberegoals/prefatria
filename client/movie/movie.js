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

// Η function "setup" ανιχνεύει τις βασικές περιοχές της ΣΑΠ. Πρόκειται για την
// τσόχα στην οποία εξελίσσεται η παρτίδα (αριστερά), το control panel (κέντρο)
// και τη λίστα διανομών της παρτίδας (δεξιά), παραλαμβάνει τα δεδομένα παρτίδας
// από τη σελίδα επισκόπησης αρχειοθετημένων παρτίδων (ΣΕΑΠ), ή απευθείας από την
// database, και παρουσιάζει την παρτίδα όπως έχει στην αρχή της τρέχουσας διανομής.

Movie.setup = function() {
	Movie.tsoxaDOM = $('#tsoxa');
	Movie.dianomesDOM = $('#dianomes');
	Movie.panelDOM = $('#panel');

	try {
		// Αρχικά επιχειρούμε να προσαρτήσουμε τα στοιχεία της παρτίδας
		// από τη ΣΕΑΠ, προκειμένου να μην απασχολούμε τον server.

		Movie.arxioData();
	} catch (e) {
		// Αν δεν ήταν επιτυχής η προσάρτηση των στοιχείων παρτίδας από
		// τη ΣΕΑΠ, προχωρούμε στην αναζήτηση των στοιχεών παρτίδας από
		// τον server.

		Movie.zitaData();
	}

	return Movie;
};

// Η function "setupPanel" «στήνει» το control panel της ΣΑΠ, δηλαδή την κεντρική
// στήλη εργαλείων. Πρόκειται για πλήκτρα με τα οποία ο χρήστης μπορεί να αλλάξει
// διανομή, να «περπατήσει» βήμα βήμα την τρέχουσα διανομή είτε προς τα εμπρός,
// είτε προς τα πίσω.

Movie.setupPanel = function() {
	Movie.panel.bpanelRefresh();
	Movie.panelDOM.empty().disableSelection().
	append(Movie.panel.bpanelVertical().bpanelGetDOM());

	return Movie;
};

// Η function "checkOpen" χρησιμοποιείται από άλλες σελίδες προκειμένου να ελεγχθεί
// εάν η ΣΑΠ είναι ανοικτή επιστρέφοντας pointer στο window object της ΣΑΠ.

Movie.checkOpen = function() {
	return self;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "arxioData" επιχειρεί να προσαρτήσει τα στοιχεία της παρτίδας από τη
// ΣΕΑΠ και κατόπιν εμφανίζει την παρτίδα στην παρούσα σελίδα. Αν η ΣΑΠ δεν εκκίνησε
// μέσω της ΣΕΑΠ, τότε τα δεδομένα θα ζητηθούν από τον server μέσω της "zitaData" που
// ακολουθεί.

Movie.arxioData = function() {
	Movie.trapezi = self.opener.Arxio.movie.trapezi;
	Movie.displayTrapezi();
	return Movie;
};

// Η function "zitaData" αποστέλλει query αναζήτησης των διανομών της τρέχουσας
// παρτίδας στον server και ανασκευάζει την παρτίδα με βάση τα στοιχεία που θα
// παραλάβει.

Movie.zitaData = function() {
console.log('ZITA');
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
		Movie.dianomiListaAdd(this);
	});
	$('.dianomi:odd').addClass('dianomiOdd');

	Movie.
	entopismosTrexousasDianomis().
	displayDianomi();

	return Movie;
};

// Η function "entopismosTrexousasDianomis" επιχειρεί να εντοπίσει την τρέχουσα
// διανομή στο array διανομών της παρτίδας. Ως τρέχουσα διανομή θεωρείται αυτή
// της οποίας ο κωδικός δίνεται στην property "dianomiKodikos". Εάν η τρέχουσα
// διανομή δεν εντοπιστεί, το index της τρέχουσας διανομής τίθεται -1, αλλιώς
// τίθεταο στο index της επίμαχης διανομής στο array διανομών της παρτίδας.

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

// Η function "displayDianomi" παρουσιάζει την κατάσταση στην παρτίδα όπως έχει
// στην αρχή της τρέχουσας διανομής, δηλαδή μετά το μοίρασμα των φύλλων.

Movie.displayDianomi = function() {
	var dianomi;

	Movie.tsoxaDOM.empty();
	$('.dianomiTrexousa').removeClass('dianomiTrexousa');

	Movie.displayTrapeziData();

	if (Movie.dianomiIndex < 0)
	return Movie;

	dianomi = Movie.trapezi.dianomiArray[Movie.dianomiIndex];
	dianomi.movieDOM.addClass('dianomiTrexousa');

	Movie.trapezi.partidaReplay({eosxoris: dianomi.dianomiKodikosGet()});

	return Movie;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Movie.displayTrapeziData = function() {
	var dataDOM, optsDOM, dianomi;

	dataDOM = $('<div>').attr('id', 'trapeziData');
	dataDOM.append($('<div>').attr({
		id: 'dataTrapeziKodikos',
		title: 'Κωδικός τραπεζιού',
	}).text(Movie.trapezi.trapeziKodikosGet()));
	if (Movie.dianomiIndex >= 0) {
		dianomi = Movie.trapezi.dianomiArray[Movie.dianomiIndex];
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
	Movie.trapezi.trapeziThesiWalk(function(thesi) {
		var dom;

		dom = $('<div>').addClass('pektis').attr('id', 'pektis' + thesi);
		dom.append($('<div>').addClass('pektisLogin tsoxaPektisOnoma').attr('id', 'pektisLogin' + thesi).
		text(this.trapeziPektisGet(thesi)));
		Movie.tsoxaDOM.append(dom);
		Movie.pektisDOM[thesi] = dom;
	});
};

Movie.optionDOM = function(dom, icon, desc) {
	dom.append($('<img>').addClass('option').attr({
		src: '../ikona/panel/' + icon,
		title: desc,
	}));
};

Movie.agoraDisplay = function() {
	var agora, dom;

	dom = $('<div>').addClass('agora');

	agora = Movie.trapezi.partidaAgoraGet();
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

Movie.dianomiListaAdd = function(dianomi) {
	var kodikos, agoraDOM;

	kodikos = dianomi.dianomiKodikosGet();
	Movie.trapezi.partidaReplay({eoske: kodikos});
	agoraDOM = Movie.agoraDisplay();

	dianomi.movieDOM = $('<div>').addClass('dianomi').
	data('kodikos', kodikos).
	on('click', function(e) {
		Movie.dianomiKodikos = $(this).data('kodikos');
		Movie.
		entopismosTrexousasDianomis().
		displayDianomi();
	}).
	append(agoraDOM).
	append($('<div>').addClass('dianomiKodikos').text(kodikos));

	Movie.dianomesDOM.
	append(dianomi.movieDOM);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "paralaviData" καλείται κατά την επιστροφή των αποτελεσμάτων,
// και σκοπό έχει τη διαχείριση των αποτελεσμάτων αυτών.

Movie.paralaviData = function(data) {
	try {
		Movie.trapeziProcess(data.evalAsfales());
	} catch (e) {
		console.error(data);
		Client.fyi.epano('Επεστράφησαν ακαθόριστα δεδομένα.', 0);
		Client.fyi.ekato('Δοκιμάστε πάλι και αν το πρόβλημα επιμένει ειδοποιήστε τον προγραμματιστή.', 0);
	}

	return Movie;
};

Movie.trapeziProcess = function(trapeziEco) {
	var prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties του σχετικού τραπεζιού
	// έναντι των οικονομικών τοιαύτων.

	Movie.trapezi = new Trapezi();
	for (prop in Movie.trapeziEcoMap) {
		Movie.trapezi[Movie.trapeziEcoMap[prop]] = trapeziEco[prop];
	}

	Globals.awalk(Movie.trapezi.dianomiArray, function(i, dianomi) {
		dianomi = Movie.dianomiProcess(dianomi);
		Movie.trapezi.trapeziDianomiSet(dianomi);
		Movie.trapezi.dianomiArray[i] = dianomi;
	});

	ts = parseInt(Movie.trapezi.stisimo);
	if (ts) Movie.trapezi.stisimo = ts + Client.timeDif;

	ts = parseInt(Movie.trapezi.arxio);
	if (ts) Movie.trapezi.arxio = ts + Client.timeDif;
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

// Η function "dianomiProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας διανομών που επεστράφησαν από τον server.

Movie.dianomiProcess = function(dianomiEco) {
	var dianomi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής διανομής
	// έναντι των οικονομικών τοιαύτων.

	dianomi = new Dianomi();
	for (prop in Movie.dianomiEcoMap) {
		dianomi[Movie.dianomiEcoMap[prop]] = dianomiEco[prop];
	}

	ts = parseInt(dianomi.enarxi);
	if (ts) dianomi.enarxi = ts + Client.timeDif;

	return dianomi.processEnergiaList(dianomiEco['e']);
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
