///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: feredata');

Service.feredata = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "feredata.freska" εξυπηρετεί αίτημα αποστολής πλήρων σκηνικών
// δεδομένων. Τυχόν προηγούμενο κανάλι επικοινωνίας "feredata" της ίδιας
// συνεδρίας ακυρώνεται ως παρωχημένο.

Service.feredata.freska = function(nodereq) {
	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('id', 'ακαθόριστο id σε αίτημα feredata')) return;

	nodereq.sinedriaGet().
	feredataPollSet().
	feredataObsolete().
	feredataSet(nodereq).
	feredataFreska();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "feredata.alages" εξυπηρετεί αίτημα αποστολής δεδομένων μεταβολής
// σκηνικών δεδομένων. Αν βρεθούν δεδομένα μεταβολής επιστρέφει αμέσως με τα
// δεδομένα μεταβολής, αλλιώς τίθεται σε αναμονή μέχρι να προκύψουν μεταβολές,
// ή να κλείσει επιστρέφοντας κωδικό μη μεταβολής λόγω παρέλευσης μέγιστου χρόνου
// αναμονής.

Service.feredata.alages = function(nodereq) {
	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('id', true)) return;

	nodereq.sinedriaGet().
	feredataPollSet().
	feredataSet(nodereq).
	feredataAlages();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "feredata.check" είναι function περιπόλου, δηλαδή καλείται σε
// τακτά χρονικά διαστήματα και σκοπό έχει το κλείσιμο ανοικτών καναλιών
// επικοινωνίας feredata μετά την παρέλευση εύλογου χρονικού διαστήματος,
// π.χ. 20 seconds. Αυτό το κάνουμε για δύο λόγους: να αποφύγουμε τυχόν
// ανεξέλεγκτο κλείσιμο λόγω ajax call timeout και, δεύτερον, να εντοπίσουμε
// clients που έχουν διακόψει την επαφή τους με τον server.

Service.feredata.timeout = 20;
Log.print('timeout for "feredata" set to ' + Service.feredata.timeout + ' seconds');

Service.feredata.check = function() {
	var tora;

	tora = Globals.tora();
	if (Debug.flagGet('feredataCheck')) console.log('περίπολος: feredata.check: ', tora);

	Server.skiniko.skinikoSinedriaWalk(function() {
		// Αν δεν βρούμε κανάλι feredata για την ανά χείρας συνεδρία, δεν
		// προβαίνουμε σε περαιτέρω ενέργειες.

		if (this.oxiFeredata())
		return;

		// Αν ο χρόνος που έχει παρέλθει από την υποβολή του αιτήματος δεν
		// είναι μεγάλος, δεν προβαίνουμε σε περαιτέρω ενέργειες.

		if ((tora - this.feredataPollGet()) < Service.feredata.timeout)
		return;

		// Παρήλθε μεγάλο χρονικό διάστημα κατά το οποίο το συγκεκριμένο
		// ανοικτό αίτημα feredata της ανά χείρας συνεδρίας δεν έχει λάβει
		// νέα δεδομένα, επομένως το κλείνουμε με απάντηση μη αλλαγής και
		// ως εκ τούτου θα δρομολογηθεί από τον client νέο αίτημα feredata.

		this.feredataEnd('=');
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
//
// Ακολουθούν μέθοδοι συνεδρίας που εξυπηρετούν τις παραπάνω functions.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "feredataSet" δέχεται ένα κανάλι επικοινωνίας feredata
// και το συσχετίζει με την ανά χείρας συνεδρία. Κανονικά δεν πρέπει
// να υπάρχει άλλο κανάλι συσχετισμένο εκείνη τη στιγμή. Αν υπάρχει
// είναι από παράλειψη απαλοιφής προηγούμενου καναλιού.

Sinedria.prototype.feredataSet = function(nodereq) {
	this.feredataClose('previous feredata closed (' + this.sinedriaPektisGet() + ')');
	this.feredata = nodereq;
	return this;
};

// Η μέθοδος "feredataGet" επιστρέφει το κανάλι επικοινωνίας feredata
// της ανά χείρας συνεδρίας.

Sinedria.prototype.feredataGet = function() {
	return this.feredata;
};

// Η μέθοδος "isFeredata" ελέγχει αν η ανά χείρας συνεδρία έχει συσχετισμένο
// κανάλι επικοινωνίας feredata.

Sinedria.prototype.isFeredata = function() {
	return this.feredata;
};

// Η μέθοδος "isFeredata" ελέγχει αν η ανά χείρας συνεδρία ΔΕΝ έχει συσχετισμένο
// κανάλι επικοινωνίας feredata.

Sinedria.prototype.oxiFeredata = function() {
	return !this.isFeredata();
};

// Η μέθοδος "kinisiFloterSet" θέτει τον δείκτη τελευταίας κίνησης στο επιθυμητό
// ύψος από το array κινήσεων (transaction log). Αν δεν καθοριστεί ύψος κινήσεων
// τίθεται το ανώτατο σημείο του array κινήσεων, οπότε η συνεδρία θεωρείται πλήρως
// ενημερωμένη.

Sinedria.prototype.kinisiFloterSet = function(len) {
	if (len === undefined)
	len = Server.skiniko.kinisi.length;

	this.kinisiFloter = len;
	return this;
};

// Η μέθοδος "kinisiFloterGet" επιστρέφει τον δείκτη τελευταίας κίνησης τής ανά
// χείρας συνεδρίας. Αν δεν βρεθεί δείκτης, τότε προφανώς πρόκειται για σφάλμα
// προγράμματος και στηλιτεύουμε το γεγονός, επιστρέφοντας ΑΡΝΗΤΙΚΟ δείκτη που
// θα σημάνει αίτημα για αποστολή φρέσκων σκηνικών δεδομένων.
//
// Περιπτώσεις σφάλματος μπορούν να εμφανιστούν κατά την επανεκκίνηση του skiser
// ως ακολούθως:
//
//	Κάνουμε επανεκκίνηση του skiser έχοντας online π.χ. 100 συνεδρίες.
//
//	Η επανεκκίνηση ολοκληρώνεται σε σύντομο χρονικό διάστημα κατά το οποίο
//	οι διάφροι clients αποστέλλουν αιτήματα και λαμβάνουν απαντήσεις που
//	υποδηλώνουν ότι κάτι δεν πάει καλά, οπότε αποστέλλουν νέα αιτήματα για
//	πλήρη σκηνικά δεδομένα.
//
//	Αν κάποιος client δεχθεί αίτημα στο ενδιάμεσο διάστημα, δηλαδή αφού
//	ο skiser έχει επανεκκινήσει και πριν λάβει νέα απάντηση, δεν θα βρει
//	δείκτη κινήσεων στον skiser για τη σχετική συνεδρία. Σ' αυτή την
//	περίπτωση θα πρέπει να λάβει κωδικό σφάλματος και να αιτηθεί φρέσκα
//	σκηνικά δεδομένα.

Sinedria.prototype.kinisiFloterGet = function() {
	var floter;

	floter = parseInt(this.kinisiFloter);
	if (isNaN(floter)) {
		console.error(this.sinedriaPektisGet() + ': δεν βρέθηκε δείκτης κινήσεων');
		return -1;
	}

	return floter;
};

// Η μέθοδος "feredataPollGet" επιστρέφει το timestamp του τελευταίου αιτήματος
// feredata για την ανά χείρας συνεδρία. Αν δεν βρεθεί timestamp για τη συνεδρία
// θέτουμε το τρέχον timestamp, στηλιτεύοντας παράλληλα το γεγονός.

Sinedria.prototype.feredataPollGet = function() {
	if (!this.hasOwnProperty('feredataPoll')) {
		console.error(this.sinedriaPektisGet() + ': δεν βρέθηκε feredata poll timestamp');
		this.feredataPollSet();
	}

	return this.feredataPoll;
};

// Η μέθοδος "feredataPollSet" θέτει το timestamp του τελευταίου αιτήματος feredata
// της ανά χείρας συνεδρίας στο τρέχον (ή σε άλλο επιθυμητό) timestamp.

Sinedria.prototype.feredataPollSet = function(ts) {
	if (ts === undefined)
	ts = Globals.toraServer();

	this.feredataPoll = ts;
	return this;
};

// Η "feredataEnd" κλείνει και διαγράφει τυχόν κανάλι επικοινωνίας feredata της
// ανά χείρας συνεδρίας αποστέλλοντας ως κατακλείδα ένα string το οποίο μπορούμε
// να περάσουμε ως παράμετρο.

Sinedria.prototype.feredataEnd = function(s) {
	if (this.oxiFeredata()) {
		console.error(this.sinedriaPektisGet() + ': επιχειρήθηκε κλείσιμο ήδη κλειστής feredata (' + s + ')');
		return this;
	}

	this.feredataGet().end(s);
	delete this.feredata;
	return this;
};

// Η μέθοδος "feredataObsolete" κλείνει το κανάλι επικοινωνίας feredata της ανά
// χείρας συνεδρίας με απάντηση που υποδηλώνει στον client ότι το συγκεκριμένο
// κανάλι κατέστη παρωχημένο.

Sinedria.prototype.feredataObsolete = function() {
	if (this.oxiFeredata())
	return this;

	this.feredataEnd('~');
	return this;
};

// Η μέθοδος "feredataClose" κλείνει το κανάλι επικοινωνίας feredata της ανά χείρας
// συνεδρίας με απάντηση που υποδηλώνει στον client ότι το συγκεκριμένο κανάλι δεν
// είναι πλέον ανοικτό.
//
// Αν το κλείσιμο γίνεται για λόγους τάξεως και το κανάλι επικοινωνίας feredata
// βρεθεί ανοικτό ενώ έπρεπε να είναι κλειστό, τότε μπορούμε να στηλιτεύσουμε το
// γεγονός περνώντας σχετικό μήνυμα λάθους.

Sinedria.prototype.feredataClose = function(err) {
	if (this.oxiFeredata())
	return this;

	if (err !== undefined) console.error(err);
	this.feredataEnd('-');
	return this;
};

// Η μέθοδος "feredataExodos" κλείνει το κανάλι επικοινωνίας feredata της ανά
// χείρας συνεδρίας με απάντηση που υποδηλώνει στον client ότι το συγκεκριμένο
// κανάλι έχει κλείσει και θα πρέπει να τερματίσει τη λειτουργία του.

Sinedria.prototype.feredataExodos = function() {
	this.feredataEnd('_');
	return this;
};

// Η "feredataApostoli" κλείνει απάντηση σε αίτημα feredata.

Sinedria.prototype.feredataApostoli = function() {
	var nodereq, id;

	nodereq = this.feredataGet();
	if (!nodereq) return this;

	nodereq.write('fortos: {\n');
	nodereq.write('\tpektes: ' + 102 + ',\n');
	nodereq.write('\ttrapezia: ' + 24 + ',\n');
	nodereq.write('\tcpu: ' + Service.fortos.cpuload + ',\n');
	nodereq.write('},\n');

	id = nodereq.urlGet('id');
	if (id) nodereq.write('id: ' + id);

	this.feredataEnd();
	return this;
};

// Η μέθοδος "feredataResetSet" εφαρμόζεται σε συνεδρίες που είναι ενεργές κατά το
// ανέβασμα του skiser και θέτει στοιχείο που υποδηλώνει ακριβώς αυτό.

Sinedria.prototype.feredataResetSet = function() {
	this.feredataReset = true;
	return this;
};

Sinedria.prototype.feredataIsReset = function() {
	return this.feredataReset;
};

Sinedria.prototype.feredataOxiReset = function() {
	return !this.feredataIsReset();
};

Sinedria.prototype.feredataResetClear = function() {
	delete this.feredataReset;
	return this;
};

// Η μέθοδος "feredataResetCheck" καλείται κατά την επιστροφή φρέσκων σκηνικών
// δεδομένων και αν ελέγχει αν έχει μεσολαβήσει skiser restart. Αν όντως έχει
// μεσολαβήσει skiser restart, εμφυτεύει στα επιστρεφόμενα δεδομένα στοιχείο
// "reset" με (πλασματική) τιμή 1, οπότε ο client που θα παραλάβει τη σχετική
// απάντηση θα γνωρίζει ότι πρόκειται για δεδομένα που προέκυψαν μετά από skiser
// restart.

Sinedria.prototype.feredataResetCheck = function() {
	var nodereq;

	if (this.feredataOxiReset()) return this;

	this.feredataResetClear();
	nodereq = this.feredataGet();
	if (!nodereq) return this;

	nodereq.write('reset:1,\n');
	return this;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Sinedria.prototype.feredataFreska = function() {
	var skiniko = Server.skiniko, nodereq;

	nodereq = this.feredataGet();
	if (!nodereq) return this;

	nodereq.write('pektis: [\n');
	skiniko.skinikoPektisWalk(function() {
		nodereq.write('\t');
		nodereq.write(this.pektisFeredata());
		nodereq.write(',\n');
	});
	nodereq.write('],\n');

	nodereq.write('peparam: {\n');
	skiniko.skinikoPektisWalk(function() {
		var pektis, xenos, hdr;

		pektis = this.pektisLoginGet();
		xenos = (nodereq.loginGet() != pektis);
		hdr = '\t' + pektis.json() + ': {\n\t\t';
		this.pektisPeparamWalk(function(param, timi) {
			if (xenos && Prefadoros.peparamIsPrivate(param)) return;
			nodereq.write(hdr + param.json() + ':' + timi.json() + ',\n');
			hdr = '\t\t';
		});
		if (hdr == '\t\t') nodereq.write('\t},\n');
	});
	nodereq.write('},\n');

	nodereq.write('sxesi: {\n');
	nodereq.pektisGet().pektisSxesiWalk(function(pektis, sxesi) {
		nodereq.write('\t' + pektis.json() + ':' + sxesi.json() + ',\n');
	});
	nodereq.write('},\n');

	nodereq.write('trapezi: [\n');
	skiniko.skinikoTrapeziWalk(function() {
		nodereq.write('\t');
		nodereq.write(this.trapeziFeredata());
		nodereq.write(',\n');
	});
	nodereq.write('],\n');

	nodereq.write('dianomi: [\n');
	skiniko.skinikoTrapeziWalk(function() {
		this.trapeziDianomiWalk(function() {
			nodereq.write('\t');
			nodereq.write(this.dianomiFeredata());
			nodereq.write(',\n');
		});
	});
	nodereq.write('],\n');

	nodereq.write('sizitisi: [\n');
	skiniko.skinikoSizitisiWalk(function() {
		nodereq.write('\t');
		nodereq.write(this.sizitisiFeredata());
		nodereq.write(',\n');
	});
	nodereq.write('],\n');

	nodereq.write('sinedria: [\n');
	skiniko.skinikoSinedriaWalk(function() {
		nodereq.write('\t');
		nodereq.write(this.sinedriaFeredata());
		nodereq.write(',\n');
	});
	nodereq.write('],\n');

	nodereq.write('prosklisi: [\n');
	skiniko.skinikoProsklisiWalk(function() {
		if (this.prosklisiIsAdiafori(nodereq.login)) return;
		nodereq.write('\t');
		nodereq.write(this.prosklisiFeredata());
		nodereq.write(',\n');
	});
	nodereq.write('],\n');

	this.
	tsoxaReset().
	tsoxaNeotera(true).
	kinisiFloterSet().
	feredataResetCheck().
	feredataApostoli();
	return this;
};

Sinedria.prototype.feredataAlages = function() {
	var skiniko = Server.skiniko, nodereq, floter, kinisiNone, hdr, i;

	nodereq = this.feredataGet();
	if (!nodereq) return this;

	// Αν έχουμε ασαφή δείκτη κινήσεων σημαίνει μάλλον ότι στο διάστημα
	// μεταξύ δύο διαδοχικών αποστολών ο skiser έχει επανεκκινήσει, οπότε
	// είναι καλά να αποστείλουμε σχετικό κωδικό που θα σημάνει αίτημα για
	// φρέσκα σκηνικά δεδομένα.

	floter = this.kinisiFloterGet();
	if (floter < 0) return this.feredataEnd('?');

	// Ο δείκτης βρέθηκε κανονικός, επομένως πρέπει να ελέγξουμε αν υπάρχουν
	// δεδομένα προς αποστολήν. Ξεκινάμε με τα νεότερα τσόχας.

	this.tsoxaNeotera();

	// Ακολουθούν οι νέες κινήσεις από τις οποίες θα πρέπει να ξεδιαλέξουμε
	// όσες αφορούν στην ανά χείρας συνεδρία.

	kinisiNone = true;
	hdr = 'kinisi: [\n';
	for (i = floter; i < skiniko.kinisi.length; i++) {
		if (skiniko.kinisi[i].isAdiafori(this))
		continue;

		nodereq.write(hdr);
		hdr = '';

		skiniko.kinisi[i].apostoli(this);
		kinisiNone = false;
	}
	if (!kinisiNone) nodereq.write('],\n');

	// Θέτουμε τον δείκτη κινήσεων στο τρέχον σημείο.

	this.kinisiFloterSet(skiniko.kinisi.length);

	// Αν τελικά δεν υπήρχαν νεότερα τσόχας ούτε απεστάλησαν κινήσεις,
	// μπαίνουμε σε long polling.

	if (this.tsoxaNeoteraNone && kinisiNone) return this;

	// Αλλιώς κλείνουμε την αποστολή των σκηνικών δεδομένων κα θα δρομολογηθεί
	// νέο αίτημα από τον client.

	this.feredataApostoli();
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Sinedria.prototype.tsoxaReset = function() {
	this.tsoxa = {};
	return this;
};

Sinedria.prototype.tsoxaSizitisiSet = function(trapezi, kodikos) {
	this.tsoxa[trapezi].sizitisi = kodikos;
	return this;
};

Sinedria.prototype.tsoxaSizitisiGet = function(trapezi) {
	return this.tsoxa[trapezi].sizitisi;
};

Sinedria.prototype.tsoxaEnergiaSet = function(trapezi, kodikos) {
	this.tsoxa[trapezi].energia = kodikos;
	return this;
};

Sinedria.prototype.tsoxaEnergiaGet = function(trapezi) {
	return this.tsoxa[trapezi].energia;
};

// Η μέθοδος "tsoxaCheck" διασφαλίζει ότι υπάρχει εγγραφή τσόχας για το
// συγκεκριμένο τραπέζι στην ανά χείρας συνεδρία. Αν δεν υπάρχει δημιουργεί
// εγγραφή που δείχνει ότι δεν έχουν παραδοθεί ενέργειες ούτε συζητήσεις.

Sinedria.prototype.tsoxaCheck = function(trapezi) {
	if (!this.hasOwnProperty('tsoxa')) this.tsoxa = {};
	if (this.tsoxa.hasOwnProperty(trapezi)) return this;

	this.tsoxa[trapezi] = {
		sizitisi: 0,
		energia: 0,
	};

	return this;
};

// Η μέθοδος "tsoxaNeotera" αναλαμβάνει τον έλεγχο του τραπεζιού του αιτούντος
// client όσον αφορά στη συζήτηση και στις ενέργειες που έλαβαν χώρα μετά την
// τελευταία σχετική ενημέρωση.

Sinedria.prototype.tsoxaNeotera = function(freska) {
	var sinedria = this, trapeziKodikos, tsoxa;

	this.tsoxaNeoteraNone = true;

	nodereq = this.feredataGet();
	if (!nodereq) return this;

	trapezi = Server.skiniko.skinikoTrapeziGet(this.sinedriaTrapeziGet());
	if (!trapezi) return this;

	trapeziKodikos = trapezi.trapeziKodikosGet();
	this.tsoxaCheck(trapeziKodikos);
	tsoxa = this.tsoxa[trapeziKodikos];

	this.
	tsoxaNeoteraSizitisi(nodereq, trapezi, tsoxa).
	tsoxaNeoteraEnergia(nodereq, trapezi, tsoxa, freska).
	tsoxaNeoteraKlisimo(nodereq);

	return this;
};

Sinedria.prototype.tsoxaNeoteraSizitisi = function(nodereq, trapezi, tsoxa) {
	var sinedria = this, hdr, max;

	hdr = '\tsizitisi: [\n';
	max = tsoxa.sizitisi;

	trapezi.trapeziSizitisiWalk(function() {
		var kodikos = this.sizitisiKodikosGet();
		if (kodikos <= tsoxa.sizitisi) return;

		if (kodikos > max) max = kodikos;
		sinedria.tsoxaNeoteraEpikefalida(nodereq);
		nodereq.write(hdr);
		hdr = '';
		nodereq.write('\t\t');
		nodereq.write(this.sizitisiFeredata());
		nodereq.write(',\n');
		//sinedria.tsoxaNeoteraNone = false;
	});

	tsoxa.sizitisi = max;
	if (hdr === '') nodereq.write('\t],\n');
	return this;
};

// Η μέθοδος "tsoxaAlagiTrapezi" ελέγχει αν το τραπέζι από το οποίο επιλέγουμε
// νεότερες ενέργειες είναι διαφορετικό από αυτό που επιλέξαμε νεότερες ενέργειες
// την προηγούμενη φορά.

Sinedria.prototype.tsoxaAlagiTrapezi = function(trapezi) {
	var kodikosTrapezi;

	kodikosTrapezi = trapezi.trapeziKodikosGet();
	if (this.tsoxaTrapeziLast === kodikosTrapezi)
	return false;

	this.tsoxaTrapeziLast = kodikosTrapezi;
	return true;
};

Sinedria.prototype.tsoxaNeoteraEnergia = function(nodereq, trapezi, tsoxa, freska) {
	var sinedria = this, dianomi, hdr, max, diakopi, i, energia, kodikos;

	// Αν την προηγούμενη φορά που μαζέψαμε νεότερες ενέργειες βρισκόμασταν
	// σε άλλο τραπέζι, τότε δεν θα διακόψουμε τη διαδικασία σε περίπτωση
	// που οι νεότερες ενέργειες απαιτούν διακοπή, αλλά θα τις αποστείλουμε
	// όλες μαζί σαν να ζητήθηκαν φρέσκα σκηνικά δεδομένα.

	if (this.tsoxaAlagiTrapezi(trapezi))
	freska = true;

	dianomi = trapezi.trapeziTelefteaDianomi();
	if (!dianomi) return this;

	hdr = '\tenergia: [\n';
	max = tsoxa.energia;

	// Η flag "diakopi" θα δείξει αν πρέπει να διακόψουμε τον έλεγχο των
	// νέων ενεργειών και να αφήσουμε κάποιες ενέργειες για την επόμενη
	// αποστολή.

	diakopi = false;

	for (i = 0; i < dianomi.energiaArray.length; i++) {
		energia = dianomi.energiaArray[i];
		kodikos = energia.energiaKodikosGet();
		if (kodikos <= tsoxa.energia) continue;

		if (kodikos > max) max = kodikos;
		sinedria.tsoxaNeoteraEpikefalida(nodereq);
		nodereq.write(hdr);
		hdr = '';
		nodereq.write('\t\t');
		nodereq.write(energia.energiaFeredata(sinedria, trapezi));
		nodereq.write(',\n');

		// Αν το αίτημα αφορούσε σε αποστολή φρέσκων σκηνικών δεδομένων
		// συνεχίζουμε κανονικά τη διαδικασία για όλες τις ενέργειες
		// της διανομής.

		if (freska)
		continue;

		// Κάποια είδη ενέργειας πρέπει να φύγουν χωρίς να ακολουθήσουν
		// άμεσα τυχόν επόμενες ενέργειες που έχουν ήδη κοινοποιηθεί στον
		// skiser. Αν π.χ. κάποιος παίκτης παίξει το τελευταίο φύλλο μιας
		// μπάζας, κερδίσει την μπάζα και παίξει το επόμενο φύλλο, τότε
		// υπάρχει περίπτωση κάποιος καθυστερημένος client να παραλάβει
		// τις δύο ενέργειες μαζί, επομένως θα παραλάβει δύο συνεχόμενα
		// φύλλα, ένα που παίρνει την μπάζα και το πρώτο φύλλο της
		// επόμενης μπάζας. Εκεί μπορεί να χαθεί η εικόνα και να φανεί
		// μόνο το πρώτο φύλλο της νέας μπάζας και όχι το τελευταίο φύλλο
		// της προηγούμενης μπάζας, επομένως είναι καλό σε τέτοιου είδους
		// ενέργειες να κάνουμε διακοπή και αποστολή μέρους των ενεργειών.
		// Οι ενέργειες που δεν αποστέλλονται με την παρούσα αποστολή θα
		// αποσταλούν σε επόμενη αποστολή.

		switch (energia.energiaIdosGet()) {
		case 'ΦΥΛΛΟ':
			diakopi = true;
		}

		if (diakopi) break;
	}

	tsoxa.energia = max;
	if (hdr === '') nodereq.write('\t],\n');
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "feredataFormat" καλείται ως μέθοδος αντικειμένων της εφαρμογής
// με παράμετρο μια λίστα από attributes. Σκοπός της μεθόδου είναι να επιστρέψει
// stringified version του ανά χείρας αντικειμένου περιορισμένου όμως μόνο στα
// περιγραφόμενα attributes. Το επιστρεφόμενο string αποστέλλεται κατόπιν στον
// client ως μέρος των αιτουμένωνω σκηνικών δεδομένων.

Server.feredataFormat = function(attrs) {
	var i;

	for (i in attrs) {
		if (!this.hasOwnProperty(i)) delete attrs[i];
		else if (this[i] === null) delete attrs[i];
		else attrs[i] = this[i];
	}

	return JSON.stringify(attrs);
};

Pektis.prototype.pektisFeredata = function() {
	return Server.feredataFormat.call(this, {
		login: null,
		onoma: null,
	});
};

Trapezi.prototype.trapeziFeredata = function() {
	return Server.feredataFormat.call(this, {
		kodikos: null,
		stisimo: null,
		trparam: null,
		pektis1: null,
		apodoxi1: null,
		pektis2: null,
		apodoxi2: null,
		pektis3: null,
		apodoxi3: null,
		poll: null,
		trparam: null,
		simetoxi: null,
		telefteos: null,
		akirosi: null,
	});
};

Dianomi.prototype.dianomiFeredata = function() {
	return Server.feredataFormat.call(this, {
		kodikos: null,
		trapezi: null,
		dealer: null,
		kasa1: null,
		metrita1: null,
		kasa2: null,
		metrita2: null,
		kasa3: null,
		metrita3: null,
	});
};

Energia.prototype.energiaFeredata = function(sinedria, trapezi) {
	var prosarmogi;

	prosarmogi = 'energiaProsarmogi' + this.energiaIdosGet();
	if (typeof this[prosarmogi] === 'function')
	return this[prosarmogi](sinedria, trapezi);

	return JSON.stringify(this);
};

Sizitisi.prototype.sizitisiFeredata = function() {
	return Server.feredataFormat.call(this, {
		kodikos: null,
		pektis: null,
		trapezi: null,
		sxolio: null,
		pote: null,
	});
};

Sinedria.prototype.sinedriaFeredata = function() {
	return Server.feredataFormat.call(this, {
		pektis: null,
		isodos: null,
		trapezi: null,
		thesi: null,
		simetoxi: null,
	});
};

Prosklisi.prototype.prosklisiFeredata = function() {
	return Server.feredataFormat.call(this, {
		kodikos: null,
		trapezi: null,
		apo: null,
		pros: null,
		epidosi: null,
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Energia.prototype.energiaProsarmogiΔΙΑΝΟΜΗ = function(sinedria) {
	var plati, krimena, i, fila, alif, s;

	plati = sinedria.sinedriaPlatiRBGet();
	krimena = '';
	for (i = 0; i < 10; i++) krimena += plati + 'V';

	fila = this.energiaDataGet();

	if (sinedria.sinedriaOxiPektis() || Debug.flagGet('striptiz')) {
		// Ίσως κάποιος πει ότι εδώ πρέπει να παρεμβληθεί κώδικας
		// σχετικά με την απόκρυψη των φύλλων στους θεατές. Αυτό,
		// αν και θεωρητικά είναι σωστό, δημιουργεί πολλά τεχνικά
		// προβλήματα οπότε προτιμάμε να αποκρύψουμε τα φύλλα κατά
		// την εμφάνισή τους στο DOM.

		alif = fila.substr(0, 60);
	}
	else {
		switch (sinedria.sinedriaThesiGet()) {
		case 1:
			alif = fila.substr(0, 20) + krimena + krimena;
			break;
		case 2:
			alif = krimena + fila.substr(20, 20) + krimena;
			break;
		case 3:
			alif = krimena + krimena + fila.substr(40, 20);
			break;
		default:
			alif = krimena + krimena + krimena;
			break;
		}
	}

	alif += krimena.substr(0, 4);
	this.data = alif;
	s = JSON.stringify(this);
	this.data = fila;
	return s;
};

Energia.prototype.energiaProsarmogiΤΖΟΓΟΣ = function(sinedria) {
	var trapezi, plati, krimena, i, fila, alif, s;

	fila = this.energiaDataGet();

	if (sinedria.sinedriaOxiPektis()) alif = fila;
	else if ((sinedria.sinedriaThesiGet() === this.energiaPektisGet()) || Debug.flagGet('striptiz')) alif = fila;
	else {
		plati = sinedria.sinedriaPlatiRBGet();
		alif = '';
		for (i = 0; i < 2; i++) alif += plati + 'V';
	}

	this.data = alif;
	s = JSON.stringify(this);
	this.data = fila;
	return s;
};

Sinedria.prototype.tsoxaNeoteraEpikefalida = function(nodereq) {
	if (!this.tsoxaNeoteraNone)
	return this;

	nodereq.write('partida: {\n');
	this.tsoxaNeoteraNone = false;
	return this;
};

Sinedria.prototype.tsoxaNeoteraKlisimo = function(nodereq) {
	if (this.tsoxaNeoteraNone)
	return this;

	nodereq.write('},\n');
	return this;
};
