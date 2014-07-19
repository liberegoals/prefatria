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

	// Ελέγχω αν ο εξελθών παίκτης κατέχει θέση παίκτη στην
	// τσόχα μας.

	if (Arena.ego.trapezi.trapeziOxiPektis(data.login)) return this;

	// Ο εξελθών παίκτης κατέχει θέση παίκτη στην τσόχα μας.

	Arena.partida.trapeziRefreshDOM();
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

Skiniko.prototype.processKinisiAnteET = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	trapeziPrin = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	return this;
};

Skiniko.prototype.processKinisiPostET = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	if (trapeziPrin) {
		trapeziPrin.
		trapeziSimetoxiRefreshDOM().
		trapeziDataRefreshDOM();
	}

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) {
		Arena.kafenio.rebelosDOM.prepend(sinedria.rebelosDOM);
		return this;
	}

	trapezi.
	trapeziSimetoxiRefreshDOM().
	trapeziDataRefreshDOM();

	if (sinedria.sinedriaIsTheatis())
	trapezi.theatisDOM.prepend(sinedria.theatisDOM);

	if (Arena.ego.isTrapezi(trapezi))
	Arena.partida.refreshDOM(true);

	Arena.partidaModeSet();
	Arena.panelRefresh();
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

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	Arena.panelRefresh();
	if (data.trapezi) {
		data.trapezi.
		trapeziSimetoxiRefreshDOM().
		trapeziDataRefreshDOM().
		trapeziThesiRefreshDOM(data.thesi);
	}

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (!trapezi) {
		Arena.kafenio.rebelosDOM.prepend(sinedria.rebelosDOM);
		Arena.kafenioModeSet();
		return this;
	}

	trapezi.
	trapeziSimetoxiRefreshDOM().
	trapeziDataRefreshDOM();
	if (sinedria.sinedriaIsPektis()) trapezi.trapeziThesiRefreshDOM(sinedria.sinedriaThesiGet());
	else trapezi.theatisDOM.prepend(sinedria.theatisDOM);

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

	trapeziPrin = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	return this;
};

Skiniko.prototype.processKinisiPostAL = function(data) {
	var sinedria, trpapezi, thesi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	if (trapeziPrin) {
		trapeziPrin.
		trapeziSimetoxiRefreshDOM().
		trapeziDataRefreshDOM();
	}

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) {
		Arena.kafenio.rebelosDOM.prepend(sinedria.rebelosDOM);
		return this;
	}

	trapezi.
	trapeziSimetoxiRefreshDOM().
	trapeziDataRefreshDOM();

	if (sinedria.sinedriaIsTheatis()) {
		trapezi.theatisDOM.prepend(sinedria.theatisDOM);
	}
	else {
		thesi = trapezi.trapeziThesiPekti(data.pektis);
		trapezi.trapeziThesiRefreshDOM(thesi);
	}

	Arena.partidaModeSet();
	Arena.panelRefresh();
	if (Arena.ego.oxiTrapezi(trapezi))
	return this;

	Arena.partida.refreshDOM(trapeziPrin != Arena.ego.trapezi);
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

	Arena.partida.refreshDOM();
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
