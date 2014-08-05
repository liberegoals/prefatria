Kitapi = {
	// Η παράμετρος "maxKasaLen1" δείχνει το μέγιστο πλήθος
	// εγγραφών κάσας που χωράνε καθ' ύψος στην περιοχή
	// του Νότου (θέση 1). Ακολουθούν αντίστοιχες παράμετροι
	// για τις περιοχές Ανατολής (θέση 2) και Δύσης (θέση 3).

	maxKasaLen1: 9,
	maxKasaLen2: 16,
	maxKasaLen3: 16,

	maxKapikiaLen1: 12,
	maxKapikiaLen2: 20,
	maxKapikiaLen3: 20,
};

// Η παράμετρος "maxKasaCount1" δείχνει το μέγιστο πλήθος
// εγγραφών κάσας που χωράνε γενικώς στην περιοχή του Νότου
// (θέση 1). Ακολουθούν αντίστοιχες παράμετροι για τις περιοχές
// Ανατολής (θέση 2) και Δύσης (θέση 3).

Kitapi.maxKasaCount1 = 7 * Kitapi.maxKasaLen1;
Kitapi.maxKasaCount2 = 3 * Kitapi.maxKasaLen2;
Kitapi.maxKasaCount3 = 3 * Kitapi.maxKasaLen3;

Kitapi.maxKapikiaCount1 = 4 * Kitapi.maxKapikiaLen1;
Kitapi.maxKapikiaCount2 = 2 * Kitapi.maxKapikiaLen2;
Kitapi.maxKapikiaCount3 = 2 * Kitapi.maxKapikiaLen3;

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
	stresarisma();
return;
Kitapi.testData();
});

Kitapi.unload = function() {
	if (Kitapi.unloaded) return;
	Kitapi.unloaded = true;
	if (Arena) Arena.kitapi.klisimo();
};

$(window).on('beforeunload', function() {
	Kitapi.unload();
});

$(window).on('unload', function() {
	Kitapi.unload();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Kitapi.perioxiSetup = function() {
	Prefadoros.thesiWalk(function(thesi) {
		var perioxiDom, dataDom, onomaDom, daravaeriDom, kasaDom, kl, kr, dom, h;

		// Δημιουργούμε DOM elements για τις τρεις περιοχές του κιταπιού.
		// Αυτές είναι πλέον προσβάσιμες μέσω των μεταβλητών:
		//
		//	Kitapi.perioxi1DOM	(Νότος)
		//	Kitapi.perioxi2DOM	(Ανατολή)
		//	Kitapi.perioxi3DOM	(Δύση)

		perioxiDom = $('#kitapiPerioxi' + thesi);
		Kitapi['perioxi' + thesi + 'DOM'] = perioxiDom;

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
		html(Kitapi.onomaGet(thesi)));
		Kitapi['onoma' + thesi + 'DOM'] = onomaDom;

		if (thesi === 3) {
			kl = '31';
			kr = '32';
		}
		else if (thesi === 2) {
			kl = '23';
			kr = '21';
		}
		else {
			kl = '13';
			kr = '12';
		}

		// Σε κάθε περιοχή υπάρχουν δύο υποπεριοχές που αφορούν στις συναλλαγές
		// καπικιών μεταξύ των παικτών.
		//
		// Τα DOM elements των περιοχών συναλλαγής καπικιών μεταξύ των παικτών
		// είναι προσβάσιμα μέσω των μεταβλητών:
		//
		//	Kitapi.kapikia12DOM	(Νότος/Ανατολή)
		//	Kitapi.kapikia13DOM	(Νότος/Δύση)
		//	Kitapi.kapikia21DOM	(Ανατολή/Νότος)
		//	Kitapi.kapikia23DOM	(Ανατολή/Δύση)
		//	Kitapi.kapikia31DOM	(Δύση/Νότος)
		//	Kitapi.kapikia32DOM	(Δύση/Ανατολή)

		daraveriDom = $('<table>').css('width', '100%').
		append($('<td>').attr('id', 'kitapiDaraveri' + kl).addClass('kitapiDaraveri').
		append(Kitapi['kapikia' + kl + 'DOM'] = $('<div>').
		addClass('kitapiStiliKapikia kitapiStiliKapikia' + kl))).
		append(kasaDom = $('<td>').css({
			textAlign: 'center',
		})).
		append($('<td>').attr('id', 'kitapiDaraveri' + kr).addClass('kitapiDaraveri').
		append(Kitapi['kapikia' + kr + 'DOM'] = $('<div>').
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

		// Τα DOM elements των περιοχών κάσας είναι προσβάσιμα μέσω των
		// μεταβλητών:
		//
		//	Kitapi.kasa1DOM	(Νότος)
		//	Kitapi.kasa2DOM	(Ανατολή)
		//	Kitapi.kasa3DOM	(Δύση)

		Kitapi['kasa' + thesi + 'DOM'] = dom;
		perioxiDom.append(daraveriDom);
	});

	return Kitapi;
};

Kitapi.onomasiaThesis = {
	1: 'Νότος',
	2: 'Ανατολή',
	3: 'Δύση',
};

Kitapi.onomaGet = function(thesi) {
	if (Kitapi.oxiArena())
	return Kitapi.onomasiaThesis[thesi];

	if (Arena.ego.oxiTrapezi())
	return Kitapi.onomasiaThesis[thesi];

	return Arena.ego.trapezi.trapeziPektisGet(thesi);
}

// Με την function "stresarisma" εισάγουμε μέγιστο πλήθος εγγραφών κάσας
// για τον Νότο και τη Δύση, ώστε να διορθωθούν οι διαστάσεις του παραθύρου
// και να αποφύγουμε κατά το δυνατόν τα scrollbars.

Kitapi.stresarisma = function() {
	var i;

	for (i = 1; i <= Kitapi.maxKasaLen1; i++) {
		Kitapi.kasaPush(1, i, false);
	}

	for (i = 1; i <= Kitapi.maxKapikiaLen1; i++) {
		Kitapi.kapikiaPush(1, 3, i, false);
	}

	for (i = 1; i <= Kitapi.maxKasaLen3; i++) {
		Kitapi.kasaPush(3, i, false);
	}

	for (i = 1; i <= Kitapi.maxKapikiaLen3; i++) {
		Kitapi.kapikiaPush(3, 1, i, false);
	}

	Kitapi.resize();
	Kitapi.kasa1DOM.empty();
	Kitapi.kapikia13DOM.empty();
	Kitapi.kasa3DOM.empty();
	Kitapi.kapikia31DOM.empty();

	return Kitapi;
};

Kitapi.resize = function() {
	var dh, dw;

	dh = ($(document.body).height() - $(window).outerHeight()) || $(document).height() - $(window).height();
	if (dh <= 0) return;
	if (dh > 200) return;

	dw = parseInt(dh * 0.86);
	window.resizeBy(dw, dh);
	if (!Arena) return;

	Arena.kitapi.position.width += dw;
	Arena.kitapi.position.height += dh;

	return Kitapi;
};

Kitapi.isArena = function() {
	return Arena;
};

Kitapi.oxiArena = function() {
	return !Kitapi.isArena();
};

Kitapi.provlima = function(msg) {
	Kitapi.error = msg;
	Client.provlima(msg, true).css('top', '10px');
	return Kitapi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kitapi.kasaPush = function(thesi, kasa, resize) {
	var kasaStiliDom, count, stiles, xorane, platos;

	kasaStiliDom = Kitapi['kasa' + thesi + 'DOM'];
	count = kasaStiliDom.children('.kitapiKasa').length + 1;
	if (count > Kitapi['maxKasaCount' + thesi])
	Kitapi.provlima('Παρουσιάστηκε υπέρβαση μέγιστου επιτρεπτού πλήθους ' +
		'εγγραφών κάσας.<br />Μήπως να τελειώνατε αυτήν την παρτίδα;');

	xorane = Kitapi['maxKasaLen' + thesi];
	stiles = Math.floor(count / xorane);
	if ((stiles * xorane) < count) stiles++;
	platos = (38 * stiles) + 'px';
	stiles += '';

	kasaStiliDom.css({
		width: platos,
		'column-count': stiles,
		'-moz-column-count': stiles,
		'-webkit-column-count': stiles,
	}).append($('<div>').addClass('kitapiKasa kitapiKasaDiagrafi').text(kasa));

	if (resize === undefined) resize = true;
	if (resize) Kitapi.resize();

	return Kitapi;
};

Kitapi.kapikiaPush = function(apo, pros, kapikia, resize) {
	var kapikiaStiliDom, count, stiles, xorane, platos;

	if (apo === pros)
	return Kitapi;

	kapikiaStiliDom = Kitapi['kapikia' + apo + '' + pros + 'DOM'];
	count = kapikiaStiliDom.children('.kitapiKapikia').length + 1;
	if (count > Kitapi['maxKapikiaCount' + apo])
	Kitapi.provlima('Παρουσιάστηκε υπέρβαση μέγιστου επιτρεπτού πλήθους ' +
		'εγγραφών καπικιών.<br />Μήπως να τελειώνατε αυτήν την παρτίδα;');

	xorane = Kitapi['maxKapikiaLen' + apo];
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

	if (resize === undefined) resize = true;
	if (resize) Kitapi.resize();

	return Kitapi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kitapi.testData = function() {
	var aa, timer;

	aa = 0;
	timer = setInterval(function() {
		var thesi, kasa, apo, pros;

		if (Kitapi.error) {
			clearInterval(timer);
			return;
		}

		thesi = Globals.random(1, 3);
		kasa = Globals.random(1, 150);
		Kitapi.kasaPush(thesi, kasa);

		apo = Globals.random(1, 3);
		pros = Globals.random(1, 3);
		kapikia = Globals.random(1, 150);
		Kitapi.kapikiaPush(apo, pros, kapikia);

		apo = Globals.random(1, 3);
		pros = Globals.random(1, 3);
		kapikia = Globals.random(1, 150);
		Kitapi.kapikiaPush(apo, pros, kapikia);

		if (aa++ > 150) clearInterval(timer);
	}, Globals.random(100, 100));

	return Kitapi;
};
