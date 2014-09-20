// Η μέθοδος "kinisiAdd" εισάγει κίνηση στο transaction log με σκοπό αυτή
// να κοινοποιηθεί στους clients στον αμέσως επόμενο κύκλο ενημέρωσης.
// By default, η μέθοδος επιχειρεί και την ενημέρωση των clients, εκτός
// και αν έχουμε περάσει false δεύτερη παράμετρο.
//
// Πράγματι, όταν θέλουμε να περάσουμε ένα «πακέτο» κινήσεων, καλούμε την
// "kinisiAdd" για όλες αυτές τις κινήσεις με false δεύτερη παράμετρο και
// στο τέλος την καλούμε χωρίς καθόλου παραμέτρους που σημαίνει απλώς
// ενημέρωση των clients.

Skiniko.prototype.kinisiAdd = function(kinisi, dose) {
	if (kinisi !== undefined)
	this.kinisiKontema().kinisiPush(kinisi);

	if (dose === undefined) dose = true;
	if (!dose) return this;

	this.skinikoKinisiEnimerosi();
	return this;
};

// Προσπαθούμε να αποφύγουμε τις απανωτές ενημερώσεις κινήσεων προς τους
// clients. Πράγματι, κάθε φορά που εισάγονται νέες κινήσεις στο transaction
// log, επιχειρούμε ενημέρωση των clients με τις νέες κινήσεις. Αυτό μπορεί
// να καταλήξει σε συνεχείς ενημερώσεις, πράγμα που θα προσπαθήσουμε να
// αποφύγουμε.

Skiniko.prototype.skinikoKinisiEnimerosi = function() {
	var tora, prevEnimerosiTS, dt;

	// Αν υπάρχει ήδη δρομολογημένη ενημέρωση νέων κινήσεων προς
	// τους clients δεν κάνουμε κάτι αλλά αναμένουμε να εκτελεστεί
	// η δρομολογημένη ενημέρωση στο άμεσο μέλλον.

	if (this.kinisiEnimerosiTimer)
	return this;

	// Δεν υπάρχει ήδη δρομολογημένη ενημέρωση, επομένως θα προβούμε
	// είτε σε άμεση ενημέρωση, εφόσον έχει περάσει αρκετός χρόνος
	// από την προηγούμενη ενημέρωση, είτε θα δρομολογήσουμε ενημέρωση
	// στο πολύ εγγύς μέλλον, εφόσον έχουμε πολύ πρόσφατα επιτελέσει
	// ενημέρωση των clients με τις νέες κινήσεις.

	tora = Globals.torams();
	prevEnimerosiTS = this.kinisiEnimerosiTS;

	// Αν δεν έχει γίνει καμία προηγούμενη ενημέρωση (είναι πρώτη φορά),
	// θεωρούμε ότι έγινε ενημέρωση πριν από 300 ms.

	if (!prevEnimerosiTS) prevEnimerosiTS = tora - 300;

	// Υπολογίζουμε το χρονικό διάστημα που έχει περάσει από την
	// προηγούμενη ενημέρωση.

	dt  = tora - prevEnimerosiTS;

	// Αν δεν έχει περάσει αρκετός χρόνος από την προηγούμενη ενημέρωση
	// δρομολογούμε την ενημέρωση για λίγο αργότερα.

	if (dt < 500)
	this.kinisiEnimerosiTimer = setTimeout(function() {
		Server.skiniko.skinikoKinisiEnimerosiTora();
	}, 500 - dt);

	// Έχει περάσει αρκετός χρόνος από την προηγούμενη ενημέρωση, επομένως
	// δεν είναι κακό να κάνουμε άμεσα ενημέρωση.

	else
	this.skinikoKinisiEnimerosiTora();

	return this;
};

Skiniko.prototype.skinikoKinisiEnimerosiTora = function() {
	var tora = Globals.torams();

	if (this.kinisiEnimerosiTimer) {
		clearTimeout(this.kinisiEnimerosiTimer);
		delete this.kinisiEnimerosiTimer;
	}

	this.kinisiEnimerosiTS = tora;
	this.skinikoSinedriaWalk(function() {
		this.feredataAlages();
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Kinisi.maxLength = 1000;

Skiniko.prototype.kinisiKontema = function() {
	var min, count;

	if (this.kinisi.length < Kinisi.maxLength)
	return this;

	min = this.kinisi.length;
	this.skinikoSinedriaWalk(function() {
		if (!this.hasOwnProperty('kinisiFloter')) return;
		if (this.kinisiFloter < min) min = this.kinisiFloter;
	});

	if (min <= 0) throw new Error('transaction log overflow');

	console.log('Κόντεμα πίνακα κινήσεων κατά ' + min);
	this.kinisi.splice(0, min);

	count = 0;
	this.skinikoSinedriaWalk(function() {
		if (!this.hasOwnProperty('kinisiFloter'))
		return;

		this.kinisiFloter -= min;
		count++;
	});

	console.log('Μειώθηκαν δείκτες κινήσεων σε ' + count + ' συνεδρίες');
	return this;
};

Skiniko.prototype.kinisiPush = function(kinisi) {
	this.kinisi.push(kinisi);
	return this;
};

Kinisi.prototype.isAdiafori = function(sinedria) {
	var proc = 'isAdiafori' + this.idos;
	if (typeof this[proc] === 'function') return this[proc](sinedria);
	return false;
};

Kinisi.prototype.apostoli = function(sinedria) {
	var nodereq = sinedria.feredataGet();
	if (!nodereq) return this;

	nodereq.write('\t{\n\t\tidos: ' + this.idos.json() + ',\n');
	if (this.hasOwnProperty('data')) {
		nodereq.write('\t\tdata: ');
		nodereq.write(this[this.isProsarmogi(sinedria) ?  'dataProsarmosmena' : 'dataPliri']);
	}
	nodereq.write('\n\t},\n');
	return this;
};

Kinisi.prototype.isProsarmogi = function(sinedria) {
	var proc = 'prosarmogi' + this.idos;
	if ((typeof this[proc] === 'function') && this[proc](sinedria)) return true;

	if (this.hasOwnProperty('dataPliri'))
	return false;

	this.dataPliri = JSON.stringify(this.data);
	return false;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kinisi.prototype.isAdiaforiPL = function(sinedria) {
	var prosklisi = Server.skiniko.skinikoProsklisiGet(this.data.kodikos);
	if (!prosklisi) return true;
	return prosklisi.prosklisiIsAdiafori(sinedria.sinedriaPektisGet());
};

Kinisi.prototype.isAdiaforiDL = function(sinedria) {
	var pektis = sinedria.sinedriaPektisGet();
	if (this.data.apo == pektis) return false;
	if (this.data.pros == pektis) return false;
	return true;
};

Kinisi.prototype.isAdiaforiSZ = function(sinedria) {
	// Αν δεν υπάρχει τραπέζι, πρόκειται για δημόσια συζήτηση και
	// επομένως αφορά τους πάντες.

	if (!this.data.trapezi) return false;

	// Αν το τραπέζι της συνεδρίας δεν συμφωνεί με το τραπέζι της
	// συζήτησης, τότε το σχόλιο δεν μας αφορά.

	if (sinedria.sinedriaOxiTrapezi(this.data.trapezi)) return true;

	// Πρόκειται για σχόλιο της συζήτησης του τραπεζιού μας, επομένως
	// το σχόλιο μας αφορά.

	// Ελέγχουμε μήπως το ανά χείρας σχόλιο έχει ήδη αποσταλεί με τα
	// δεδομένα τσόχας.

	if (this.data.kodikos <= sinedria.tsoxaSizitisiGet(this.data.trapezi)) return true;

	// Το σχόλιο πρέπει να αποσταλεί, οπότε ενημερώνουμε και το φλοτέρ
	// συζήτησης τσόχας.

	sinedria.tsoxaSizitisiSet(this.data.trapezi, this.data.kodikos);
	return false;
};

// Για τη διαγραφή σχολίων συζήτησης είμαστε αναγκασμένοι να κοινοποιούμε
// όλους, καθώς οι συζητήσεις των τραπεζιών κρατούνται στους clients και
// οι χρήστες μπορεί να έχουν αλλάξει τραπέζι και να επιστρέψουν αργότερα
// σε τραπέζι από το οποίο έχει γίνει διαγραφή σχολίου συζήτησης.

// Για λόγους ασφαλείας έχω σχετική function σε σχόλιο προκειμένου να μην
// την προσθέσω αργότερα πιστεύοντας ότι την έχω ξεχάσει.

// Kinisi.prototype.isAdiaforiZS = function(sinedria) { return false; };

Kinisi.prototype.isAdiaforiXL = function(sinedria) {
	return(sinedria.sinedriaPektisGet() != this.data.pektis);
};

Kinisi.prototype.isAdiaforiEG = function(sinedria) {
	// Αν το τραπέζι της συνεδρίας δεν συμφωνεί με το τραπέζι της
	// ενέργειας, τότε η ενέργεια δεν μας αφορά.

	if (sinedria.sinedriaOxiTrapezi(this.data.trapezi)) return true;

	// Πρόκειται για ενέργεια του τραπεζιού μας, επομένως η ενέργεια μάς αφορά.

	// Ελέγχουμε μήπως η ανά χείρας ενέργεια έχει ήδη αποσταλεί με τα δεδομένα τσόχας.

	sinedria.tsoxaCheck(this.data.trapezi);
	if (this.data.kodikos <= sinedria.tsoxaEnergiaGet(this.data.trapezi)) return true;

	// Η ενέργεια πρέπει να αποσταλεί, οπότε ενημερώνουμε και το φλοτέρ ενεργειών τσόχας.

	sinedria.tsoxaEnergiaSet(this.data.trapezi, this.data.kodikos);
	return false;
};

// DZ		Δείξιμο του τζόγου

Kinisi.prototype.isAdiaforiDZ = function(sinedria) {
	return sinedria.sinedriaOxiTrapezi(this.data.trapezi);
};

// AK		Ακύρωση κινήσεων

Kinisi.prototype.isAdiaforiAK = function(sinedria) {
	sinedria.tsoxaCheck(this.data.trapezi);
	return !sinedria.tsoxaEnergiaGet(this.data.trapezi);
};

// RC		Reject claim

Kinisi.prototype.isAdiaforiRC = function(sinedria) {
	sinedria.tsoxaCheck(this.data.trapezi);
	return !sinedria.tsoxaEnergiaGet(this.data.trapezi);
};

// KN		Κόρνα
//
// Η κόρνα αφορά σε όλους εμπλέκονται σε κάποιο τραπέζι και αυτοί είναι οι παίκτες
// και οι θεατές του τραπεζιού.

Kinisi.prototype.isAdiaforiKN = function(sinedria) {
	var trapezi, pektis;

	// Αν η συνεδρία εμπλέκεται στο τραπέζι είτε ως παίκτης είτε ως θεατής
	// τότε η κόρνα την αφορά.

	if (sinedria.sinedriaIsTrapezi(this.data.trapezi)) return false;

	// Η συνεδρία δείχνει να μην εμπλέκεται στο τραπέζι στο οποία ήχησε
	// η κόρνα από κάποιον παίκτη του τραπεζιού. Η μόνη περίπτωση να
	// αφορά η κόρνα τη συγκεκριμένη συνεδρία είναι ο παίκτης της
	// συνεδρίας να κατεει θεη παίκτη στο τραπέζι και αυτή τη στιγμή
	// να αλητεύει.

	pektis = sinedria.sinedriaPektisGet();
	if (!pektis) return true;

	trapezi = Server.skiniko.skinikoTrapeziGet(this.data.trapezi);
	if (!trapezi) return true;

	return(!trapezi.trapeziThesiPekti(pektis));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kinisi.prototype.prosarmogiPK = function(sinedria) {
	var pektis;

	// Αν ο παραλήπτης είναι ο ίδιος ο παίκτης, τότε δεν απαιτείται
	// καμία προσαρμογή.

	pektis = sinedria.sinedriaPektisGet();
	if (pektis === this.data.login) return false;

	// Θα πρέπει να γίνει προσαρμογή ανάλογα με το αν ο παραλήπτης
	// είναι ανώτερος αξιωματούχος, επιδοτούμενος κλπ.

	pektis = Server.skiniko.skinikoPektisGet(pektis);
	if (!pektis) return false;

	if (pektis.pektisIsDiaxiristis())
	return this.prosarmogiPKdiaxiristis(sinedria);

	if (pektis.pektisIsAnergos())
	return this.prosarmogiPKanergos(sinedria);

	return this.prosarmogiPKxenos(sinedria);
};

Kinisi.prototype.prosarmogiPKdiaxiristis = function(sinedria) {
	var data = this.data, atad;

	if (this.hasOwnProperty('dataDiaxiristis')) {
		this.dataProsarmosmena = this.dataDiaxiristis;
		return true;
	}

	atad = {
		login: data.login,
		onoma: data.onoma,
		photoSrc: data.photoSrc,
		peparam: {},
	};

	Globals.walk(data.peparam, function(param, timi) {
		if (Prefadoros.peparamIsProsopiki(param)) return;
		atad.peparam[param] = timi;
	});

	this.dataProsarmosmena = JSON.stringify(atad);
	this.dataDiaxiristis = this.dataProsarmosmena;
	return true;
};

Kinisi.prototype.prosarmogiPKanergos = function(sinedria) {
	var data = this.data, atad;

	if (this.hasOwnProperty('dataAnergos')) {
		this.dataProsarmosmena = this.dataAnergos;
		return true;
	}

	atad = {
		login: data.login,
		onoma: data.onoma,
		photoSrc: data.photoSrc,
		peparam: {},
	};

	Globals.walk(data.peparam, function(param, timi) {
		if (Prefadoros.peparamIsProsopiki(param))
		return;

		if (Prefadoros.peparamOxiKrifi(param)) {
			atad.peparam[param] = timi;
			return;
		}

		if (Prefadoros.peparamIsAnergos(param)) {
			atad.peparam[param] = timi;
			return;
		}
	});

	this.dataProsarmosmena = JSON.stringify(atad);
	this.dataAnergos = this.dataProsarmosmena;
	return true;
};

Kinisi.prototype.prosarmogiPKxenos = function(sinedria) {
	var data = this.data, atad;

	if (this.hasOwnProperty('dataXenos')) {
		this.dataProsarmosmena = this.dataXenos;
		return true;
	}

	atad = {
		login: data.login,
		onoma: data.onoma,
		photoSrc: data.photoSrc,
		peparam: {},
	};

	Globals.walk(data.peparam, function(param, timi) {
		if (Prefadoros.peparamIsProsopiki(param)) return;
		if (Prefadoros.peparamIsKrifi(param)) return;
		atad.peparam[param] = timi;
	});

	this.dataProsarmosmena = JSON.stringify(atad);
	this.dataXenos = this.dataProsarmosmena;
	return true;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kinisi.prototype.isAdiaforiMV = function(sinedria) {
	// Δεν βγάζουμε μολύβι για τον ίδιο τον παίκτη που
	// εκκινεί κάποιο σχόλιο.

	if (sinedria.sinedriaPektisGet() == this.data.pektis)
	return true;

	// Αν το μολύβι εκκίνησε ενώ ο παίκτης βρισκόταν στο καφενείο,
	// τότε αφορά τους πάντες.

	if (this.data.kafenio)
	return false;

	// Για τους υπόλοιπους διαλέγουμε αυτούς που βρίσκονται
	// στο ίδιο τραπέζι.

	return sinedria.sinedriaOxiTrapezi(this.data.trapezi);
};

Kinisi.prototype.isAdiaforiVM = function(sinedria) {
	return this.isAdiaforiMV(sinedria);
};

Kinisi.prototype.isAdiaforiZP = function(sinedria) {
	return sinedria.sinedriaOxiTrapezi(this.data.trapezi);
};

Kinisi.prototype.isAdiaforiPS = function(sinedria) {
	var param, paraliptis;

	if (!this.data)
	return true;

	param = this.data.param;
	if (!param) return true;

	if (Prefadoros.peparamIsProsopiki(param))
	return(sinedria.sinedriaPektisGet() != this.data.pektis)

	if (Prefadoros.peparamOxiKrifi(param))
	return false;

	paraliptis = Server.skiniko.skinikoPektisGet(sinedria.sinedriaPektisGet());
	if (!paraliptis) return true;

	if (paraliptis.pektisIsDiaxiristis())
	return false;

	if (Prefadoros.peparamIsAnergos(param) && paraliptis.pektisIsAnergos())
	return false;

	return true;
};

// PI		Πληροφορίες προφίλ
//
// Η πληροφορία προφίλ που συντάσσεται από τον ίδιο τον παίκτη είναι αυτή που
// πρέπει να κοινοποιηθεί σε όλους, εκτός από τον ίδιον τον συντάκτη ο οποίος
// την έχει ήδη στα χέρια του από τη διαδικασία της σύνταξης.

Kinisi.prototype.isAdiaforiPI = function(sinedria) {
	if (!this.data)
	return true;

	// Αν ο σχολιαστής είναι άλλος από τον παίκτη στον οποίον
	// αναφέρεται το κείμενο του προφίλ, τότε δεν ενδιαφέρει
	// κανέναν.

	if (this.data.pektis != this.data.sxoliastis)
	return true;

	// Το κείμενο προφίλ συντάχθηκε από τον ίδιο τον παίκτη, επομένως
	// αφορά τους πάντες. Ωστόσο, εξαιρούμε τον συντάκτη, καθώς αυτός
	// κατέχει το κείμενο ήδη από τη σύνταξή του.

	return(sinedria.sinedriaPektisGet() == this.data.pektis)
};
