// ΣΑΠ -- Σελίδα Αναψηλάφησης Παρτίδας
// -----------------------------------
// Η παρούσα σελίδα επιτρέπει την αναψηλάφηση παρτίδων, δηλαδή το replay
// των διανομών της παρτίδας, είτε σε πραγματικό χρόνο, είτε βήμα βήμα.

$(document).ready(function() {
	Client.
	tabPektis().
	tabKlisimo();

	Movie.
	setupFilajs().
	setupTsoxa().
	setupPanel();

	try {
		// Αρχικά επιχειρούμε να προσαρτήσουμε τα στοιχεία της παρτίδας
		// από τη ΣΕΑΠ, προκειμένου να μην απασχολούμε τον server.

		Movie.arxioData();
	} catch (e) {
		// Αν δεν ήταν επιτυχής η προσάρτηση των στοιχείων παρτίδας από
		// τη ΣΕΑΠ, προχωρούμε στην αναζήτηση των στοιχείων παρτίδας από
		// τον server.

		Movie.zitaData();
	}
});

// Το singleton "Movie" χρησιμοποιείται ως namespace για δομές και λειτουργίες
// που αφορούν στην ΣΑΠ.

Movie = {
	// Η ΣΑΠ κάνει αναψηλάφηση της «τρέχουσας» παρτίδας. Η τρέχουσα
	// παρτίδα κρατείται στο property "trapezi" και τίθεται είτε από
	// το URL, είτε στην τρέχουσα παρτίδα του τρέχοντος παίκτη, εφόσον
	// έχουμε επώνυμη χρήση.

	trapezi: {},

	// Η property "dianomiIndex" περιέχει το index της τρέχουσας διανομής
	// στο array διανομών της παρτίδας.

	dianomiIndex: 0,

	// Στην ΣΑΠ υπάρχει η έννοια της τρέχουσας διανομής. Πρόκειται για
	// τη διανομή που εμφανίζεται στη σελίδα την τρέχουσα χρονική στιγμή.

	dianomi: null,

	// Η property "egoThesi" δείχνει τη θέση θέασης και by default είναι
	// η πρώτη θέση του τραπεζιού.

	egoThesi: 1,

	// Ακολουθούν global δομές οι οποίες είναι βολικό να είναι εύκολα
	// προσβάσιμες.

	pektisDOM: {},
	onomaDOM: {},
	filaDOM: {},
	agoraDOM: {},
	kapikiaDOM: {},
	bazesDOM: {},
	dilosiDOM: {},
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "setupFilajs" καθορίζει το μέγεθος και την οικογένεια των παιγνιοχάρτων.
// Το μέγεθος προσαρμόζεται στην τσόχα της ΣΑΠ, ενώ η οικογένεια των παιγνιοχάρτων
// καθορίζεται από το session cookie "trapoula", το οποίο με τη σειρά του έχει ήδη
// καθοριστεί από τυχόν παράμετρο χρήστη "ΤΡΑΠΟΥΛΑ".

Movie.setupFilajs = function() {
	var family;

	switch (family = Client.session.trapoula) {
	case 'jfitz':
	case 'classic':
	case 'aguilar':
	case 'nicubunu':
	case 'ilias':
		break;
	default:
		family = 'jfitz';
	}

	filajs.
	cardWidthSet(84).
	shiftxSet(0.28).
	cardFamilySet(family);

	return Movie;
};

// Η function "setupTsoxa" ανιχνεύει τις βασικές περιοχές της ΣΑΠ. Πρόκειται για την
// τσόχα στην οποία εξελίσσεται η παρτίδα (αριστερά), το control panel (κέντρο)
// και τη λίστα διανομών της παρτίδας (δεξιά), παραλαμβάνει τα δεδομένα παρτίδας
// από τη σελίδα επισκόπησης αρχειοθετημένων παρτίδων (ΣΕΑΠ), ή απευθείας από την
// database, και παρουσιάζει την παρτίδα όπως έχει στην αρχή της τρέχουσας διανομής.

Movie.setupTsoxa = function() {
	Movie.tsoxaDOM = $('#tsoxa');
	Movie.
	setupData().
	setupOptions().
	setupThesi();

	Movie.dianomesDOM = $('#dianomes');
	Movie.panelDOM = $('#panel');

	return Movie;
};

Movie.setupData = function() {
	var dom;

	dom = $('<div>').attr('id', 'data').
	append(Movie.trapeziKodikosDOM = $('<div>').attr('id', 'trapeziKodikos').addClass('dataItem')).
	append(Movie.dianomiKodikosDOM = $('<div>').attr('id', 'dianomiKodikos').addClass('dataItem')).
	append(Movie.energiaKodikosDOM = $('<div>').attr('id', 'energiaKodikos').addClass('dataItem')).
	append(Movie.kasaDOM = $('<div>').attr('id', 'kasa').addClass('dataItem')).
	append(Movie.ipolipoDOM = $('<div>').attr('id', 'ipolipo').addClass('dataItem')).
	appendTo(Movie.tsoxaDOM);

	return Movie;
};

Movie.setupOptions = function() {
	Movie.optionsDOM = $('<div>').
	attr('id', 'options').
	appendTo(Movie.tsoxaDOM);

	return Movie;
};

Movie.setupThesi = function(thesi) {
	var dom;

	if (thesi === undefined)
	return Movie.thesiWalk(Movie.setupThesi);

	dom = $('<div>').
	attr('id', 'pektis' + thesi).
	addClass('pektis');

	dom.
	append(Movie.onomaDOM[thesi] = $('<div>').
	attr('id', 'pektisLogin' + thesi).
	addClass('pektisLogin tsoxaPektisOnoma'));

	dom.
	append(Movie.filaDOM[thesi] = $('<div>').
	attr('id', 'fila' + thesi).
	addClass('fila'));

	dom.
	append(Movie.agoraDOM[thesi] = $('<div>').
	attr('id', 'agora' + thesi).
	addClass('agora'));

	dom.
	append(Movie.kapikiaDOM[thesi] = $('<div>').
	attr('id', 'kapikia' + thesi).
	addClass('kapikia'));

	dom.
	append(Movie.bazesDOM[thesi] = $('<div>').
	attr('id', 'bazes' + thesi).
	addClass('bazes'));

	dom.
	append(Movie.dilosiDOM[thesi] = $('<div>').
	attr('id', 'dilosi' + thesi).
	addClass('dilosi'));

	dom.disableSelection();

	if (thesi !== 1)
	dom.
	on('click', function(e) {
		Movie.egoThesi = $(this).data('thesi');
		Movie.
		displayPektis().
		displayDealer().
		displayEpomenos().
		displayFila().
		displayGipedo();
	});

	Movie.pektisDOM[thesi] = dom.appendTo(Movie.tsoxaDOM);

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
	Movie.trapeziKodikosDOM.
	text(Movie.trapezi.trapeziKodikosGet());

	Movie.kasaDOM.
	text(Movie.trapezi.trapeziKasaGet() * 30);

	Movie.displayOptions();

	Movie.dianomesDOM.empty();
	Movie.trapezi.trapeziDianomiWalk(function() {
		Movie.dianomiListaAdd(this);
	});
	$('.dianomi:odd').addClass('dianomiOdd');

	Movie.
	displayPektis().
	entopismosDianomis().
	displayDianomi();

	return Movie;
};

Movie.displayOptions = function() {
	Movie.optionsDOM.empty();

	if (Movie.trapezi.trapeziOxiAsoi())
	Movie.displayOption('asoiOn.png', 'Δεν παίζονται οι άσοι');

	if (Movie.trapezi.trapeziIsPaso())
	Movie.displayOption('pasoOn.png', 'Παίζεται το πάσο');

	if (Movie.trapezi.trapeziTeliomaAnisoropo())
	Movie.displayOption('postel/anisoropo.png', 'Ανισόρροπη πληρωμή τελευταίας αγοράς');

	else if (Movie.trapezi.trapeziTeliomaDikeo())
	Movie.displayOption('postel/dikeo.png', 'Δίκαιη πληρωμή τελευταίας αγοράς');

	if (Movie.trapezi.trapeziIsFiliki())
	Movie.displayOption('filiki.png', 'Εκπαιδευτική/Φιλική παρτίδα');

	if (Movie.trapezi.trapeziIsKlisto())
	Movie.displayOption('klisto.png', 'Κλειστό τραπέζι');

	if (Movie.trapezi.trapeziIsPrive())
	Movie.displayOption('prive.png', 'Πριβέ τραπέζι');

	if (Movie.trapezi.trapeziIsIdioktito())
	Movie.displayOption(Movie.trapezi.trapeziThesiPekti(Movie.egoThesi) === 1 ?
		'elefthero.png' : 'idioktito.png', 'Ιδιόκτητο τραπέζι');
};

Movie.displayOption = function(icon, desc) {
	Movie.optionsDOM.
	append($('<img>').addClass('option').attr({
		src: '../ikona/panel/' + icon,
		title: desc,
	}));
};

Movie.displayPektis = function(thesi) {
	var iseht;

	if (thesi === undefined)
	return Movie.thesiWalk(function(thesi) {
		Movie.displayPektis(thesi);
	});

	iseht = Movie.thesiMap(thesi);
	Movie.pektisDOM[iseht].
	data('thesi', thesi);

	Movie.onomaDOM[iseht].
	text(Movie.trapezi.trapeziPektisGet(thesi));

	return Movie;
};

Movie.displayGipedo = function() {
	return Movie;
};

// Η function "entopismosDianomis" επιχειρεί να εντοπίσει τον δείκτη της
// διανομής τής οποίας ο κωδικός δίνεται ως παράμετρος, στο array διανομών
// της παρτίδας.

Movie.entopismosDianomis = function(kodikos) {
	var dcount, i, dianomi;

	Movie.dianomiIndex = -1;
	Movie.dianomi = null;

	// Αν δεν έχει καθοριστεί κωδικός διανομής, τότε υποτίθεται η διανομή
	// που καθορίστηκε στο URL.

	if (!kodikos)
	kodikos = Movie.dianomiURL;

	// Όπως και να έχει, καθαρίζουμε τον κωδικό διανομής που ενδεχομένως
	// καθορίστηκε στο URL.

	Movie.dianomiURL = null;

	dcount = Movie.trapezi.dianomiArray.length;
	if (!dcount)
	return Movie;

	if (!kodikos) {
		Movie.dianomiIndex = 0;
		return Movie;
	}

	for (i = 0; i < Movie.trapezi.dianomiArray.length; i++) {
		dianomi = Movie.trapezi.dianomiArray[i];
		if (dianomi.dianomiKodikosGet() === kodikos) {
			Movie.dianomiIndex = i;
			break;
		}
	}

	return Movie;
};

// Η function "displayDianomi" παρουσιάζει την κατάσταση στην παρτίδα όπως έχει
// στην αρχή της τρέχουσας διανομής, δηλαδή μετά το μοίρασμα των φύλλων.

Movie.displayDianomi = function() {
	var ipolipo, i, kodikos;

	$('.dianomiTrexousa').removeClass('dianomiTrexousa');
	$('.fila').empty();
	$('.moviePektisEndixi').remove();
	if (Movie.dianomiKodikosDOM) Movie.dianomiKodikosDOM.text('');
	if (Movie.ipolipoDOM) Movie.ipolipoDOM.text('');

	Movie.dianomi = null;
	if (Movie.dianomiIndex < 0)
	return Movie;

	ipolipo = Movie.trapezi.trapeziKasaGet() * 30;
	for (i = 0; i < Movie.dianomiIndex; i++) {
		Movie.dianomi = Movie.trapezi.dianomiArray[i];
		ipolipo -= Movie.dianomi.dianomiKasaGet(1);
		ipolipo -= Movie.dianomi.dianomiKasaGet(2);
		ipolipo -= Movie.dianomi.dianomiKasaGet(3);
	}

	Movie.dianomi = Movie.trapezi.dianomiArray[Movie.dianomiIndex];
	Movie.dianomi.movieDOM.addClass('dianomiTrexousa');

	kodikos = Movie.dianomi.dianomiKodikosGet();
	Movie.dianomiKodikosDOM.text(kodikos);

	Movie.ipolipoDOM.text(ipolipo);
	Movie.trapezi.partidaReplay({eosxoris:kodikos});

	Movie.
	displayFilaDianomis().
	displayDealer().
	displayEpomenos();

	return Movie;
};

Movie.displayDealer = function() {
	var dealer, iseht;

	$('.moviePektisDealer').remove();
	if (!Movie.dianomi)
	return Movie;

	dealer = Movie.dianomi.dianomiDealerGet();
	iseht = Movie.thesiMap(dealer);

	Movie.pektisDOM[iseht].
	append($('<img>').addClass('moviePektisEndixi moviePektisEndixi' + iseht + ' moviePektisDealer').attr({
		src: '../ikona/endixi/dealer.png',
		title: 'Dealer',
	}));

	iseht = iseht.epomeniThesi();

	Movie.pektisDOM[iseht].
	append($('<img>').addClass('moviePektisEndixi moviePektisEndixi' + iseht + ' moviePektisDealer').attr({
		src: '../ikona/endixi/protos.png',
		title: 'Πρώτος',
	}));

	return Movie;
};

Movie.displayEpomenos = function() {
	var epomenos, iseht;

	$('.tsoxaPektisEpomenos').removeClass('tsoxaPektisEpomenos');
	if (!Movie.dianomi)
	return Movie;

	epomenos = Movie.trapezi.partidaEpomenosGet();
	iseht = Movie.thesiMap(epomenos);

	Movie.pektisDOM[iseht].addClass('tsoxaPektisEpomenos');

	return Movie;
};

Movie.displayFilaDianomis = function() {
	var elist, energia;

	elist = Movie.dianomi.energiaArray;
	for (Movie.energiaIndex = 0; Movie.energiaIndex < elist.length; Movie.energiaIndex++) {
		energia = elist[Movie.energiaIndex];
		Movie.trapezi.trapeziProcessEnergia(energia);
		if (energia.energiaIdosGet() === 'ΔΙΑΝΟΜΗ')
		break;
	}

	if (Movie.energiaIndex >= elist.length)
	return Movie;

	Movie.
	displayFila().
	tzogosDisplay();

	return Movie;
};

Xartosia.prototype.xartosiaDOM = function(iseht, klista) {
	var dom, xromaPrev = null, rbPrev = null, cnt = this.xartosiaMikos();

	dom = $('<div>').addClass('tsoxaXartosiaContainer movieXartosiaContainer' + iseht);
	Globals.awalk(this.xartosiaFilaGet(), function(i, filo) {
		var filoDOM, xroma, rb;

		filoDOM = filo.filoDOM(klista).addClass('tsoxaXartosiaFilo');

		// Το πρώτο φύλλο εμφανίζεται κανονικά στη σειρά του, τα υπόλοιπα
		// απανωτίζουν το προηγούμενο φύλλο.

		if (i === 0)
		filoDOM.css('marginLeft', 0);

		// Κατά τη διάρκεια της αλλαγής τα φύλλα του τζογαδόρου είναι 12,
		// επομένως απανωτίζουμε λίγο παραπάνω.

		else if (cnt > 10)
		filoDOM.addClass('tsoxaXartosiaFiloSteno' + iseht);

		dom.append(filoDOM);

		// Μένει να ελέγξουμε αν υπάρχουν διαδοχικές ομοιόχρωμες φυλές, π.χ.
		// μετά τα μπαστούνια να ακολουθούν σπαθιά, ή μετά τα καρά να ακολουθούν
		// κούπες.

		if (klista)
		return;

		xroma = filo.filoXromaGet();
		if (xroma === xromaPrev)
		return;

		// Μόλις αλλάξαμε φυλή και πρέπει να ελέγξουμε αν η νέα φυλή είναι
		// ομοιόχρωμη με την προηγούμενη (κόκκινα/μαύρα).

		xromaPrev = xroma;
		rb = Prefadoros.xromaXroma[xroma];

		if (rb === rbPrev)
		filoDOM.addClass('tsoxaXartosiaFiloOmioxromo');

		else
		rbPrev = rb;
	});

	return dom;
};

Filo.prototype.filoDOM = function(klisto) {
	var img;

	img = klisto ? 'BV' : this.filoXromaGet() + this.filoAxiaGet();
	return $('<img>').data('filo', this).attr('src', '../ikona/trapoula/' + img + '.png');
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Movie.dianomiListaAdd = function(dianomi) {
	var kodikos, agoraDOM;

	kodikos = dianomi.dianomiKodikosGet();
	Movie.trapezi.partidaReplay({eoske: kodikos});
	agoraDOM = Movie.agoraDisplay();

	dianomi.movieDOM = $('<div>').addClass('dianomi').
	data('kodikos', kodikos).
	on('click', function(e) {
		Movie.
		entopismosDianomis($(this).data('kodikos')).
		displayDianomi();
	}).
	append(agoraDOM).
	append($('<div>').addClass('dianomiKodikos').html('&hellip;' + (kodikos % 100000)));

	Movie.dianomesDOM.
	append(dianomi.movieDOM);
};

Movie.agoraDisplay = function() {
	var agora, dom;

	dom = $('<div>').addClass('dianomiAgora');

	agora = Movie.trapezi.partidaAgoraGet();
	if (!agora)
	return dom.addClass('agoraBazes').html('&ndash;');

	dom.
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

Movie.thesiWalk = function(callback) {
	Prefadoros.thesiWalk(function(thesi) {
		callback(thesi);
	});

	return Movie;
};

Movie.thesiMap = function(thesi) {
	thesi = parseInt(thesi);
	Movie.egoThesi = parseInt(Movie.egoThesi);

	switch (Movie.egoThesi) {
	case 2:
	case 3:
		thesi += (4 - Movie.egoThesi);
		if (thesi > 3) thesi -= 3;
	}

	return thesi;
};

Movie.isKlista23 = function() {
	return Movie.klistaWE;
};

Movie.oxiKlista23 = function() {
	return !Movie.isKlista23();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "paralaviData" καλείται κατά την επιστροφή των αποτελεσμάτων,
// και σκοπό έχει τη διαχείριση των αποτελεσμάτων αυτών.

Movie.paralaviData = function(data) {
	if (!data) {
		Client.fyi.epano('<div class="aristera">Δεν βρέθηκαν δεδομένα</div>');
		return Movie;
	}

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

	// Χρειάζεται φιξάρισμα του κωδικού, καθώς αλλιώς εκλαμβάνεται ως
	// string.
 
	dianomi.kodikos = parseInt(dianomi.kodikos);
	dianomi.dealer = parseInt(dianomi.dealer);

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
