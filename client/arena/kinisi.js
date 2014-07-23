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

	sinedria.
	sinedriaDetachNiofertosDOM().
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	return this;
};

Skiniko.prototype.processKinisiPostSN = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.sinedria.pektis);
	if (!sinedria) return this;

	sinedria.sinedriaCreateDOM();
	this.pektisEntopismosDOM(data.sinedria.pektis);

	// Ο παίκτης μόλις έχει εισέλθει στο καφενείο, επομένως η μόνη περίπτωση
	// να επηρεάζει την τσόχα μας είναι να κατέχει θέση παίκτη σ' αυτήν.

	if (Arena.ego.oxiTrapezi()) return this;
	if (Arena.ego.trapezi.trapeziOxiPektis(data.sinedria.pektis)) return this;

	// Διαπιστώσαμε ότι ο νεοεισερχόμενος παίκτης κατέχει θέση παίκτη στην
	// τσόχα μας.

	Arena.partida.trapeziRefreshDOM();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NS -- Διαγραφή συνεδρίας
//
// Δεδομένα
//
//	login		Είναι το login name του παίκτη τής προς διαγραφήν συνεδρίας.

Skiniko.prototype.processKinisiAnteNS = function(data) {
	var sinedria, dom;

	sinedria = this.skinikoSinedriaGet(data.login);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachNiofertosDOM().
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	return this;
};

Skiniko.prototype.processKinisiPostNS = function(data) {
	this.pektisEntopismosDOM(data.login);
	if (Arena.ego.oxiTrapezi()) return this;

	// Ελέγχω αν ο εξελθών παίκτης κατέχει θέση παίκτη στην
	// τσόχα μας.

	if (Arena.ego.trapezi.trapeziOxiPektis(data.login)) return this;

	// Ο εξελθών παίκτης κατέχει θέση παίκτη στην τσόχα μας.

	Arena.partida.trapeziRefreshDOM();
	return this;
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
		this.pektisTrapeziScroll(true);
		Arena.panelRefresh();
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
		Arena.kafenio.rebelosDOM.prepend(sinedria.rebelosDOM);
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

	if (data.pektis.isEgo())
	trapezi.
	trapeziSimetoxiRefreshDOM().
	trapeziDataRefreshDOM();

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

		if (data.thesiPektiPrin) Arena.partida.pektisRefreshDOM(data.thesiPektiPrin);
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
			if (Arena.ego.isTrapezi(data.trapezi))
			Arena.partida.pektisRefreshDOM(data.thesi);
		}
	}

	// Ελέγχουμε τυχόν νέο τραπέζι στο οποίο τοποθετήθηκε ο παίκτης.

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (!trapezi) {
		Arena.kafenio.rebelosDOM.prepend(sinedria.rebelosDOM);
		if (data.pektis.isEgo()) {
			Arena.partida.refreshDOM();
			Arena.kafenioModeSet();
		}
		return this;
	}

	trapezi.
	trapeziDataRefreshDOM().
	trapeziThesiRefreshDOM(sinedria.sinedriaThesiGet());

	if (data.pektis.isEgo()) this.pektisTrapeziScroll(true);
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

Skiniko.prototype.processKinisiAnteAL = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	data.trapeziPrin = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	return this;
};

Skiniko.prototype.processKinisiPostAL = function(data) {
	this.processKinisiPostET(data);
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
		Client.sound.blioup();
		break;
	default:
		Client.sound.tic();
		break;
	}

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DX -- Αλλαγή διάταξης παικτών
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
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
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RL -- Κυκλική εναλλαγή παικτών
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
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
	var tsoxa, trapezi, sizitisi, xoros;

	// Τα σχόλια συζήτησης που αφορούν στο τραπέζι μεταφέρονται με τα
	// δεδομένα παρτίδας και όχι μέσω κινήσεων.

	if (data.hasOwnProperty('trapezi')) {
		console.error('παρουσιάστηκαν μεταβολές τύπου "SZ" που αφορούν στην παρτίδα');
		return this;
	}

	sizitisi = this.skinikoSizitisiGet(data.kodikos);
	if (!sizitisi) return this;

	if (sizitisi.sizitisiPektisGet().isEgo())
	Arena.sizitisi.proepiskopisiClearDOM();

	sizitisi.sizitisiCreateDOM();
	if (Arena.sizitisi.oxiPagomeni()) Arena.sizitisi.areaDOM.scrollKato();
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

Skiniko.prototype.processKinisiPostPD = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziDataRefreshDOM();
	if (Arena.ego.oxiTrapezi(data.trapezi))
	return this;

	Arena.partida.
	ipolipoRefreshDOM().
	pektisKapikiaRefreshDOM();
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
