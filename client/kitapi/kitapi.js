Kitapi = {
	// Η παράμετρος "maxKasaLen1" δείχνει το μέγιστο πλήθος
	// εγγραφών κάσας που χωράνε καθ' ύψος στην περιοχή
	// του Νότου (θέση 1). Ακολουθούν αντίστοιχες παράμετροι
	// για τις περιοχές Ανατολής (θέση 2) και Δύσης (θέση 3).

	maxKasaLen1: 9,
	maxKasaLen2: 16,
	maxKasaLen3: 16,

	maxKapikiaLen1: 12,
	maxKapikiaLen2: 18,
	maxKapikiaLen3: 18,

	// Η παράμετρος "maxKasaStiles" δείχνει το μέγιστο πλήθος
	// στηλών εγγραφών κάσας που χωράνε γενικώς στην περιοχή του
	// Νότου (θέση 1). Ακολουθούν αντίστοιχες παράμετροι για τις
	// περιοχές Ανατολής (θέση 2) και Δύσης (θέση 3).

	maxKasaStiles1: 6,
	maxKasaStiles2: 2,
	maxKasaStiles3: 2,

	maxKapikiaStiles1: 3,
	maxKapikiaStiles2: 2,
	maxKapikiaStiles3: 2,
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
		text(Kitapi.onomasiaThesis[thesi]));
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
	var pektis;

	if (Kitapi.oxiArena())
	return Kitapi.onomasiaThesis[thesi];

	if (Arena.ego.oxiTrapezi())
	return Kitapi.onomasiaThesis[thesi];

	pektis = Arena.ego.trapezi.trapeziPektisGet(thesi);
	return pektis ? pektis : '&nbsp;';
}

// Με την function "stresarisma" εισάγουμε μέγιστο πλήθος εγγραφών κάσας
// για τον Νότο και τη Δύση, ώστε να διορθωθούν οι διαστάσεις του παραθύρου
// και να αποφύγουμε κατά το δυνατόν τα scrollbars.

Kitapi.stresarisma = function() {
	var i;

	for (i = 1; i <= Kitapi.maxKasaLen1; i++) Kitapi.kasaPush(1, i);
	for (i = 1; i <= Kitapi.maxKapikiaLen1; i++) Kitapi.kapikiaPush(1, 3, i);
	for (i = 1; i <= Kitapi.maxKapikiaLen1; i++) Kitapi.kapikiaPush(1, 2, i);

	for (i = 1; i <= Kitapi.maxKasaLen3; i++) Kitapi.kasaPush(3, i);
	for (i = 1; i <= Kitapi.maxKapikiaLen3; i++) Kitapi.kapikiaPush(3, 1, i);

	for (i = 1; i <= Kitapi.maxKasaLen2; i++) Kitapi.kasaPush(2, i);
	for (i = 1; i <= Kitapi.maxKapikiaLen2; i++) Kitapi.kapikiaPush(2, 1, i);

	Kitapi.
	resize().
	clearDOM();

	Prefadoros.thesiWalk(function(thesi) {
		Kitapi['maxKasaLen' + thesi]--;
		Kitapi['maxKasaCount' + thesi] = Kitapi['maxKasaStiles' + thesi] * Kitapi['maxKasaLen' + thesi];

		Kitapi['maxKapikiaLen' + thesi]--;
		Kitapi['maxKapikiaCount' + thesi] = Kitapi['maxKapikiaStiles' + thesi] * Kitapi['maxKapikiaLen' + thesi];
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

Kitapi.pliromiPush = function(data) {
	var pliromi = {};

	// Δημιουργούμε αντίγραφο της πληρωμής, καθώς είναι πολύ πιθανόν
	// να πειράξουμε τα δεδομένα.

	Prefadoros.thesiWalk(function(thesi) {
		pliromi['kasa' + thesi] = parseInt(data['kasa' + thesi]);
		pliromi['metrita' + thesi] = parseInt(data['metrita' + thesi]);
	});

	Prefadoros.thesiWalk(function(thesi) {
		var kasa, idx, kasaLast;

		kasa = pliromi['kasa' + thesi];
		if (!kasa) return;

		idx = 'kasaLast' + thesi;
		Kitapi[idx] -= kasa;
console.log(Kitapi[idx]);
		Kitapi.kasaPush(thesi, Math.floor(Kitapi[idx] / 10));
	});

	return Kitapi;
};

Kitapi.kasaPush = function(thesi, kasa) {
	var kasaStiliDom, count, stiles, xorane, platos, idx, kasaDom;

	kasaStiliDom = Kitapi['kasa' + thesi + 'DOM'];
	count = kasaStiliDom.children('.kitapiKasa').length + 1;

	if (count > Kitapi['maxKasaCount' + thesi])
	count = Kitapi.kasaKontema(thesi);

	xorane = Kitapi['maxKasaLen' + thesi];
	stiles = Math.floor(count / xorane);
	if ((stiles * xorane) < count) stiles++;
	platos = (38 * stiles) + 'px';
	stiles += '';

	idx = 'kasaLast' + thesi + 'DOM';
	kasaDom = Kitapi[idx];
	if (kasaDom) kasaDom.addClass('kitapiKasaDiagrafi');

	kasaDom = $('<div>').addClass('kitapiKasa').text(kasa);
	Kitapi[idx] = kasaDom;

	kasaStiliDom.css({
		width: platos,
		'column-count': stiles,
		'-moz-column-count': stiles,
		'-webkit-column-count': stiles,
	}).append(kasaDom);

	return Kitapi;
};

Kitapi.kasaKontema = function(thesi) {
	var jql, count, del, i;

	jql = Kitapi['kasa' + thesi + 'DOM'].children('.kitapiKasa');
	count = jql.length + 1;
	del = Math.floor(count / 2);
	if (del < 1) return count;

	for (i = 0; i < del; i++) {
		$(jql.get(i)).remove();
	}

	$(jql.get(i)).removeClass('kitapiKasaDiagrafi').html('&#8942;');
	return count - del;
};

Kitapi.kapikiaPush = function(apo, pros, kapikia) {
	var kapikiaStiliDom, count, stiles, xorane, platos;

	if (apo === pros)
	return Kitapi;

	kapikiaStiliDom = Kitapi['kapikia' + apo + '' + pros + 'DOM'];
	count = kapikiaStiliDom.children('.kitapiKapikia').length + 1;

	if (count > Kitapi['maxKapikiaCount' + apo])
	count = Kitapi.kapikiaKontema(apo, pros);

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

	return Kitapi;
};

Kitapi.kapikiaKontema = function(apo, pros) {
	var jql, count, del, i;

	jql = Kitapi['kapikia' + apo + '' + pros + 'DOM'].children('.kitapiKapikia');
	count = jql.length + 1;
	del = Math.floor(count / 2);
	if (del < 1) return count;

	for (i = 0; i < del; i++) {
		$(jql.get(i)).remove();
	}

	$(jql.get(i)).removeClass('kitapiKapikiaDiagrafi').html('&#8942;');
	return count - del;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kitapi.clearDOM = function() {
	Kitapi.trapeziDOM.empty();
	Kitapi.kasa1DOM.empty();
	Kitapi.kapikia13DOM.empty();
	Kitapi.kapikia12DOM.empty();

	Kitapi.kasa2DOM.empty();
	Kitapi.kapikia21DOM.empty();
	Kitapi.kapikia23DOM.empty();

	Kitapi.kasa3DOM.empty();
	Kitapi.kapikia31DOM.empty();
	Kitapi.kapikia32DOM.empty();

	Prefadoros.thesiWalk(function(thesi) {
		delete Kitapi['kasaLast' + thesi];
		delete Kitapi['kasaLast' + thesi + 'DOM'];
	});

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
		Kitapi['onoma' + thesi + 'DOM'].html(Kitapi.onomaGet(thesi));
		Kitapi.kasaPush(thesi, kasa);
		Kitapi['kasaLast' + thesi] = kasa * 10;
	});

	trapezi.trapeziDianomiWalk(function(dianomi) {
		Kitapi.pliromiPush(this);
	}, 1);
return Kitapi;

	var aa, timer;
	aa = 0;
	timer = setInterval(function() {
		var thesi, kasa, apo, pros;

		if (Kitapi.error) {
			clearInterval(timer);
			return;
		}

		thesi = Globals.random(1, 3);
		kasa = Globals.random(-150, 150);
		Kitapi.kasaPush(thesi, kasa);

		apo = Globals.random(1, 3);
		pros = Globals.random(1, 3);
		kapikia = Globals.random(-150, 150);
		Kitapi.kapikiaPush(apo, pros, kapikia);

		apo = Globals.random(1, 3);
		pros = Globals.random(1, 3);
		kapikia = Globals.random(-150, 150);
		Kitapi.kapikiaPush(apo, pros, kapikia);

		if (aa++ > 10) clearInterval(timer);
	}, Globals.random(100, 100));

	return Kitapi;
};

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
		kasa = Globals.random(-150, 150);
		Kitapi.kasaPush(thesi, kasa);

		apo = Globals.random(1, 3);
		pros = Globals.random(1, 3);
		kapikia = Globals.random(-150, 150);
		Kitapi.kapikiaPush(apo, pros, kapikia);

		apo = Globals.random(1, 3);
		pros = Globals.random(1, 3);
		kapikia = Globals.random(-150, 150);
		Kitapi.kapikiaPush(apo, pros, kapikia);

		if (aa++ > 350) clearInterval(timer);
	}, Globals.random(100, 100));

	return Kitapi;
};
