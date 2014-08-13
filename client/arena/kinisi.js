/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SN -- Νέα συνεδρία
//
// Δεδομένα
//
//	sinedria	Είναι αντικείμενο που περιέχει τα στοιχεία της προς
//			ένταξιν συνεδρίας.

Skiniko.prototype.processKinisiAnteSN = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.sinedria.pektis);
	if (!sinedria) return this;

	// Αποσύρουμε τυχόν DOM elements της συνεδρίας από τις περιοχές των νεοφερμένων,
	// των περιφερομένων και των θεατών καφενείου και τσόχας.

	sinedria.
	sinedriaDetachNiofertosDOM().
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	return this;
};

Skiniko.prototype.processKinisiPostSN = function(data) {
	var sinedria, thesi;

	sinedria = this.skinikoSinedriaGet(data.sinedria.pektis);
	if (!sinedria) return this;

	sinedria.sinedriaCreateDOM();
	this.pektisEntopismosDOM(data.sinedria.pektis);

	if (Arena.ego.oxiTrapezi())
	return this;

	// Ο παίκτης μόλις έχει εισέλθει στο καφενείο, επομένως η μόνη περίπτωση
	// να επηρεάζει την τσόχα μας είναι να κατέχει θέση παίκτη σ' αυτήν.

	thesi = Arena.ego.trapezi.trapeziThesiPekti(data.sinedria.pektis);
	if (!thesi) return this;

	// Διαπιστώσαμε ότι ο νεοεισερχόμενος παίκτης κατέχει θέση παίκτη στην
	// τσόχα μας.

	Arena.partida.pektisRefreshDOM(thesi);
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NS -- Διαγραφή συνεδρίας
//
// Δεδομένα
//
//	login		Είναι το login name του παίκτη τής προς διαγραφήν συνεδρίας.

Skiniko.prototype.processKinisiAnteNS = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.login);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachNiofertosDOM().
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	return this;
};

Skiniko.prototype.processKinisiPostNS = function(data) {
	var thesi;

	this.pektisEntopismosDOM(data.login);
	if (Arena.ego.oxiTrapezi()) return this;

	// Ελέγχω αν ο εξελθών παίκτης κατέχει θέση παίκτη στην
	// τσόχα μας.

	thesi = Arena.ego.trapezi.trapeziThesiPekti(data.login);
	if (!thesi) return this;

	// Ο εξελθών παίκτης κατέχει θέση παίκτη στην τσόχα μας.

	Arena.partida.pektisRefreshDOM(thesi);
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SL -- Χαιρετισμός / Ανανέωση συνεδρίας
//
// Δεδομένα
//
//	login		Είναι το login name του παίκτη τής προς διαγραφήν συνεδρίας.

Skiniko.prototype.processKinisiPostSL = function(data) {
	var sinedria, trapezi, thesi, jql;

	sinedria = this.skinikoSinedriaGet(data.login);
	if (!sinedria) return this;

	// Θα μαζέψουμε όλα τα κουτάκια του παίκτη.

	jql = $();

	// Ξεκινάμε με τυχόν εμφάνιση του παίκτη στους περιφερόμενους.

	if (sinedria.hasOwnProperty('rebelosDOM'))
	jql = jql.add(sinedria.rebelosDOM);

	// Συνεχίζουμε με όλες τις εμφανίσεις του παίκτη ως παίκτη σε
	// διάφορα τραπέζια του καφενείου.

	this.skinikoThesiWalk(function(thesi) {
		if (this.trapeziPektisGet(thesi) == data.login)
		jql = jql.add(this.thesiDOM[thesi]);
	});

	// Συνεχίζουμε με τυχόν εμφανίσεις του παίκτη ως θεατή σε τραπέζια
	// του καφενείου.

	if (sinedria.hasOwnProperty('theatisDOM'))
	jql = jql.add(sinedria.theatisDOM);

	// Συνεχίζουμε με τυχόν εμφανίσεις του παίκτη ως νεοφερμένου στην
	// περιοχή της παρτίδας.

	if (sinedria.hasOwnProperty('niofertosDOM'))
	jql = jql.add(sinedria.niofertosDOM);

	// Συνεχίζουμε με τυχόν εμφανίσεις του παίκτη ως παίκτη στην τσόχα,
	// στην περιοχή της παρτίδας.

	if (Arena.ego.isTrapezi(trapezi)) {
		thesi = Arena.ego.trapezi.trapeziThesiPekti(data.login);
		if (thesi) jql = jql.add(Arena.partida['pektis' + thesi + 'DOM'].find('.tsoxaPektisMain'));
	}

	// Συνεχίζουμε με τυχόν εμφανίσεις του παίκτη ως θεατή στην τσόχα,
	// στην περιοχή της παρτίδας.

	if (sinedria.hasOwnProperty('tsoxaTheatisDOM'))
	jql = jql.add(sinedria.tsoxaTheatisDOM);

	// Σε όλα τα κουτάκια που αφορούν τον παίκτη εφαρμόζουμε μέθοδο που
	// θα κάνει εμφανή την ανανέωση της συνεδρίας του παίκτη.

	jql.sinedriaSalute();
	return this;
};

// Η jQuery μέθοδος "salute" εφαρμόζεται σε κουτάκια παίκτη και σκοπό έχει να κάνει
// εμφανή την ανανέωση της συνεδρίας αλλάζοντας για λίγο το χρώμα του border.

jQuery.fn.sinedriaSalute = function() {
	return this.each(function() {
		var borderColor;

		borderColor = $(this).css('borderColor');
		if (!borderColor) return;

		$(this).finish().css('borderColor', '#FF9900').animate({
			borderColor: borderColor,
		}, 1000, function() {
			// Πρέπει να αφαιρεθεί το border color, αλλιώς επικρατεί λόγω
			// στιλ και δεν φαίνονται τυχόν επόμενες αλλαγές από κλάσεις.

			$(this).css('borderColor', '');
		});
	});
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TR -- Νέο τραπέζι
//
// Δεδομένα
//
//	trapezi		Τα στοιχεία του τραπεζιού (object).
//
// Επιπρόσθετα δεδομένα
//
//	trapeziPrin	Προηγούμενο τραπέζι παίκτη (object).

Skiniko.prototype.processKinisiAnteTR = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.trapezi.pektis1);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	// Παράγουμε ήχο μόνο στην περίπτωση που το τραπέζι δημιουργήθηκε
	// από άλλον παίκτη και όχι από εμάς, καθώς όταν είμαστε εμείς που
	// δημιουργούμε το τραπέζι παραλαμβάνουμε και πρόσκληση η οποία θα
	// δημιουργήσει παρόμοιο ηχητικό σήμα.

	if (data.trapezi.pektis1.oxiEgo())
	Client.sound.trapeziNeo();

	data.trapeziPrin = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	return this;
};

Skiniko.prototype.processKinisiPostTR = function(data) {
	var trapezi, pektis, thesi;

	if (data.trapeziPrin) {
		data.trapeziPrin.
		trapeziSimetoxiRefreshDOM().
		trapeziDataRefreshDOM();
	}

	trapezi = this.skinikoTrapeziGet(data.trapezi.kodikos);
	if (!trapezi) return this;

	trapezi.trapeziCreateDOM();
	pektis = data.trapezi.pektis1;
	this.pektisEntopismosDOM(pektis);

	if (pektis.isEgo()) {
		Arena.
		panelRefresh().
		kafenioScrollTop().
		kitapi.klisimo();

		if (Arena.ego.isTrapezi())
		Arena.partida.refreshDOM();
		return this;
	}

	if (Arena.ego.oxiTrapezi())
	return this;

	// Αν ο δημιουργός μετείχε ως θεατής στην τσόχα μας, έχουν γίνει
	// ήδη όλες οι απαραίτητες ενέργειες στο ante. Μας ενδιαφέρει
	// μόνο η περίπτωση κατά την οποία συμμετέχει ως παίκτης στην
	// τσόχα μας.

	thesi = Arena.ego.trapezi.trapeziThesiPekti(pektis);
	if (thesi) Arena.partida.pektisDataRefreshDOM(thesi);

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ET -- Επιλογή τραπεζιού
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	trapezi		Κωδικός τραπεζιού.
//
// Επιπρόσθετα δεδομένα
//
//	trapeziPrin	Προηγούμενο τραπέζι παίκτη (object).
//	thesiPektiPrin	Θέση του παίκτη στο προηγούμενο τραπέζι εφόσον ήταν παίκτης.
//	telefteos	Λίστα καθημένων στο τραπέζι επιλογής.

Skiniko.prototype.processKinisiAnteET = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	data.trapeziPrin = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (data.trapeziPrin) data.thesiPektiPrin = data.trapeziPrin.trapeziThesiPekti(data.pektis);

	return this;
};

Skiniko.prototype.processKinisiPostET = function(data) {
	var sinedria, trapezi, thesi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	// Ενημερώνουμε το χρώμα του τραπεζιού αποχώρησης στο καφενείο,
	// επανεμφανίζουμε την πινακίδα και αν ο παίκτης συμμετείχε ως
	// παίκτης, επανεμφανίζουμε τη θέση την οποία κατείχε.

	if (data.trapeziPrin) {
		if (data.pektis.isEgo()) {
			data.trapeziPrin.
			trapeziSimetoxiRefreshDOM().
			trapeziDataRefreshDOM();
		}

		if (data.thesiPrin) {
			data.trapeziPrin.trapeziThesiRefresDOM(data.thesiPrin);
		}
	}

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) {
		Arena.rebelosDOM.prepend(sinedria.rebelosDOM);
		if (data.pektis.isEgo()) Arena.kitapi.klisimo();
		return this;
	}

	// Από τη στιγμή που ο παίκτης έχει επιλέξει τραπέζι, θα πρέπει
	// η θέση του στο τραπέζι να είναι καθορισμένη, είτε συμμετέχει
	// ως παίκτης, είτε παρακολουθεί ως θεατής.

	thesi = sinedria.sinedriaThesiGet();
	if (!thesi) return this;

	// Ενημερώνουμε το χρώμα του τραπεζιού στο καφενείο ανάλογα με το
	// αν ο παίκτης συμμετέχει ως παίκτης, ή παρακολουθεί ως θεατής και
	// επανεμφανίζουμε την πινακίδα ώστε να είναι εμφανές το τρέχον
	// τραπέζι του παίκτη.

	if (data.pektis.isEgo()) {
		trapezi.
		trapeziSimetoxiRefreshDOM().
		trapeziDataRefreshDOM();
		Arena.kitapi.refresh();
	}

	// Αν ο παίκτης παρακολουθεί πλέον ως θεατής σε κάποιο τραπέζι, πρέπει
	// να τον εντάξουμε στο μπλοκ των θεατών, αλλιώς συμμετέχει ως παίκτης
	// και πρέπει να επαναδιαμορφώσουμε τη συγκεκριμένη θέση.

	if (sinedria.sinedriaIsTheatis()) trapezi.theatisDOM.prepend(sinedria.theatisDOM);
	else trapezi.trapeziThesiRefreshDOM(thesi);

	// Αν ο χρήστης δεν είναι σε κάποιο τραπέζι δεν χρειάζεται να
	// κάνουμε καμιά περαιτέρω ενέργεια, το DOM του καφενείου έχει
	// ήδη ενημερωθεί.

	if (Arena.ego.oxiTrapezi())
	return this;

	// Αν ο παίκτης που επιλέγει τραπέζι ήταν πριν στο τραπέζι μας
	// ίσως χρειαστεί να αλλάξουμε κάτι στο τραπέζι.

	if (data.trapeziPrin && Arena.ego.isTrapezi(data.trapeziPrin)) {
		// Αν ο παίκτης που επιλέγει τραπέζι ήταν παίκτης στο
		// τραπέζι μας, τότε πρέπει να επανασχεδιάσουμε την
		// περιοχή της συγκεκριμένης θέσης. Αν δεν μετείχε ως
		// παίκτης αλλά ως θεατής, δεν χρειάζονται περαιτέρω
		// ενέργειες.

		if (data.thesiPektiPrin) {
			Arena.partida.pektisRefreshDOM(data.thesiPektiPrin);
			Client.sound.blioup();
		}
	}

	// Αν ο παίκτης δεν έχει επιλέξει το δικό μας τραπέζι δεν χρειάζεται
	// να κάνουμε καμία επιπλέον ενέργεια.

	if (Arena.ego.oxiTrapezi(trapezi))
	return this;

	// Ο παίκτης έχει επιλέξει το δικό μας τραπέζι. Ελέγχουμε πρώτα την
	// περίπτωση να είμαστε εμείς ο παίκτης που επιλέγει τραπέζι.

	if (data.pektis.isEgo()) {
		Arena.partida.refreshDOM(true);
		Arena.panelRefresh();
		Arena.partidaModeSet();
		return this;
	}

	// Αν ο παίκτης που επιλέγει τραπέζι τοποθετήθηκε ως θεατής στο δικό μας
	// τραπέζι, τότε πρέπει να τον εμφανίσουμε στους θεατές.

	if (sinedria.sinedriaIsTheatis()) {
		Arena.partida.theatisPushDOM(sinedria);
		return this;
	}

	// Φαίνεται ότι ο παίκτης που επέλεξε τραπέζι τοποθετήθηκε ως παίκτης στο
	// δικό μας τραπέζι.

	Arena.partida.pektisRefreshDOM(thesi);
	Arena.kitapi.refresh();
	if (data.telefteos && (!data.telefteos[thesi]))
	Client.sound.doorbell();

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RT -- Έξοδος από τραπέζι
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//
// Επιπρόσθετα δεδομένα
//
//	trapezi		Το τραπέζι (object).
//	thesi		Θέση παίκτη εφόσον παίκτης.

Skiniko.prototype.processKinisiAnteRT = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	trapezi = sinedria.sinedriaTrapeziGet();
	if (!trapezi) return this;

	trapezi = this.skinikoTrapeziGet(trapezi);
	if (!trapezi) return this;

	data.trapezi = trapezi;
	if (sinedria.sinedriaSimetoxiGet().isPektis())
	data.thesi = sinedria.sinedriaThesiGet();

	return this;
};

Skiniko.prototype.processKinisiPostRT = function(data) {
	var sinedria, trapezi;

	Arena.panelRefresh();
	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	// Επαναδιαμορφώνουμε κάποια στοιχεία του τραπεζιού από το οποίο
	// έγινε έξοδος.

	if (data.trapezi) {
		data.trapezi.
		trapeziSimetoxiRefreshDOM().
		trapeziDataRefreshDOM();

		if (data.thesi) {
			data.trapezi.
			trapeziThesiRefreshDOM(data.thesi);
			if (Arena.ego.isTrapezi(data.trapezi)) {
				Arena.partida.pektisRefreshDOM(data.thesi);
				if (data.pektis.oxiEgo()) Client.sound.blioup();
			}
		}
	}

	// Ελέγχουμε τυχόν νέο τραπέζι στο οποίο τοποθετήθηκε ο παίκτης.

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (!trapezi) {
		Arena.rebelosDOM.prepend(sinedria.rebelosDOM);
		if (data.pektis.isEgo()) {
			Arena.kitapi.klisimo();
			Arena.partida.refreshDOM();
			Arena.kafenioModeSet();
			Arena.kafenioScrollTop();
		}
		return this;
	}

	trapezi.
	trapeziDataRefreshDOM().
	trapeziThesiRefreshDOM(sinedria.sinedriaThesiGet());

	if (data.pektis.oxiEgo()) return this;

	Arena.kitapi.refresh();
	this.pektisTrapeziScroll(true);
	Arena.partidaModeSet();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DL -- Πρόσκληση
//
// Δεδομένα
//
//	kodikos		Κωδικός πρόσκλησης.
//
// Πρόσθετα δεδομένα
//
//	pros		Login name προσκεκλημένου.
//	trapezi		Κωδικός τραπεζιού.

Skiniko.prototype.processKinisiAnteDL = function(data) {
	var prosklisi;

	prosklisi = this.skinikoProsklisiGet(data.kodikos);
	if (!prosklisi) return this;

	data.pros = prosklisi.prosklisiProsGet();
	data.trapezi = this.skinikoTrapeziGet(prosklisi.prosklisiTrapeziGet());
	prosklisi.prosklisiDeleteDOM();
	return this;
};

Skiniko.prototype.processKinisiPostDL = function(data) {
	Arena.panelRefresh();

	if (!data.pros) return this;
	if (!data.trapezi) return this;

	data.trapezi.trapeziDataRefreshDOM();
	if (data.pros.oxiEgo()) return this;
	if (Arena.ego.oxiTrapezi(data.trapezi)) return this;

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PL -- Πρόσκληση
//
// Δεδομένα
//
//	kodikos		Κωδικός πρόσκλησης.
//	trapezi		Κωδικός τραπεζιού.
//	apo		Login name αποσοτολέα.
//	pros		Login name παραλήπτη.

// Εντοπίζουμε τυχόν προηγούμενη παρόμοια πρόσκληση, δηλαδή πρόσκληση από τον
// ίδιο αποστολέα, προς τον ίδιο παραλήπτη και για το ίδιο τραπέζι. Αν βρεθεί
// τέτοια πρόσκληση τη διαγράφουμε.

Skiniko.prototype.processKinisiAntePL = function(data) {
	var kodikos, prosklisi;

	for (kodikos in this.prosklisi) {
		prosklisi = this.skinikoProsklisiGet(kodikos);
		if (prosklisi.prosklisiTrapeziGet() != data.trapezi) continue;
		if (prosklisi.prosklisiApoGet() != data.apo) continue;
		if (prosklisi.prosklisiProsGet() != data.pros) continue;

		// Η ανά χείρας πρόσκληση είναι παρόμοια με την εισερχόμενη,
		// επομένως τη διαγράφουμε από το DOM.

		prosklisi.prosklisiGetDOM().remove();
	}

	return this;
};

// Η νέα πρόσκληση έχει ενταχθεί στο σκηνικό και το μόνο που μένει είναι να
// την εμφανίσουμε εντάσσοντάς την στο DOM.

Skiniko.prototype.processKinisiPostPL = function(data) {
	var prosklisi, apo, trapezi;

	prosklisi = this.skinikoProsklisiGet(data.kodikos);
	if (!prosklisi) return this;

	apo = prosklisi.prosklisiApoGet();
	if (apo.isEgo()) Client.sound.klak();
	else if (Arena.ego.isFilos(apo)) Client.sound.sfirigma();
	else Client.sound.psit();

	Arena.panelRefresh();
	prosklisi.prosklisiCreateDOM();

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziDataRefreshDOM();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AL -- Αποδοχή πρόσκλησης
//
// Δεδομένα
//
//	pektis		Login name προσκεκλημένου.
//	trapezi		Κωδικός τραπεζιού.
//	thesi		Θέση παίκτη/θεατή.
//	simetoxi	Παίκτης ή θεατής.
//
// Επιπρόσθετα δεδομένα
//
//	trapeziPrin	Προηγούμενο τραπέζι παίκτη.
//	oxiPektisPrin	Δείχνει αν πριν τη αποδοχή δεν ήταν παίκτης.
//	telefteos	Λίστα καθημένων πριν την αποδοχή.

Skiniko.prototype.processKinisiAnteAL = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	data.trapeziPrin = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	data.oxiPektisPrin = sinedria.sinedriaOxiPektis();

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	data.telefteos = {};
	trapezi.trapeziThesiWalk(function(thesi) {
		data.telefteos[thesi] = trapezi.trapeziPektisGet(thesi);
	});

	return this;
};

Skiniko.prototype.processKinisiPostAL = function(data) {
	var sinderia, panelOmada;

	this.processKinisiPostET(data);

	if (data.pektis.oxiEgo())
	return this;

	// Αν ο παίκτης που αποδέχεται την πρόσκληση δεν ήταν πριν παίκτης στο
	// ίδιο ή σε άλλο τραπέζι, ενώ μετά την αποδοχή έχει καταστεί παίκτης,
	// τότε επαναφέρουμε το control panel στη βασική ομάδα εργαλείων.

	if (data.oxiPektisPrin) {
		sinedria = this.skinikoSinedriaGet(data.pektis);
		if (!sinedria) return this;
		panelOmada = sinedria.sinedriaIsPektis() ? 1 : Arena.cpanel.bpanelOmadaGet();
	}

	// Ξανασχηματίζουμε τώρα το control panel καθώς ο παίκτης που απεδέχθη
	// την πρόσκληση μπορεί να άλλαξε ρόλο, οπότε κάποια πλήκτρα θα πρέπει
	// να ενεργοποιηθούν και κάποια άλλα να ενεργοποιηθούν.

	Arena.panelRefresh(panelOmada);
	this.pektisTrapeziScroll(true);

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PT -- Από παίκτης θεατής
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	trapezi		Κωδικός τραπεζιού.
//	thesi		Θέση θέασης.

Skiniko.prototype.processKinisiPostPT = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	trapezi = sinedria.sinedriaTrapeziGet();
	if (!trapezi) return this;

	trapezi = this.skinikoTrapeziGet(trapezi);
	if (!trapezi) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	trapezi.
	trapeziThesiRefreshDOM().
	trapeziSimetoxiRefreshDOM();
	trapezi.theatisDOM.prepend(sinedria.theatisDOM);

	Arena.panelRefresh();

	if (Arena.ego.oxiTrapezi(trapezi))
	return this;

	// Εάν είμαστε εμείς που κάνουμε την αλλαγή, τότε επαναδιαμορφώνουμε
	// εκ νέου το DOM της παρτίδας.

	if (data.pektis.isEgo()) {
		Arena.partida.refreshDOM();
		return this;
	}

	Arena.partida.
	pektisRefreshDOM(data.thesi).
	theatisPushDOM(sinedria);

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TS -- Παράμετρος τραπεζιού
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	trapezi		Κωδικός τραπεζιού.
//	param		Ονομασία παραμέτρου.
//	timi		Τιμή παραμέτρου.

Skiniko.prototype.processKinisiPostTS = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziRefreshDOM();
	Arena.panelRefresh();
	if (Arena.ego.oxiTrapezi(data.trapezi)) return this;

	Arena.partida.refreshDOM();

	switch (data.param) {
	case 'ΚΑΣΑ':
		Arena.kitapi.refresh();
		Client.sound.blioup();
		break;
	case 'ΠΡΙΒΕ':
		trapezi.trapeziDataRefreshDOM();
		Client.sound.tic();
		break;
	default:
		Client.sound.tic();
		break;
	}

	Arena.partida.markAlagiPios(trapezi, data);
	return this;
};

Arena.partida.markAlagiIcon = {
	'ΚΑΣΑ':			'kasa.png',
	'ΑΣΟΙ,ΟΧΙ':		'asoiOff.png',
	'ΑΣΟΙ':			'asoiOn.png',
	'ΠΑΣΟ,ΟΧΙ':		'pasoOff.png',
	'ΠΑΣΟ':			'pasoOn.png',
	'ΤΕΛΕΙΩΜΑ,ΑΝΙΣΟΡΡΟΠΟ':	'postel/anisoropo.png',
	'ΤΕΛΕΙΩΜΑ,ΔΙΚΑΙΟ':	'postel/dikeo.png',
	'ΤΕΛΕΙΩΜΑ':		'postel/kanoniko.png',
	'ΠΡΙΒΕ,ΟΧΙ':		'dimosio.png',
	'ΠΡΙΒΕ':		'prive.png',
	'ΦΙΛΙΚΗ,ΟΧΙ':		'agonistiki.png',
	'ΦΙΛΙΚΗ':		'filiki.png',
	'ΑΝΟΙΚΤΟ,ΟΧΙ':		'klisto.png',
	'ΑΝΟΙΚΤΟ':		'anikto.png',
	'ΙΔΙΟΚΤΗΤΟ,ΟΧΙ':	'elefthero.png',
	'ΙΔΙΟΚΤΗΤΟ':		'idioktito.png',
	'ΔΙΑΤΑΞΗ':		'diataxi.png',
	'ΡΟΛΟΙ':		'roloi.png',
	'ΑΠΟΔΟΧΗ,ΝΑΙ':		'apodoxi.png',
	'ΑΠΟΔΟΧΗ,ΟΧΙ':		'ixodopa.png',
};

// Η function "markAlagiPios" δέχεται το τραπέζι (object) και τα δεδομένα κίνησης
// (list) και κάνει εμφανές το ποιος παίκτης προκάλεσε την αλλαγή κάποιας παραμέτρου
// του τραπεζιού, π.χ. αλλαγή κάσας, αλλαγή καθεστώτος άσων κλπ.
//
// Στην παράμετρο των δεδομένων της αλλαγής (data) ελέγχονται τα εξής στοιχεία:
//
//	thesi		Η θέση του παίκτη που προκάλεσε την αλλαγή.
//	pektis		Το login name του παίκτη που προκάλεσε την αλλαγή.
//	param		Η ονομασία της παραμέτρου που τίθεται, π.χ. "ΑΣΟΙ"
//	timi		Η τιμή της παραμέτρου, π.χ. "ΝΑΙ"
//
// Αν η θέση είναι συμπληρωμένη η παράμετρος "pektis" αγνοείται, αλλιώς υπολογίζεται
// η θέση του παίκτη από το login name του παίκτη.
// Επίσης, σε κάποιες περιπτώσεις δεν πρόκειται ακριβώς για αλλαγή παραμέτρου, αλλά
// για κάποια άλλη σημαντική αλλαγή που εφαρμόζεται στο τραπέζι, π.χ. αλλαγή διάταξης,
// αποδοχή όρων κλπ. Σ' αυτές τις περιπτώσεις περνάμε ως τρίτη παράμετρο μια κωδική
// ονομασία της αλλαγής, όπως "ΔΙΑΤΑΞΗ", "ΡΟΛΟΙ", "ΑΠΟΔΟΧΗ,ΝΑΙ", "ΑΠΟΔΟΧΗ,ΟΧΙ" κλπ.

Arena.partida.markAlagiPios = function(trapezi, data, param) {
	var thesi, idx, icon, iseht, tdom, dom;

	thesi = parseInt(data.thesi);
	if (!thesi) thesi = trapezi.trapeziThesiPekti(data.pektis);
	if (!thesi) return;

	if (param === undefined) param = data.param;
	idx = param + ',' + data.timi;
	icon = Arena.partida.markAlagiIcon[idx];
	if (!icon) icon = Arena.partida.markAlagiIcon[param];
	if (!icon) return;

	iseht = Arena.ego.thesiMap(thesi);
	tdom = Arena.partida['pektisMain' + iseht + 'DOM'];
	tdom.find('.tsoxaPektisOptionIcon').remove();
	tdom.
	append(dom = $('<img>').addClass('tsoxaPektisOptionIcon').attr('src', 'ikona/panel/' + icon));
	dom.finish().delay(2000).fadeOut(600, function() {
		$(this).remove();
	});

	trapezi.tsoxaDOM.find('.trapeziPektisOptionIcon').remove();
	trapezi.tsoxaDOM.
	append(dom = $('<img>').addClass('trapeziPektisOptionIcon trapeziPektisOptionIcon' + thesi).
	attr('src', 'ikona/panel/' + icon));
	dom.finish().delay(2000).fadeOut(600, function() {
		$(this).remove();
	});
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DX -- Αλλαγή διάταξης παικτών
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name του παίκτη που κάνει την αλλαγή.
//	h1		Θέση παίκτη.
//	p1		Παίκτης για τη θέση h1.
//	h2		Θέση παίκτη.
//	p2		Παίκτης για τη θέση h2.

Skiniko.prototype.processKinisiPostDX = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziThesiRefreshDOM();
	Arena.panelRefresh();
	if (Arena.ego.oxiTrapezi(data.trapezi)) return this;

	Arena.partida.trapeziRefreshDOM();
	Client.sound.tic();
	Arena.partida.markAlagiPios(trapezi, data, 'ΔΙΑΤΑΞΗ');

	if (Arena.kitapi.isAnikto())
	Arena.kitapi.win.Kitapi.pektisRefreshDOM();

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RL -- Κυκλική εναλλαγή παικτών
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name του παίκτη που κάνει την αλλαγή.
//	p1		Παίκτης για τη θέση 1.
//	a1		Αποδοχή για τη θέση 1.
//	p2		Παίκτης για τη θέση 2.
//	a2		Αποδοχή για τη θέση 2.
//	p3		Παίκτης για τη θέση 3.
//	a3		Αποδοχή για τη θέση 3.

Skiniko.prototype.processKinisiPostRL = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziThesiRefreshDOM();
	Arena.panelRefresh();
	if (Arena.ego.oxiTrapezi(data.trapezi)) return this;

	Arena.partida.trapeziRefreshDOM();
	Client.sound.tic();
	Arena.partida.markAlagiPios(trapezi, data, 'ΡΟΛΟΙ');

	if (Arena.kitapi.isAnikto())
	Arena.kitapi.win.Kitapi.pektisRefreshDOM();

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TT -- Αλλαγή θέσης θέασης
//
// Δεδομένα
//
//	pektis		Login name θεατή.
//	thesi		Νέα θέση θέασης.

Skiniko.prototype.processKinisiPostTT = function(data) {
	if (Arena.ego.oxiTrapezi()) return this;
	if (data.pektis.oxiEgo()) return this;

	Arena.partida.trapeziRefreshDOM();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SZ -- Σχόλιο συζήτησης
//
// Δεδομένα
//
//	kodikos		Κωδικός αριθμός σχολίου.
//	pektis		Login name παίκτη που κάνει το σχόλιο.
//	trapezi		Κωδικός τραπεζιού συζήτησης.
//	sxolio		Το σχόλιο αυτό καθαυτό.

Skiniko.prototype.processKinisiPostSZ = function(data) {
	var sizitisi, pektis;

	// Τα σχόλια συζήτησης που αφορούν στο τραπέζι μεταφέρονται με τα
	// δεδομένα παρτίδας και όχι μέσω κινήσεων.

	if (data.hasOwnProperty('trapezi')) {
		console.error('παρουσιάστηκαν μεταβολές τύπου "SZ" που αφορούν στην παρτίδα');
		return this;
	}

	sizitisi = this.skinikoSizitisiGet(data.kodikos);
	if (!sizitisi) return this;

	pektis = sizitisi.sizitisiPektisGet();
	if (pektis.isEgo()) Arena.sizitisi.proepiskopisiClearDOM();
	else Arena.sizitisi.moliviTelos(pektis);

	sizitisi.sizitisiCreateDOM();
	Arena.sizitisi.scrollKato();
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AX -- Αποδοχή/Επαναδιαπραγμάτευση όρων
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	thesi		Θέση παίκτη που εκτελεί την ενέργεια.
//	apodoxi		ΝΑΙ = Αποδοχή, ΟΧΙ = Επαναδιαπραγμάτευση.

Skiniko.prototype.processKinisiPostAX = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziThesiRefreshDOM();
	Arena.panelRefresh();
	if (Arena.ego.oxiTrapezi(data.trapezi)) return this;

	Arena.partida.refreshDOM();
	Client.sound.tic();
	Arena.partida.markAlagiPios(trapezi, data, 'ΑΠΟΔΟΧΗ,' + data.apodoxi);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RC -- Reject claim
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	ecount		Πλήθος ενεργειών πριν το claim.

Skiniko.prototype.processKinisiPostRC = function(data) {
	if (Arena.ego.oxiTrapezi()) return this;

	Arena.partida.trapeziRefreshDOM();
	Arena.panelRefresh();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// EG -- Ενέργεια
//
// Δεδομένα
//
//	kodikos		Κωδικός ενέργειας.
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	pektis		Θέση ενεργούντος παίκτη.
//	data		Data ενέργειας.
//
// Οι ενέργειες μεταφέρονται με τα δεδομένα τσόχας και όχι μέσω κινήσεων,
// επομένως οποιαδήποτε εμφάνιση τέτοιου είδους μεταβολής σηματοδοτεί
// προγραμματιστικό σφάλμα.

Skiniko.prototype.processKinisiPostEG = function(data) {
	console.error('παρουσιάστηκαν μεταβολές τύπου "EG"');
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PD -- Πληρωμή διανομής
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	kasa1		Ποσό κάσας παίκτη θέσης 1.
//	metrita1	Μετρητά παίκτη θέσης 1.
//	kasa2		Ποσό κάσας παίκτη θέσης 2.
//	metrita2	Μετρητά παίκτη θέσης 2.
//	kasa3		Ποσό κάσας παίκτη θέσης 3.
//	metrita3	Μετρητά παίκτη θέσης 3.
//
// Επιπρόσθετα δεδομένα
//
//	kasaPrin	Υπόλοιπο κάσας πριν την πληρωμή.

Skiniko.prototype.processKinisiAntePD = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	data.kasaPrin = trapezi.trapeziIpolipoGet();
	return this;
}

Skiniko.prototype.processKinisiPostPD = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziDataRefreshDOM();
	if (Arena.ego.oxiTrapezi(data.trapezi))
	return this;

	trapezi.telefteaPliromiSet(data);
	Arena.partida.
	ipolipoRefreshDOM().
	pliromiRefreshDOM().
	pektisKapikiaRefreshDOM();
	Arena.kitapi.pliromiPush(data);

	if ((data.kasaPrin > 0) && (trapezi.trapeziIpolipoGet() <= 0))
	Client.sound.applause();

	Arena.partida.pliromiIconDOM.data('emfanisPlirom', true);
	$('.tsoxaPektisPliromi').finish().fadeIn(100);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DN -- Νέα διανομή
//
// Δεδομένα
//
// Προς το παρόν δεν χρησιμοποιούμε τα δεδομένα της διανομής.

Skiniko.prototype.processKinisiPostDN = function(data) {
	$('.tsoxaPektisPliromi').finish().fadeOut(600);
	Arena.partida.flags.telepli = false;
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AK -- Ακύρωση κινήσεων
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//
// Προαιρετικά
//
//	pektis		Login name του παίκτη
//	ecount		Πλήθος ενεργειών που απομένουν.

Skiniko.prototype.processKinisiPostAK = function(data) {
	if (Arena.ego.oxiTrapezi()) return this;

	if (data.hasOwnProperty('ecount')) Arena.partida.trapeziRefreshDOM();
	else Arena.partida.dataKatoRefreshDOM();

	Arena.panelRefresh();
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// KN -- Κόρνα
//
// Δεδομένα
//
//	pektis		Login name του παίκτη.
//	trapezi		Κωδικός τραπεζιού.

Skiniko.prototype.processKinisiPostKN = function(data) {
	var trapezi, sizitisi;

	// Αν δεν εμπλεκόμαστε στο τραπέζι στο οποίο ήχησε η κόρνα, τότε κακώς
	// λάβαμε τη συγκεκριμένη κίνηση εκτός και αν κατέχουμε θέση παίκτη στο
	// τραπέζι και αλητεύουμε σε άλλο τραπέζι, πράγμα πολύ πιθανό. Σ' αυτή
	// την περίπτωση θα πάρουμε ηχητικό σήμα και σχετικό μήνυμα όπου κι αν
	// βρισκόμαστε.

	if (Arena.ego.oxiTrapezi(data.trapezi)) {
		trapezi = Arena.skiniko.skinikoTrapeziGet(data.trapezi);
		if (!trapezi) return this;
		if (!trapezi.trapeziThesiPekti(Client.session.pektis)) return this;
		Client.sound.play('korna.ogg');
		Client.fyi.ekato('Ο παίκτης <b>' + data.pektis +
			'</b> αδημονεί και κορνάρει στο τραπέζι <b>' + data.trapezi + '</b>');
		return this;
	}

	// Εμπλεκόμαστε στο τραπέζι είτε ως παίκτες είτε ως θεατές. Η κόρνα θα εμφανιστεί
	// στο χώρο συζήτησης και θα ηχήσει στον υπολογιστή μας.

	sizitisi = new Sizitisi({
		pektis: data.pektis,
		trapezi: data.trapezi,
		sxolio: 'KN',
	});

	sizitisi.sizitisiCreateDOM();
	Arena.sizitisi.scrollKato();

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MV -- Μολύβι έναρξη.
//
// Δεδομένα
//
//	pektis		Login name του παίκτη.
//	trapezi		Κωδικός τραπεζιού.
//	kafenio		Δείχνει αν το μολύβι αφορά στο καφενείο.

Skiniko.prototype.processKinisiPostMV = function(data) {
	var sizitisi;

	sizitisi = new Sizitisi({
		pektis: data.pektis,
		sxolio: data.kafenio ? 'MVK' : 'MVT',
	});

	// Αν το μολύβι έχει εκκινήσει από το καφενείο, τότε θα πρέπει
	// να φανεί στη συζήτηση του καφενείου.

	if (data.kafenio) {
		sizitisi.sxolio = 'MVK';

		// Αν βρισκόμαστε σε mode παρτίδας και βρισκόμαστε στο
		// ίδιο τραπέζι με τον παίκτη που εκκίνησε το μολύβι,
		// τότε προτιμούμε την εμφάνιση του μολυβιού στη συζήτηση
		// του τραπεζιού.

		if (Arena.partidaMode() && Arena.ego.isTrapezi(data.trapezi))
		sizitisi.trapezi = data.trapezi;
	}

	// Αλλιώς το μολύβι έχει ξεκινήσει σε mode τραπεζιού. Σ' αυτή την
	// περίπτωση θα εμφανίσουμε μολύβι παρτίδας ση συζήτηση της παρτίδας
	// εφόσον βρσικόμαστε στο ίδιο τραπέζι.

	else if (Arena.ego.isTrapezi(data.trapezi)) {
		sizitisi.trapezi = data.trapezi;
		sizitisi.sxolio = 'MVT';
	}

	// Το μολύβι είναι μολύβι παρτίδας και έχει εκκινήσει σε άλλο τραπέζι
	// από αυτό που βρισκόμαστε τώρα, επομένως δεν χρειάζεται να κάνουμε
	// καμια περαιτέρω ενέργεια.

	else
	return this;

	sizitisi.sizitisiCreateDOM();
	Arena.sizitisi.scrollKato();

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// VM -- Μολύβι τέλος.
//
// Δεδομένα
//
//	pektis		Login name του παίκτη.
//	trapezi		Κωδικός τραπεζιού.

Skiniko.prototype.processKinisiPostVM = function(data) {
	Arena.sizitisi.moliviTelos(data.pektis);
	return this;
};
