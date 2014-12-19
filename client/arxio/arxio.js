// ΣΕΑΠ -- Σελίδα Επισκόπησης Αρχειοθετημένων Παρτίδων
// ===================================================
//
// Το παρόν οδηγεί τη σελίδα επισκόπησης αρχειοθετημένων παρτίδων ΣΕΑΠ. Ο χρήστης
// μπορεί να καθορίσει κριτήρια επιλογής σχετικά με τους συμμετέχοντες και το χρόνο
// έναρξης της παρτίδας.
//
// Όσον αφορά στους συμμετέχοντες έχουμε τις εξής επιλογές:
//
//	[κενό]		Αν αφήσουμε το πεδίο κενό, τότε επιλέγονται παρτίδες ασχέτως
//			των συμμετεχόντως σε αυτές.
//
//	panos		Επιλέγονται παρτίδες στις οποίες συμμετέχει ο παίκτης "panos"
//
//	panos,maria	Επιλέγονται παρτίδες στις οποίες συμμετέχει ο παίκτης "panos",
//			ή ο παίκτης "kolios", ή και οι δύο.
//
//	panos+kolios	Επιλέγονται παρτίδες στις οποίες συμμετέχουν ΚΑΙ ο παίκτης
//			"panos" ΚΑΙ ο παίκτης "kolios".
//
// Στο κριτήριο ονόματος παίκτη μπορούν να «παίξουν» και μεταχαρακτήρες (%_).
//
// Τα κριτήρια επιλογής χρόνου έναρξης είναι απλώς οι ημερομηνίες αρχής και τέλους του
// διαστήματος επιλογής. Αν λείπει κάποιο, ή και τα δύο από αυτά τα κριτήρια το πρόγραμμα
// συμπεριφέρεται λογικά.
//
// Όσον αφορά στον κωδικό παρτίδας έχουμε τις εξής επιλογές:
//
//	[κενό]		Αν αφήσουμε το πεδίο κενό, τότε επιλέγονται παρτίδες με βάση
//			τα υπόλοιπα κριτήρια αναζήτησης.
//
//	NNNNNN		Επιλέγεται η παρτίδα με κωδικό NNNNNN.
//
//	NNNNNN-MMMMMM	Επιλέγονται οι παρτίδες με κωδικούς από NNNNNN έως και MMMMMM.
//
//	<NNNNNN		Επιλέγονται οι παρτίδες με κωδικούς μικρότερους από NNNNNN.
//
//	-NNNNNN		Επιλέγονται οι παρτίδες με κωδικούς από NNNNNN και κάτω.
//
//	>NNNNNN		Επιλέγονται οι παρτίδες με κωδικούς μεγαλύτερους από NNNNNN.
//
//	NNNNNN-		Επιλέγονται οι παρτίδες με κωδικούς από NNNNNN και άνω.
//
// Τα αποτελέσματα εμφανίζονται ταξινομημένα κατά κωδικό παρτίδας και αποστέλλονται σε
// σε ομάδες των 30 παρτίδων. Ο χρήστης μπορεί να ζητήσει την επόμενη ομάδα με το
// πλήκτρο "Περισσότερα…".

$(document).ready(function() {
	Client.tabPektis();
	Client.tabKlisimo($('#toolbarRight'));
	Arxio.setup();

	// Κατά την ανάπτυξη του προγράμματος βολεύει καλύτερα
	// να έχουμε αυτόματα κάποιο selected set.

	if (Debug.flagGet('development')) {
		$('input').val('');
		Arxio.goButtonDOM.trigger('click');
	}

	// Ελέγχουμε αν έχουμε ανοίξει την ΣΕΑΠ από τη βασική
	// σελίδα της εφαρμογής, ή αυτόνομα.

	Arena = null;
	if (!window.opener)
	return;

	// Εφόσον η σελίδα δεν έχει ανοίξει αυτόνομα, ελέγχουμε
	// το global αντικείμενο "Arena" το οποίο υποδηλώνει τη
	// βασική σελίδα της εφαρμογής ως σημείο εκκίνησης της
	// ΣΕΑΠ.

	Arena = window.opener.Arena;
	if (!Arena)
	return;

	// Η ΣΕΑΠ εκκίνησε από τη βασική σελίδα της εφαρμογής.
	// Προς το παρόν δεν χρειάζεται να κάνουμε κάποια ενέργεια
	// στη βασική σελίδα.
});

$(window).
on('beforeunload', function() {
	Arxio.unload();
}).
on('unload', function() {
	Arxio.unload();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arxio = {
	// Η property "limit" δείχνει πόσες παρτίδες αποστέλλονται από τον server
	// σε κάθε αποστολή.

	limit: 30,

	// Η property "skip" δείχνει πόσες ομάδες παρτίδων έχουμε ήδη παραλάβει
	// κάθε φορά που ζητάμε την επόμενη ομάδα αποτελεσμάτων για την τρέχουσα
	// αναζήτηση.

	skip: 0,
};

Arxio.setup = function() {
	var h;

	// Για τη διευκόλυνσή μας στην ανάπτυξη των προγραμμάτων, μπορούμε να
	// μειώσουμε το μέγεθος των ομάδων αποτελεσμάτων που αποστέλλονται από
	// τον server.

	if (Debug.flagGet('arxioLimit'))
	Arxio.limit = parseInt(Debug.flagGet('arxioLimit'));

	Client.ofelimoDOM.
	append(Arxio.kritiriaDOM = $('<div>').attr('id', 'kritiria')).
	append(Arxio.apotelesmataDOM = $('<div>').attr('id', 'apotelesmata'));

	Arxio.kritiriaSetup();
	h = Client.ofelimoDOM.innerHeight();
	h -= Arxio.kritiriaDOM.outerHeight(true) + 20;
	Arxio.apotelesmataDOM.css('height', h + 'px');

	// Στήνουμε κάποιους keyborad/mouse event listeners που αφορούν σε
	// ολόκληρη τη σελίδα.

	$(document).

	// Με το πάτημα του πλήκτρου Escape κάνουμε reset στη ΣΕΑΠ.

	on('keyup', function(e) {
		switch (e.which) {
		case 27:
			Arxio.resetButtonDOM.trigger('click');
			break;
		}
	}).

	// Οι παρτίδες που εμφανίζονται στη ΣΕΑΠ είναι κάπως αχνές, αλλά γίνονται
	// διαυγείς μόλις ο χρήστης περάσει από πάνω τους το ποντίκι. Αυτό γίνεται
	// μέσω CSS, αλλά παρόμοια τακτική ακολουθούμε και για τα καπίκια του κάθε
	// παίκτη· αυτό γίνεται προγραμματιστικά.

	on('mouseenter', '.trapezi', function(e) {
		$(this).find('.arxioKapikia').addClass('arxioKapikiaTrexon');
	}).
	on('mouseleave', '.trapezi', function(e) {
		$('.arxioKapikia').removeClass('arxioKapikiaTrexon');
	});
};

// Η function "kritiriaSetup" στήνει το επάνω μέρος της ΣΕΑΠ όπου υπάρχουν τα κριτήρια
// αναζήτησης και τα διάφορα πλήκτρα που αφορούν στους χειρισμούς αναζήτησης. Αν και
// δεν είναι απαραίτητο, όλα τα παραπάνω τα εντάσσουμε σε HTML form προκειμένου να
// καρπωθούμε τα οφέλη της φόρμας (submit, reset κλπ).

Arxio.kritiriaSetup = function() {
	Arxio.kritiriaDOM.
	append($('<form>').

	// Το πρώτο κριτήριο αναζήτησης αφορά στο login name του παίκτη σύμφωνα με τους
	// κανόνες που αναφέραμε παραπάνω.

	append($('<div>').addClass('formaPrompt').text('Παίκτης')).
	append(Arxio.pektisInputDOM = $('<input>').addClass('formaPedio').css('width', '140px')).

	// Ακολουθεί η αρχή του χρονικού διαστήματος που μας ενδιαφέρει. Αν δεν καθοριστεί
	// ημερομηνία αρχής, τότε δεν τίθεται κάτω χρονικό όριο. Η ημερομηνία αυτή αφορά
	// στο τέλος της παρτίδας και όχι στο στήσιμο.

	append($('<div>').addClass('formaPrompt').text('Από')).
	append(Arxio.apoInputDOM = Client.inputDate()).

	// Το επόμενο κριτήριο αναζήτησης αφορά στο τέλος του χρονικού διαστήματος που μας
	// ενδιαφέρει. Αν δεν καθοριστεί ημερομηνία τέλους, τότε δεν τίθεται άνω χρονικό
	// όριο.

	append($('<div>').addClass('formaPrompt').text('Έως')).
	append(Arxio.eosInputDOM = Client.inputDate()).

	// Ακολουθεί κριτήριο αναζήτησης που αφορά στον κωδικό τραπεζιού, σύμφωνα με τους
	// κανόνες που αναφέραμε παραπάνω.

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

	// Το πλήκτρο "Go!!!" εκκινεί την αναζήτηση στον server. Το καθιστούμε submit
	// button προκειμένου να μπορεί ο χρήστης να εκκινήσει την αναζήτηση πατώντας
	// Enter.

	append(Arxio.goButtonDOM = $('<button>').
	text('Go!!!').
	attr('type', 'submit').
	addClass('formaButton').
	on('click', function(e) {
		Arxio.
		apotelesmataClear().
		skipReset().
		zitaData();
		return false;
	})).

	// Το πλήκτρο "Reset" καθαρίζει τα αποτελέσματα που υπάρχουν ήδη στη ΣΕΑΠ και
	// επαναφέρει τα κριτήρια αναζήτησης στις αρχικές τους τιμές. Ο χρήστης μπορεί
	// να κάνει reset και με άλλον τρόπο, πατώντας το πλήκτρο Escape.

	append(Arxio.resetButtonDOM = $('<button>').
	text('Reset').
	attr('type', 'reset').
	addClass('formaButton').
	on('click', function(e) {
		Arxio.resetAnazitisi();
		return false;
	})).

	// Το πλήκτρο "Περισσότερα…" ζητά από τον server την επόμενη ομάδα αποτελεσμάτων
	// για την τρέχουσα αναζήτηση.

	append(Arxio.moreButtonDOM = $('<button>').
	text('Περισσότερα…').
	addClass('formaButton').
	on('click', function(e) {
		Arxio.skip += Arxio.limit;
		Arxio.zitaData();
		return false;
	})));

	Arxio.resetAnazitisi();
	return Arxio;
};

// Η function "zitaData" αποστέλλει query αναζήτησης παρτίδων στον server και διαχειρίζεται
// την απάντηση, η οποία περιέχει τα στοιχεία των επιλεγμένων παρτίδων.

Arxio.zitaData = function() {
	if (!Arxio.processKritiria())
	return;

	Client.fyi.pano('Αναζήτηση παρτίδων. Παρακαλώ περιμένετε…');
	Client.ajaxService('arxio/epilogi.php', 'pektis=' + Arxio.pektisInputDOM.val().uri(),
		'apo=' + Arxio.apoInputDOM.data('timestamp'), 'eos=' + Arxio.eosInputDOM.data('timestamp'),
		'partida=' + Arxio.partidaInputDOM.val().uri(), 'limit=' + Arxio.limit,
		'skip=' + Arxio.skip).
	done(function(rsp) {
		Client.fyi.pano();
		Arxio.paralaviPartida(rsp);
	}).
	fail(function(err) {
		Client.ajaxFail('Παρουσιάστηκε σφάλμα κατά την αναζήτηση παρτίδων');
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arxio.resetAnazitisi = function() {
	Arxio.
	kritiriaReset().
	skipReset().
	apotelesmataClear().
	pektisFocus();

	return Arxio;
};

Arxio.kritiriaReset = function() {
	if (Client.isPektis())
	Arxio.pektisInputDOM.val(Client.session.pektis);

	Arxio.eosInputDOM.val('');
	Arxio.apoInputDOM.val('');
	Arxio.partidaInputDOM.val('');

	return Arxio;
};

Arxio.skipReset = function() {
	Arxio.skip = 0;
	Arxio.moreButtonDOM.prop('disabled', true);
	return Arxio;
};

Arxio.apotelesmataClear = function() {
	Arxio.apotelesmataDOM.empty();
	return Arxio;
};

Arxio.pektisFocus = function() {
	Arxio.pektisInputDOM.focus();
	return Arxio;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "paralaviPartida" καλείται κατά την επιστροφή των αποτελεσμάτων,
// και σκοπό έχει τη διαχείριση των αποτελεσμάτων αυτών.

Arxio.paralaviPartida = function(data) {
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

	return Arxio;
};

// Η function "trapeziProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας τραπεζιών που επεστράφησαν από τον server.

Arxio.trapeziProcess = function(i, trapeziEco) {
	var trapezi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties του σχετικού τραπεζιού
	// έναντι των οικονομικών τοιαύτων.

	trapezi = new Trapezi();
	for (prop in Arxio.trapeziEcoMap) {
		trapezi[Arxio.trapeziEcoMap[prop]] = trapeziEco[prop];
	}

	Globals.awalk(trapezi.dianomiArray, function(i, dianomi) {
		dianomi = Arxio.dianomiProcess(dianomi);
		trapezi.dianomiArray[i] = dianomi;
		trapezi.trapeziDianomiSet(dianomi);
	});

	ts = parseInt(trapezi.stisimo);
	if (ts) trapezi.stisimo = ts + Client.timeDif;

	ts = parseInt(trapezi.arxio);
	if (ts) trapezi.arxio = ts + Client.timeDif;

	// Δημιουργούμε το τραπέζι ως αντικείμενο και προβαίνουμε στην
	// επεξεργασία και στην παρουσίαση αυτού του τραπεζιού.

	trapezi.
	trapeziArxioKapikia().
	trapeziArxioDisplay();

	return Arxio;
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
	d: 'dianomiArray',
};

// Η function "energiaProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας ενεργειών που επεστράφησαν από τον server.

Arxio.energiaProcess = function(energiaEco) {
	var energia, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής ενέργειας
	// έναντι των οικονομικών τοιαύτων.

	energia = new Energia();
	for (prop in Arxio.energiaEcoMap) {
		energia[Arxio.energiaEcoMap[prop]] = energiaEco[prop];
	}

	ts = parseInt(energia.pote);
	if (ts) energia.pote = ts + Client.timeDif;

	return energia;
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties της ενέργειας είναι συντομογραφικά.
// Η λίστα "energiaEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τής ενέργειας στα πραγαμτικά τους ονόματα.

Arxio.energiaEcoMap = {
	k: 'kodikos',
	p: 'pektis',
	t: 'pote',
	i: 'idos',
	d: 'data',
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "dianomiProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας διανομών που επεστράφησαν από τον server.

Arxio.dianomiProcess = function(dianomiEco) {
	var dianomi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής διανομής
	// έναντι των οικονομικών τοιαύτων.

	dianomi = {};
	for (prop in Arxio.dianomiEcoMap) {
		dianomi[Arxio.dianomiEcoMap[prop]] = dianomiEco[prop];
	}

	ts = parseInt(dianomi.telos);
	if (ts) dianomi.telos = ts + Client.timeDif;

	return new Dianomi(dianomi).
		processEnergiaList(dianomiEco['e']);
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties της διανομής είναι συντομογραφικά.
// Η λίστα "dianomiEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τής διανομής στα πραγαμτικά τους ονόματα.

Arxio.dianomiEcoMap = {
	k: 'kodikos',
	d: 'dealer',
	t: 'telos',
	k1: 'kasa1',
	m1: 'metrita1',
	k2: 'kasa2',
	m2: 'metrita2',
	k3: 'kasa3',
	m3: 'metrita3',
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

	input.removeClass('inputLathos').data('timestamp', 0);

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Αν κλείσουμε τη ΣΕΑΠ, θα πρέπει να κάνουμε κάποιες ενέργεις στη βασική
// σελίδα της εφαρμογής, εφόσον η ΣΕΑΠ εκκίνησε από τη βασική σελίδα.

Arxio.unload = function() {
	if (Arxio.unloaded)
	return;

	Arxio.unloaded = true;

	if (!Arena)
	return;

	if (!Arena.arxio)
	return;

	if (!Arena.arxio.win)
	return;

	Arena.arxio.win.close();
	Arena.arxio.win = null;
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
			trapezi['kapikia' + thesi] += dianomi.dianomiKasaGet(thesi) + dianomi.dianomiMetritaGet(thesi);
			//trapezi['kapikia' + thesi] += parseInt(dianomi['k' + thesi]) + parseInt(dianomi['m' + thesi]);
			kasa -= dianomi.dianomiKasaGet(thesi);
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

	if (this.DOM)
	this.DOM.emtpy();

	else
	Arxio.apotelesmataDOM.append(this.DOM = $('<div>').addClass('trapezi'));

	this.trapeziArxioOptions();

	kodikos = this.trapeziKodikosGet();
	this.DOM.
	data('trapezi', kodikos).
	append($('<div>').addClass('trapeziData').
	append($('<div>').addClass('trapeziDataContent').
	append($('<div>').addClass('trapeziDataKodikos').text(kodikos)).
	append($('<div>').addClass('trapeziDataIpolipo').text(this.ipolipo)))).
	on('click', function(e) {
		if (trapezi.isAplomeno())
		trapezi.mazema();

		else
		trapezi.aploma();
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

	if (arxio)
	this.DOM.append($('<div>').addClass('trapeziArxio').text(Globals.poteOra(arxio)));

	else
	this.DOM.append($('<div>').addClass('trapeziArxio plagia').text('Σε εξέλιξη…'));
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

Trapezi.prototype.aplomenoSet = function(aplomeno) {
	if (aplomeno === undefined)
	aplomeno = true;

	this.aplomeno = aplomeno;
	return this;
};

Trapezi.prototype.isAplomeno = function() {
	return this.aplomeno;
};

Trapezi.prototype.isMazemeno = function() {
	return !this.isAplomeno();
};

Trapezi.prototype.aploma = function() {
	var trapezi = this, partida, kodikos;

	Globals.awalk(this.dianomiArray, function(i, dianomi) {
		dianomi.dianomiArxioDisplay(trapezi);
	});

	partida = Arxio.partidaInputDOM;
	if (!partida.val()) {
		kodikos = this.trapeziKodikosGet();
		partida.val(kodikos);
		partida.data('partida', kodikos);
	}

	this.aplomenoSet(true);
	return this;
}

Trapezi.prototype.mazema = function() {
	var partida;

	this.DOM.find('.dianomi').remove();

	partida = Arxio.partidaInputDOM;
	if (partida.data('partida')) {
		partida.val('');
		partida.removeData('partida');
	}

	this.aplomenoSet(false);
	return this;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Dianomi.prototype.processEnergiaList = function(elist) {
	var dianomi = this;

	Globals.awalk(elist, function(i, energiaEco) {
		var energia;

		energia = Arxio.energiaProcess(energiaEco);
		dianomi.dianomiEnergiaSet(energia);
		dianomi.energiaArray[i] = energia;
	});

	return this;
};

Dianomi.prototype.dianomiArxioDisplay = function(trapezi) {
	var dianomi = this, pektisDOM = {};

	trapezi.DOM.
	append(this.DOM = $('<div>').addClass('dianomi').
	append($('<div>').addClass('dianomiData').
	append($('<div>').addClass('dianomiDataContent').
	append($('<div>').addClass('dianomiKodikos').text(this.dianomiKodikosGet())))));

	Prefadoros.thesiWalk(function(thesi) {
		dianomi.DOM.append(pektisDOM[thesi] = $('<div>').addClass('pektis dianomiPektis'));
	});

	pektisDOM[dianomi.dianomiDealerGet()].append(Arxio.dealerEndixiDOM());
	pektisDOM[2].append(Arxio.dealerEndixiDOM());

	this.dianomiEnergiaWalk(function() {
		var pektis, idos, data, dom;

		pektis = this.energiaPektisGet();
		idos = this.energiaIdosGet();
		data = this.energiaDataGet();
		dom = pektisDOM[pektis];

		switch (idos) {
		case 'ΑΓΟΡΑ':
			dom.append(new Dilosi(data.substr(0, 3)).agoraDOM());
			break;
		}
	}, 1);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Dilosi.prototype.agoraDOM = function() {
	var dom;

	dom = $('<div>').addClass('agora').attr('title', 'Αγορά');
	dom.append($('<div>').addClass('agoraBazes').text(this.dilosiBazesGet()));
	dom.append($('<img>').addClass('agoraXroma').
	attr('src', '../ikona/trapoula/xroma' + this.dilosiXromaGet() + '.png'));

	if (this.dilosiIsAsoi())
	dom.
	append($('<div>').addClass('tsoxaDilosiAsoi').
	append($('<img>').addClass('tsoxaDilosiAsoiIcon').
	attr('src', '../ikona/panel/asoiOn.png')));

	return dom;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arxio.dealerEndixiDOM = function() {
	return $('<img>').addClass('dealerIcon').attr({
		src: '../ikona/endixi/dealer.png',
		title: 'Dealer',
	});
};
