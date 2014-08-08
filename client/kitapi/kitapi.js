Kitapi = {
	// Η λίστα "maxKasaLen" δείχνει το μέγιστο πλήθος εγγραφών
	// κάσας που χωράνε καθ' ύψος στην περιοχή κάθε παίκτη και
	// είναι δεικτοδοτημένη με τη θέση του παίκτη.

	maxKasaLen: {
		1: 9,
		2: 16,
		3: 16,
	},

	// Η λίστα "maxKasaStiles" δείχνει το μέγιστο πλήθος στηλών
	// εγγραφών κάσας που χωράνε γενικώς στην περιοχή κάθε παίκτη
	// και είναι δεικτοδοτημένη με τη θέση του παίκτη.

	maxKasaStiles: {
		1: 6,
		2: 2,	// χωράνε και τρεις στήλες, αλλά δεν είναι καλό,
		3: 2,	// γιατί δεν ξεχωρίζουν κάσες και καπίκια.
	},

	// Η λίστα "maxKasaCount" δείχνει το μέγιστο πλήθος εγγραφών κάσας
	// για κάθε παίκτη και είναι δεικτοδοτημένη με τη θέση του παίκτη.
	// Οι τιμές της λίστας υπολογίζονται αργότερα και προκύπουν, προφανώς,
	// από τα στοιχεία των λιστών "maxKasaLen" και "maxKasaStiles".


	maxKasaCount: {},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η λίστα "maxKapikiaLen" δείχνει το μέγιστο πλήθος εγγραφών
	// καπικιών που χωράνε καθ' ύψος στην περιοχή κάθε παίκτη και
	// είναι δεικτοδοτημένη με τη θέση του παίκτη.

	maxKapikiaLen: {
		1: 12,
		2: 18,
		3: 18,
	},

	// Η λίστα "maxKapikiaStiles" δείχνει το μέγιστο πλήθος στηλών
	// εγγραφών καπικιών που χωράνε γενικώς στην περιοχή κάθε παίκτη
	// και είναι δεικτοδοτημένη με τη θέση του παίκτη.

	maxKapikiaStiles: {
		1: 4,
		2: 2,
		3: 2,
	},

	// Η λίστα "maxKapikiaCount" δείχνει το μέγιστο πλήθος εγγραφών καπικιών
	// για κάθε παίκτη και είναι δεικτοδοτημένη με τη θέση του παίκτη.
	// Οι τιμές της λίστας υπολογίζονται αργότερα και προκύπουν, προφανώς,
	// από τα στοιχεία των λιστών "maxKapikiaLen" και "maxKapikiaStiles".


	maxKapikiaCount: {},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η λίστα "onomaDOM" περιέχει τα DOM elements των ονομάτων των
	// παικτών και είναι δεικοτοδοτημένη με τη θέση του παίκτη.

	onomaDOM: {},

	// Η λίστα "kasaAreaDOM" περιέχει τα DOM elements των περιοχών
	// κάσας για κάθε παίκτη και είναι δεικτοδοτημένη με τη θέση
	// του παίκτη.

	kasaAreaDOM: {},

	// Η λίστα "kasaDOM" περιέχει τα DOM elements των τελευταίων
	// εγγραφών κάσας για κάθε παίκτη και είναι δεικτοδοτημένη
	// με τη θέση του παίκτη.

	kasaDOM: {},

	// Η λίστα "kapikiaAreaDOM" δείχνει τα DOM elements των περιοχών
	// ανταλλαγής καπικιών μεταξύ των παικτών και δεικτοδοτείται ως
	// εξής:
	//
	//	13	Ανταλλαγές καπικιών στην περιοχή του παίκτη 1 με τον
	//		τον παίκτη 3 (κάτω αριστερά).
	//
	//	12	Ανταλλαγές καπικιών στην περιοχή του παίκτη 1 με τον
	//		τον παίκτη 2 (κάτω δεξιά).
	//
	//	21	Ανταλλαγές καπικιών στην περιοχή του παίκτη 2 με τον
	//		τον παίκτη 1 (πάνω δεξιά).
	//
	//	23	Ανταλλαγές καπικιών στην περιοχή του παίκτη 2 με τον
	//		τον παίκτη 3 (κέντρο δεξιά).
	//
	//	32	Ανταλλαγές καπικιών στην περιοχή του παίκτη 3 με τον
	//		τον παίκτη 2 (κέντρο αριστερά).
	//
	//	31	Ανταλλαγές καπικιών στην περιοχή του παίκτη 3 με τον
	//		τον παίκτη 1 (πάνω αριστερά).

	kapikiaAreaDOM: {},

	// Η λίστα "kapikiaDOM" δείχνει τα DOM elements των τελευταίων
	// συναλλαγών καπικιών μεταξύ οποιουδήποτε ζεύγους παικτών. Η λίστα
	// δεικτοδοτείται όπως και η λίστα των αντίστοιχων περιοχών στις
	// οποίες καταγράφονται οι εν λόγω συναλλαγές, απλώς φροντίζουμε
	// ώστε τα δυο στοιχεία που αφορούν στη συναλλαγή δυο συγκεκριμένων
	// παικτών να είναι ίδια και να δείχνουν το DOM element της τελευταίας
	// μεταξύ τους συναλλαγής, π.χ. το στοιχείο 13 πρέπει να είναι το ίδιο
	// με το στοιχείο 31, και το στοιχείο 23 πρέπει να δείχνει το ίδιο
	// DOM element με το στοιχείο 32.

	kapikiaDOM: {},

	// Η λίστα "kasa" περιέχει την τρέχουσα κάσα κάθε παίκτη και είναι
	// δεικτοδοτημένη με τη θέση του παίκτη.

	kasa: {},
};

$(document).ready(function() {
	// Χρειαζόμαστε πρόσβαση στη βασική σελίδα του «Πρεφαδόρου», από
	// την οποία εκκίνησε το κιτάπι. Σ' αυτή τη σελίδα υπάρχει global
	// μεταβλητή "Arena" και ουσιαστικά αυτήν χρειαζόμαστε.
	// Αν δεν υπάρχει γονική σελίδα, ή η μεταβλητή "Arena" δεν βρεθεί
	// στη γονική σελίδα, τότε θεωρούμε ότι το κιτάπι έχει εκκινήσει
	// ανεξάρτητα σε δική του σελίδα.

	Arena = (window.opener && window.opener.Arena ? window.opener.Arena : null);

	// Όλα τα παρασκήνια στις σελίδες του «Πρεφαδόρου» τίθενται με βάση
	// την επιλογή του χρήστη, αλλά ειδικά το κιτάπι έχει δικό του.

	Client.bodyDOM.css({
		backgroundImage: "url('../ikona/paraskinio/kitapi.jpg')",
	});

	Kitapi.
	perioxiSetup().
	stresarisma().
	refreshDOM();
//Kitapi.fullData();
});

Kitapi.unload = function() {
	if (Kitapi.unloaded) return;
	Kitapi.unloaded = true;

	if (Kitapi.isArena())
	Arena.kitapi.klisimo();
};

$(window).on('beforeunload', function() {
	Kitapi.unload();
});

$(window).on('unload', function() {
	Kitapi.unload();
});

Kitapi.isArena = function() {
	return Arena;
};

Kitapi.oxiArena = function() {
	return !Kitapi.isArena();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Kitapi.perioxiSetup = function() {
	Kitapi.trapeziDOM = $('<div>').attr('id', 'kitapiTrapezi').prependTo(Client.ofelimoDOM);
	Prefadoros.thesiWalk(function(thesi) {
		var perioxiDom, dataDom, onomaDom, daravaeriDom, kasaDom, kl, kr, dom, h;

		// Δημιουργούμε DOM elements για τις τρεις περιοχές του κιταπιού.
		// Αυτές είναι πλέον προσβάσιμες μέσω των μεταβλητών:
		//
		//	Kitapi.perioxi1DOM	(Νότος)
		//	Kitapi.perioxi2DOM	(Ανατολή)
		//	Kitapi.perioxi3DOM	(Δύση)

		perioxiDom = $('#kitapiPerioxi' + thesi);

		// Στο επάνω μέρος κάθε περιοχής υπάρχει περιοχή, επονομαζόμενη
		// "data" στην οποία εμφανίζεται το όνομα του αντίστοιχου παίκτη.
		//
		// Τα DOM elements των ονομάτων των παικτών είναι προσβάσιμα μέσω
		// των μεταβλητών:
		//
		//	Kitapi.onoma1DOM	(Νότος)
		//	Kitapi.onoma2DOM	(Ανατολή)
		//	Kitapi.onoma3DOM	(Δύση)

		dataDom = $('<div>').addClass('kitapiPektisData').
		append(onomaDom = $('<div>').addClass('kitapiPektisOnoma').
		html(Kitapi.onomasiaThesis[thesi]));
		Kitapi.onomaDOM[thesi] = onomaDom;

		if (thesi === 3) {
			kl = 31;
			kr = 32;
		}
		else if (thesi === 2) {
			kl = 23;
			kr = 21;
		}
		else {
			kl = 13;
			kr = 12;
		}

		daraveriDom = $('<table>').css('width', '100%').
		append($('<td>').attr('id', 'kitapiDaraveri' + kl).addClass('kitapiDaraveri').
		append(Kitapi.kapikiaAreaDOM[kl] = $('<div>').
		addClass('kitapiStiliKapikia kitapiStiliKapikia' + kl))).
		append(kasaDom = $('<td>').css({
			textAlign: 'center',
		})).
		append($('<td>').attr('id', 'kitapiDaraveri' + kr).addClass('kitapiDaraveri').
		append(Kitapi.kapikiaAreaDOM[kr] = $('<div>').
		addClass('kitapiStiliKapikia kitapiStiliKapikia' + kr)));

		if (thesi === 1) {
			kasaDom.
			append(dataDom);
		}
		else {
			perioxiDom.append(dataDom);
		}

		// Σε κάθε περιοχή υπάρχει υποπεριοχή που αφορά στην κάσα του
		// αντίστοιχου παίκτη.

		dom = $('<div>').
		addClass('kitapiStiliKasa').
		appendTo(kasaDom);

		// Στην Ανατολή και στη Δύση η λωρίδα των data που περιέχει το
		// όνομα του παίκτη, εκτείνεται από άκρου εις άκρον καλύπτοντας
		// όλο το πλάτος της περιοχής του αντίστοιχου παίκτη, επομένως
		// το διαθέσιμο ύψος της περιοχής γραφής κάσας και καπικιών θα
		// πρέπει να μειωθεί.

		if (thesi !== 1) {
			h = perioxiDom.outerHeight();
			h -= dataDom.outerHeight();
			dom.css('height', h + 'px');
		}

		Kitapi.kasaAreaDOM[thesi] = dom;
		perioxiDom.append(daraveriDom);
	});

	return Kitapi;
};

Kitapi.onomasiaThesis = {
	1: 'ΝΟΤΟΣ',
	2: 'ΑΝΑΤΟΛΗ',
	3: 'ΔΥΣΗ',
};

// Αρχικά υπήρχε η σκέψη σε μη παρτίδα να αναγράφονται οι συμβολικές
// ονομασίες θέσης των παικτών, αλλά το μετάνιωσα.

Prefadoros.thesiWalk(function(thesi) {
	Kitapi.onomasiaThesis[thesi] = '&nbsp;';
});

Kitapi.onomaGet = function(thesi) {
	var pektis;

	if (Kitapi.oxiArena())
	return Kitapi.onomasiaThesis[thesi];

	if (Arena.ego.oxiTrapezi())
	return Kitapi.onomasiaThesis[thesi];

	pektis = Arena.ego.trapezi.trapeziPektisGet(thesi);
	if (!pektis) pektis = Arena.ego.trapezi.trapeziTelefteosGet(thesi);
	return pektis ? pektis : '&nbsp;';
}

// Με την function "stresarisma" εισάγουμε μέγιστο πλήθος εγγραφών κάσας
// για τον Νότο και τη Δύση, ώστε να διορθωθούν οι διαστάσεις του παραθύρου
// και να αποφύγουμε κατά το δυνατόν τα scrollbars.

Kitapi.stresarisma = function() {
	var i;

	Kitapi.
	fullData().
	resize().
	clearDOM();

	// Έχουμε φέρει το μέγεθος του κιταπιού στα επιθυμητά πλαίσια. Τώρα
	// μειώνουμε κατά μια θέση το μήκος των επιμέρους στηλών, οπότε έχουμε
	// περισσότερη σιγουριά, και αμέσως μετά υπολογίζουμε το μέγιστο πλήθος
	// στοιχείων για κάθε στήλη. Υπενθυμίζουμε ότι μόλις υπερβούμε το μέγιστο
	// πλήθος στοιχείων σε κάποια στήλη, κονταίνουμε τη στήλη και τοποθετούμε
	// κάθετα αποσιωπητικά στην αρχή της στήλης.

	Prefadoros.thesiWalk(function(thesi) {
		Kitapi.maxKasaLen[thesi]--;
		Kitapi.maxKasaCount[thesi] = Kitapi.maxKasaStiles[thesi] * Kitapi.maxKasaLen[thesi];

		Kitapi.maxKapikiaLen[thesi]--;
		Kitapi.maxKapikiaCount[thesi] = Kitapi.maxKapikiaStiles[thesi] * Kitapi.maxKapikiaLen[thesi];
	});

	return Kitapi;
};

Kitapi.fullData = function() {
	Prefadoros.thesiWalk(function(thesi) {
		var p1, p2, i, j;

		switch (thesi) {
		case 1:
			p1 = 2;
			p2 = 3;
			break;
		case 2:
			p1 = 1;
			p2 = 3;
			break;
		case 3:
			p1 = 1;
			p2 = 2;
			break;
		}

		for (i = 0; i < Kitapi.maxKasaStiles[thesi]; i++) {
			for (j = 1; j <= Kitapi.maxKasaLen[thesi]; j++) {
				Kitapi.kasaPush(thesi, j);
			}
		}

		for (i = 0; i < Kitapi.maxKapikiaStiles[thesi]; i++) {
			for (j = 1; j <= Kitapi.maxKapikiaLen[thesi]; j++) {
				Kitapi.kapikiaPush(thesi, p1, j);
				Kitapi.kapikiaPush(thesi, p2, j);
			}
		}
	});

	return Kitapi;
};

Kitapi.resize = function() {
	var dh, dw;

	dh = ($(document.body).height() - $(window).outerHeight()) || $(document).height() - $(window).height();
	if (dh <= 0) return Kitapi;
	if (dh > 200) return Kitapi;

	dw = parseInt(dh * 0.86);
	window.resizeBy(dw, dh);
	if (!Arena) return Kitapi;

	Arena.kitapi.position.width += dw;
	Arena.kitapi.position.height += dh;

	return Kitapi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η function "pliromiPush" δέχεται ένα record πληρωμής διανομής και επιτελεί
// τις σχετικές αλλαγές στο κιτάπι. Το record πληρωμής διανομής πρέπει να έχει
// τα παρακάτω στοιχεία:
//
//	kasa1		Είναι τα καπίκια που σηκώνει (θετικό), ή καταθέτει (αρνητικό)
//			στη κάσα ο παίκτης στη θέση 1, αν π.χ. είναι 30 σημαίνει ότι
//			ο παίκτης 1 σηκώνει από την κάσα 30 καπίκια, ενώ αν είναι -30,
//			σημαίνει ότι ο παίκτης 1 καταθέτει στην κάσα 30 καπίκια.
//
//	metrita1	Είναι καπίκια που δίνει (αρνητικό), ή παίρνει (θετικό) ο παίκτης
//			στη θέση 1 από τους άλλους παίκτες, αν π.χ. είναι -35 σημαίνει
//			ότι ο παίκτης 1 δίνει στους παίκτες 2 και 3 συνολικά 35 καπίκια,
//			ενώ αν είναι 96, σημαίνεί ότι ο παίκτης 1 παίρνει από τους παίκτες
//			2 και 3 συνολικά 96 καπίκια.
//
//	kasa2		Παρόμοιο με το "kasa1" αλλά για τον παίκτη 2.
//
//	kapikia2	Παρόμοιο με το "kapikia2" αλλά για τον παίκτη 2.
//
//	kasa3		Παρόμοιο με το "kasa1" αλλά για τον παίκτη 3.
//
//	kapikia3	Παρόμοιο με το "kapikia3" αλλά για τον παίκτη 3.

Kitapi.pliromiPush = function(data) {
	var pliromi;

	// Δημιουργούμε αντίγραφο με τα στοιχεία της πληρωμής, καθώς είναι πολύ
	// πιθανόν να πειράξουμε τα δεδομένα και δεν θέλουμε να αλλοιώσουμε τα
	// αρχικά δεδομένα.

	pliromi = {
		kasa: {},
		metrita: {},
	};

	Prefadoros.thesiWalk(function(thesi) {
		pliromi.kasa[thesi] = parseInt(data['kasa' + thesi]);
		pliromi.metrita[thesi] = parseInt(data['metrita' + thesi]);
	});

	// Πρώτα ασχολούμαστε με τις δοσοληψίες των παικτών με την κάσα.

	Prefadoros.thesiWalk(function(thesi) {
		if (!pliromi.kasa[thesi])
		return;

		Kitapi.kasa[thesi] -= pliromi.kasa[thesi];
		Kitapi.kasaPush(thesi, Math.floor(Kitapi.kasa[thesi] / 10), (pliromi.kasa[thesi] < 0));
	});

	return Kitapi;
};

Kitapi.kasaPush = function(thesi, kasa, mesa) {
	var kasaStiliDom, count, stiles, xorane, platos, kasaDom;

	kasaStiliDom = Kitapi.kasaAreaDOM[thesi];
	count = kasaStiliDom.children('.kitapiKasa').length;

	if (count >= Kitapi.maxKasaCount[thesi])
	count = Kitapi.kasaKontema(thesi);

	count++;

	xorane = Kitapi.maxKasaLen[thesi];
	stiles = Math.floor(count / xorane);
	if ((stiles * xorane) < count) stiles++;
	platos = (38 * stiles) + 'px';
	stiles += '';

	kasaDom = Kitapi.kasaDOM[thesi];
	if (kasaDom) kasaDom.addClass('kitapiKasaDiagrafi');

	kasaDom = $('<div>').addClass('kitapiKasa').text(kasa);
	if (mesa) kasaDom.addClass('kitapiKasaMesa');

	kasaStiliDom.css({
		width: platos,
		'column-count': stiles,
		'-moz-column-count': stiles,
		'-webkit-column-count': stiles,
	}).append(kasaDom);

	Kitapi.kasaDOM[thesi] = kasaDom;
	return Kitapi;
};

// Η function "kasaKontema" κονταίνει τη λίστα κασών συγκεκριμένης θέσης
// και επιστρέφει το νέο πλήθος της λίστας.

Kitapi.kasaKontema = function(thesi) {
	var jql, count, del, i;

	jql = Kitapi.kasaAreaDOM[thesi].children('.kitapiKasa');
	count = jql.length;

	del = 1;
	if (count <= del) return count;

	del = 1;
	for (i = 0; i < del; i++) {
		$(jql.get(i)).remove();
	}

	$(jql.get(i)).removeClass('kitapiKasaDiagrafi kitapiKasaMesa').html('&#8942;');
	return count - del;
};

Kitapi.kapikiaPush = function(apo, pros, kapikia) {
	var kapikiaStiliDom, count, stiles, xorane, platos;

	if (apo === pros)
	return Kitapi;

	kapikiaStiliDom = Kitapi.kapikiaAreaDOM[apo + '' + pros];
	count = kapikiaStiliDom.children('.kitapiKapikia').length;

	if (count >= Kitapi.maxKapikiaCount[apo])
	count = Kitapi.kapikiaKontema(apo, pros);

	count++;

	xorane = Kitapi.maxKapikiaLen[apo];
	stiles = Math.floor(count / xorane);
	if ((stiles * xorane) < count) stiles++;
	platos = (36 * stiles) + 'px';
	stiles += '';

	kapikiaStiliDom.css({
		width: platos,
		'column-count': stiles,
		'-moz-column-count': stiles,
		'-webkit-column-count': stiles,
	}).append($('<div>').addClass('kitapiKapikia kitapiKapikiaDiagrafi').text(kapikia));

	return Kitapi;
};

// Η function "kasaKontema" κονταίνει τη λίστα κασών συγκεκριμένου
// ζεύγους παικτών και επιστρέφει το νέο πλήθος της λίστας.

Kitapi.kapikiaKontema = function(apo, pros) {
	var jql, count, del, i;

	jql = Kitapi.kapikiaAreaDOM[apo + '' + pros].children('.kitapiKapikia');
	count = jql.length;
	del = 1;

	if (count <= del) return count;

	for (i = 0; i < del; i++) {
		$(jql.get(i)).remove();
	}

	$(jql.get(i)).removeClass('kitapiKapikiaDiagrafi').html('&#8942;');
	return count - del;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kitapi.clearDOM = function() {
	Kitapi.trapeziDOM.empty();
	Kitapi.kasaAreaDOM[1].empty();
	Kitapi.kapikiaAreaDOM[13].empty();
	Kitapi.kapikiaAreaDOM[12].empty();

	Kitapi.kasaAreaDOM[2].empty();
	Kitapi.kapikiaAreaDOM[21].empty();
	Kitapi.kapikiaAreaDOM[23].empty();

	Kitapi.kasaAreaDOM[3].empty();
	Kitapi.kapikiaAreaDOM[31].empty();
	Kitapi.kapikiaAreaDOM[32].empty();

	Kitapi.kasa = {};
	Kitapi.kasaDOM = {};

	return Kitapi;
};

Kitapi.refreshDOM = function() {
	var trapezi, kasa;

	Kitapi.clearDOM();

	if (Kitapi.oxiArena()) return Kitapi;
	if (Arena.ego.oxiTrapezi()) return Kitapi;

	trapezi = Arena.ego.trapezi;
	Kitapi.trapeziDOM.text(Arena.ego.trapezi.trapeziKodikosGet() % 10000);
	kasa = trapezi.trapeziKasaGet();
	Prefadoros.thesiWalk(function(thesi) {
		Kitapi.onomaDOM[thesi].html(Kitapi.onomaGet(thesi));
		Kitapi.kasaPush(thesi, kasa);
		Kitapi.kasa[thesi] = kasa * 10;
	});

	trapezi.trapeziDianomiWalk(function(dianomi) {
		Kitapi.pliromiPush(this);
	}, 1);

	return Kitapi;
};

Kitapi.pektisRefreshDOM = function() {
	Prefadoros.thesiWalk(function(thesi) {
		Kitapi.onomaDOM[thesi].html(Kitapi.onomaGet(thesi));
	});

	return Kitapi;
};
