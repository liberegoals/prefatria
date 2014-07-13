// Θα χρησιμοποιήσουμε ένα global σκηνικό για την αρένα μας. Σ' αυτό το σκηνικό
// θα φορτώσουμε παίκτες, τραπέζια, προσκλήσεις, συνεδρίες κλπ.

Arena.skiniko = new Skiniko();

// Ο μετρητής "feredataID" μετρά τα πάσης φύσεως αιτήματα feredata και
// αποστέλλεται στον skiser με σκοπό να παραληφθεί εκ νέου μαζί με τα όποια
// αποτελέσματα. Κατά την παραλαβή ελέγχεται και αν βρεθεί παρωχημένος
// τα αποτελέσματα αγνοούνται καθώς αυτό σημαίνει ότι έχει ήδη υποβληθεί
// νεότερο αίτημα feredata.

Arena.feredataID = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το στήσιμο του σκηνικού στον client γίνεται μέσω αιτήματος feredata για πλήρη
// σκηνικά δεδομένα.

Skiniko.prototype.stisimo = function(callback) {
	var skiniko = this;

	Arena.feredataID++;
	if (Debug.flagGet('feredata'))
	console.log('Ζητήθηκαν πλήρη σκηνικά δεδομένα (id = ' + Arena.feredataID + ')');

	Client.skiserService('fereFreska', 'id=' + Arena.feredataID).
	done(function(rsp) {
		skiniko.processFreskaData(rsp);
		if (callback) callback.call(skiniko);
	}).
	fail(function(err) {
		skiniko.feredataError(err);
	});

	return this;
};

Skiniko.prototype.processFreskaData = function(rsp) {
	var skiniko = this, data, trapezi;

	// Εκτυπώνουμε διάφορα μηνύματα ελέγχου στην κονσόλα του browser.

	if (Debug.flagGet('feredata')) {
		try {
			console.groupCollapsed('Παρελήφθησαν πλήρη σκηνικά δεδομένα');
		} catch (e) {
			console.log('Παρελήφθησαν πλήρη σκηνικά δεδομένα');
		}
		console.log(rsp);
		try {
			console.groupEnd();
		} catch(e) {}
	}

	// Επιχειρούμε να μεταφράσουμε τα παραληφθέντα δεδομένα ως json data και αν
	// αποτύχουμε ζητάμε νέα σκηνικά δεδομένα.

	try {
		eval('data = {' + rsp + '};');
	} catch(e) {
		this.feredataError('Παρελήφθησαν λανθασμένα σκηνικά δεδομένα', rsp);
		return this;
	}

	// Ελέχουμε το id των παραληφθέντων δεδομένων. Αν δεν εντοπίσουμε id παραλαβής
	// θεωρούμε ότι παραλάβαμε λανθασμένα δεδομένα και επιχειρούμε εκ νέου.

	if (!data.hasOwnProperty('id')) {
		this.feredataError('Ακαθόριστο ID πακέτου σκηνικών δεδομένων', rsp);
		return this;
	}

	// Τα δεδομένα μας διαθέτουν id παραλαβής. Για να διαχειριστούμε τα δεδομένα πρέπει
	// το id να συμφωνεί με το id του τελευταίου αιτήματός μας, αλλιώς τα αγνοούμε.

	if (data.id !== Arena.feredataID) return this;

	// Τα δεδομένα μας φαίνονται ορθά και διαχειρίσιμα. Καθαρίζουμε τυχόν δείκτες λαθών
	// επικοινωνίας και αμέσως μετά θα επιχειρήσουμε το στήσιμο του σκηνικού με τα
	// δεδομένα που παραλάβαμε.

	if (this.hasOwnProperty('feredataErrorCount')) {
		Client.fyi.pano();
		delete this.feredataErrorCount;
	}

	// Καθαρίζουμε τις βασικές λίστες αντικειμένων του σκηνικού δημιουργώντας
	// ουσιαστικά ένα κενό σκηνικό.

	this.skinikoReset();

	// Φορτώνουμε τους παίκτες και τις παραμέτρους τους.

	Globals.awalk(data.pektis, function(i, pektis) {
		skiniko.skinikoPektisSet(new Pektis(pektis));
	});

	Globals.walk(data.peparam, function(pektis, peparam) {
		pektis = skiniko.skinikoPektisGet(pektis);
		if (pektis) pektis.peparam = peparam;
	});

	// Φορτώνουμε τα τραπέζια και τις διανομές τους.

	Globals.awalk(data.trapezi, function(i, trapezi) {
		skiniko.skinikoTrapeziSet(new Trapezi(trapezi));
	});

	Globals.awalk(data.dianomi, function(i, dianomi) {
		var trapezi;

		dianomi = new Dianomi(dianomi);
		trapezi = skiniko.skinikoTrapeziGet(dianomi.dianomiTrapeziGet());
		if (!trapezi) return;

		trapezi.trapeziDianomiSet(dianomi);
		trapezi.dianomiArray.push(dianomi);
	});

	// Φορτώνουμε τις προσκλήσεις που μας αφορούν.

	Globals.awalk(data.prosklisi, function(i, prosklisi) {
		skiniko.skinikoProsklisiSet(new Prosklisi(prosklisi));
	});

	// Φορτώνουμε τις συνεδρίες.

	Globals.awalk(data.sinedria, function(i, sinedria) {
		skiniko.skinikoSinedriaSet(new Sinedria(sinedria));
	});

	// Φορτώνουμε τη δημόσια συζήτηση.

	Globals.awalk(data.sizitisi, function(i, sizitisi) {
		skiniko.skinikoSizitisiSet(new Sizitisi(sizitisi));
	});

	// Έχουμε διαχειριστεί και φορτώσει τα βασικά δεδομένα του σκηνικού και ήρθε
	// η ώρα να διαχειριστούμε τυχόν δεδομένα παρτίδας και να απεικονίσουμε το
	// σκηνικό στο DOM. Αφού κάνουμε τα παραπάνω αποστέλλουμε αίτημα μεταβολών.

	this.
	egoDataSet(data).
	processPartidaData(data).
	skinikoCreateDOM(data).
	anamoniAlages();

	return this;
};

Skiniko.prototype.egoDataSet = function(data) {
	Arena.ego.sinedria = this.skinikoSinedriaGet(Client.session.pektis);
	if (!Arena.ego.sinedria) Client.provlima('Δεν βρέθηκε συνεδρία παίκτη');

	Arena.ego.pektis = this.skinikoPektisGet(Client.session.pektis);
	if (!Arena.ego.pektis) Client.provlima('Δεν βρέθηκε εγγραφή παίκτη στο σκηνικό');

	if (data) Arena.ego.pektis.sxesi = data.sxesi;

	Arena.ego.trapeziKodikos = Arena.ego.sinedria.sinedriaTrapeziGet();
	Arena.ego.trapezi = this.skinikoTrapeziGet(Arena.ego.trapeziKodikos);
	if (Arena.ego.trapezi) Arena.flags.partidaMode = false;

	return this;
};

// Η μέθοδος "processPartidaData" δέχεται μια αναφορά στα παραληφθέντα δεδομένα και τα διορθώνει
// όσον αφορά στα δεδομένα παρτίδας. Πιο συγκεκριμένα, διασφαλίζει την ύπαρξη των δεδομένων
// παρτίδας δηλαδή την ύπαρξη array συζήτησης και array ενεργειών, εφόσον, βεβαίως, υπάρχει
// τρέχουσα παρτίδα για τον χρήστη που τρέχει το πρόγραμμα.
//
// Κατά δεύτερον μετατρέπει τα arrays αυτά σε arrays αντικειμένων συζήτησης και ενεργειών
// αντίστοιχα.
//
// Τέλος, ταξινομεί τα arrays ως προς τον κωδικό οπότε τα στοιχεία θα  προσπελαστούν με
// χρονική σειρά.

Skiniko.prototype.processPartidaData = function(data) {
	var trapeziKodikos, trapezi, dianomi, dianomiKodikos;

	// Αν δεν υπάρχει τραπέζι για τον παίκτη δεν υπάρχει λόγος να ασχοληθούμε
	// με τυχόν δεδομένα παρτίδας.

	trapeziKodikos = Arena.ego.sinedria.sinedriaTrapeziGet();
	if (!trapeziKodikos) return this;

	trapezi = this.skinikoTrapeziGet(trapeziKodikos);
	if (!trapezi) return this;

	// Διασφαλίσαμε την ύπαρξη τρέχοντος τραπεζιού για τον παίκτη και προχωρούμε στον
	// έλεγχο των στοιχείων παρτίδας. Ως γνωστόν τα στοιχεία παρτίδας αποτελούνται
	// από δύο λίστες:
	//
	//	partida.sizitisi	Πρόκειται για τα σχόλια της συζήτησης του τραπεζιού
	//				που δεν έχουμε παραλάβει ακόμη.
	//
	//	partida.energia		Πρόκειται για τις ενέργειες της τελευταίας διανομής
	//				του τραπεζιού που δεν έχουμε παραλάβει ακόμη.

	if (!data.partida) data.partida = {};

	// Ελέγχουμε, διορθώνουμε, ταξινομούμε και εντάσσουμε τα δεδομένα που αφορούν
	// στη συζήτηση της παρτίδας.

	if (!data.partida.sizitisi) data.partida.sizitisi = [];
	else if (data.partida.sizitisi.length > 0) {
		data.partida.sizitisi.sort(function(s1, s2) {
			if (s1.kodikos < s2.kodikos) return -1;
			if (s1.kodikos > s2.kodikos ) return 1;
			return 0;
		});

		Globals.awalk(data.partida.sizitisi, function(i, sizitisi) {
			sizitisi.trapezi = trapeziKodikos;
			data.partida.sizitisi[i] = new Sizitisi(sizitisi);
			trapezi.trapeziSizitisiSet(data.partida.sizitisi[i]);
		});

	}

	// Ελέγχουμε, διορθώνουμε, ταξινομούμε και εντάσσουμε τα δεδομένα που αφορούν
	// στις ενέργειες της τρέχουσας διανομής της παρτίδας.

	dianomi = trapezi.trapeziTelefteaDianomi();
	if (!dianomi) data.partida.energia = [];
	else if (!data.partida.energia) data.partida.energia = [];
	else if (data.partida.energia.length > 0) {
		data.partida.energia.sort(function(s1, s2) {
			if (s1.kodikos < s2.kodikos) return -1;
			if (s1.kodikos > s2.kodikos ) return 1;
			return 0;
		});

		dianomiKodikos = dianomi.dianomiKodikosGet();
		Globals.awalk(data.partida.energia, function(i, energia) {
// TODO
			if (energia.dianomi != dianomiKodikos) return;
			data.partida.energia[i] = new Energia(energia);

			dianomi.dianomiEnergiaSet(energia);
			dianomi.energiaArray.push(energia);
		});

	}

	return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.anamoniAlages = function() {
	var skiniko = this;

	if (Debug.flagGet('feredata')) console.log('Αναμένονται μεταβολές');
	Arena.feredataID++;
	Client.skiserService('fereAlages', 'id=' + Arena.feredataID).
	done(function(rsp) {
		skiniko.processAlages(rsp);
	}).
	fail(function(err) {
		skiniko.feredataError(err);
	});

	return this;
};

Skiniko.prototype.processAlages = function(rsp) {
	var skiniko = this, data, trapeziPrin;

	switch (rsp) {

	// Δεν έχει αλλάξει τίποτα, το αίτημα feredata έληξε και θα πρέπει
	// να δρομολογηθεί νέο.

	case '=':
		if (Debug.flagGet('feredata')) console.log('\t' + rsp, '(δεν άλλαξε κάτι)');
		this.anamoniAlages();
		return this;

	// Το αίτημα feredata κατέστη παρωχημένο λόγω υποβολής νεότερου αιτήματος
	// feredata.

	case '~':
		if (Debug.flagGet('feredata')) console.log('\t' + rsp, '(υποβλήθηκε νεότερο αίτημα)');
		return this;

	// Ο skiser διατάσσει έξοδο του παρόντος client. Αυτό μπορεί να συμβεί
	// είτε κατά την ρητή έξοδο του παίκτη, είτε κατά την επανείσοδο μέσω
	// νέας συνεδρίας.

	case '_':
		if (Debug.flagGet('feredata')) console.log('\t' + rsp, '(πραγματοποιήθηκε έξοδος)');
		$.ajax('account/exodos.php', {async: false});
		self.location = Client.server;
		return this;

	// Ο skiser μπορεί να διακόψει την επικοινωνία είτε επειδή παρήλθε πολύς
	// χρόνος απραξίας για κάποια συνεδρία, είτε επειδή με κάποιον τρόπο
	// ο παίκτης κατάφερε να επανεισέλθει χωρίς επανείσοδο, π.χ. ανοίγοντας
	// νέα καρτέλα της εφαρμογής από τον ίδιο browser.

	case '-':
		if (Debug.flagGet('feredata')) console.log('\t' + rsp, '(διακοπή της επικοινωνίας)');
		Client.provlima('Ο server σκηνικού διέκοψε την επικοινωνία');
		return this;

	// Παρουσιάστηκε κάποιο πρόβλημα στην ομαλή ενημέρωση σκηνικών δεδομένων
	// και θα πρέπει να δρομολογηθεί νέος κύκλος εκκινώντας με πλήρη σκηνικά
	// δεδομένα.

	case '?':
		this.feredataError('κρίθηκε αναγκαία η πλήρης επανασύσταση του σκηνικού');
		return this;
	}

	// Έχουν επιστραφεί δεδομένα. Αρχικά ενημερώνουμε την κονσόλα του browser.

	if (Debug.flagGet('feredata')) {
		try {
			console.groupCollapsed('Παρελήφθησαν μεταβολές');
		} catch(e) {
			console.log('Παρελήφθησαν μεταβολές');
		}
		console.log(rsp);
		try {
			console.groupEnd();
		} catch(e) {}
	}

	// Μεταφράζουμε τα δεδομένα ως json data και αν αποτύχουμε ζητάμε πλήρη
	// σκηνικά δεδομένα.

	try {
		eval('data = {' + rsp + '};');
	} catch(e) {
		this.feredataError('Παρελήφθησαν λανθασμένες κινήσεις', rsp);
		return this;
	}

	// Διασφαλίζουμε την ύπαρξη id στα παραληφθέντα δεδομένα. Αν δεν υπάρχει
	// id, ζητάμε εκ νέου πλήρη σκηνικά δεδομένα.

	if (!data.hasOwnProperty('id')) {
		this.feredataError('Ακαθόριστο ID πακέτου μεταβολών', rsp);
		return this;
	}

	// Διασφαλίσαμε την ύπαρξη id στα παραληφθέντα δεδομένα. Αυτό το id πρέπει
	// να συμφωνεί με το id του τελευταίου αιτήματος σκηνικών δεδομένων, αλλιώς
	// αγνοούμε τα δεδομένα.

	if (data.id !== Arena.feredataID) return this;

	// Κρατάμε το τραπέζι του χρήστη πριν την παραλαβή και την επεξεργασία των
	// δεδομένων γιατί θα μας χρειαστεί.

	trapeziPrin = Arena.ego.sinedria.sinedriaTrapeziGet();

	// Έχει επιστραφεί array κινήσεων και νεότερα δεδομένα παρτίδας. Πρόκειται
	// για μεταβολές που επήλθαν μετά την τελευταία παραλαβή feredata και για
	// δεδομένα που αφορούν στην τρέχουσα παρτίδα και δεν έχουμε παραλάβει ακόμη.

	if (data.kinisi) Globals.awalk(data.kinisi, function(i, kinisi) {
		data.kinisi[i] = new Kinisi(kinisi);
		skiniko.processKinisi(kinisi);
	});

	this.processAlagesPartida(data, trapeziPrin);

	this.anamoniAlages();
	return this;
};

Skiniko.prototype.processAlagesPartida = function(data, trapeziPrin) {
	var trapeziMeta, trapezi;

	trapeziMeta = Arena.ego.sinedria.sinedriaTrapeziGet();
	if (!trapeziMeta) {
		if (trapeziPrin) Arena.partida.refreshDOM();
		return this;
	}

	this.processPartidaData(data);

	if (trapeziMeta != trapeziPrin) {
		Arena.partida.refreshDOM();
		return this;
	}

	// Δεν έχει αλλάξει το τραπέζι του χρήστη. Όλα τα στοιχεία έχουν ενημερωθεί
	// στο σκηνικό και αυτό που έχουμε να κάνουμε τώρα είναι, ενδεχομένως, κάποιο
	// animation που θα καταλήξει στο νέο DOM.

	if (data.partida.sizitisi.length) {
		Globals.awalk(data.partida.sizitisi, function(i, sizitisi) {
			if (sizitisi.sizitisiPektisGet().isEgo()) Arena.sizitisi.proepiskopisiDOM.empty();
			sizitisi.sizitisiCreateDOM();
		});

		if (Arena.sizitisi.oxiPagomeni()) Arena.sizitisi.areaDOM.scrollKato();
	}

	return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Σε περίπτωση προβλήματος επικοινωνίας σε αίτημα feredata επιχειρείται επαναστήσιμο
// του σκηνικού. Αυτή η διαδικασία επαναλαμβάνεται με χρονική καθυστέρηση η οποία
// σιγά σιγά αυξάνει και μετά από εύλογο αριθμό επαναλήψεων προκαλεί έξοδο από το
// πρόγραμμα.

Skiniko.prototype.feredataError = function(err, rsp) {
	var skiniko = this, delay;

	console.error(rsp);
	if (!this.hasOwnProperty('feredataErrorCount')) {
		Client.skiserFail(err);
		this.feredataErrorCount = 1;
		delay = 100;
	}
	else if (this.feredataErrorCount++ < 5) delay = 200;
	else if (this.feredataErrorCount < 10) delay = 500;
	else if (this.feredataErrorCount < 15) delay = 1000;
	else return Client.provlima('feredata error');

	setTimeout(function() {
		skiniko.stisimo();
	}, delay);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Skiniko.prototype.skinikoCreateDOM = function(data) {
	var skiniko = this;

	Arena.kafenio.rebelosDOM.empty();
	Arena.kafenio.trapeziDOM.empty();
	Arena.prosklisi.areaDOM.empty();
	Arena.anazitisi.areaDOM.empty();
	Arena.sizitisi.kafenioDOM.empty();

	Globals.awalk(data.trapezi.sort(function(t1, t2) {
		if (t1.kodikos < t2.kodikos) return -1;
		if (t1.kodikos > t2.kodikos) return 1;
		return 0;
	}), function(i, trapezi) {
		trapezi = skiniko.skinikoTrapeziGet(trapezi.kodikos);
		if (trapezi) trapezi.trapeziCreateDOM();
	});

	Globals.awalk(data.sinedria.sort(function(s1, s2) {
		if (s1.isodos < s2.isodos) return -1;
		if (s1.isodos > s2.isodos) return 1;
		return 0;
	}), function(i, sinedria) {
		sinedria = skiniko.skinikoSinedriaGet(sinedria.pektis);
		if (sinedria) sinedria.sinedriaCreateDOM();
	});

	Globals.awalk(data.prosklisi.sort(function(p1, p2) {
		if (p1.kodikos < p2.kodikos) return -1;
		if (p1.kodikos > p2.kodikos) return 1;
		return 0;
	}), function(i, prosklisi) {
		prosklisi = skiniko.skinikoProsklisiGet(prosklisi.kodikos);
		if (prosklisi) prosklisi.prosklisiCreateDOM();
	});

	Globals.awalk(data.sizitisi.sort(function(s1, s2) {
		if (s1.kodikos < s2.kodikos) return -1;
		if (s1.kodikos > s2.kodikos) return 1;
		return 0;
	}), function(i, sizitisi) {
		sizitisi = skiniko.skinikoSizitisiGet(sizitisi.kodikos);
		if (sizitisi) sizitisi.sizitisiCreateDOM();
	});

	// Ενημερώνουμε τα τμήματα του DOM που αφορούν στην παρτίδα του παίκτη.

	Arena.partida.refreshDOM();

	// Η συζήτηση του καφενείου και το τραπεζιού εμφανίζεται στον ίδιο χώρο.
	// Έχουν ήδη προστεθεί τα σχετικά DOM elements και κανονίζουμε τώρα την
	// εμφάνιση των τελευταίων σχολίων.

	if (Arena.sizitisi.oxiPagomeni())
	Arena.sizitisi.areaDOM.scrollKato();

	// Όταν κάνουμε restart τον skiser οι ενεργές συνεδρίες λαμβάνουν φρέσκα σκηνικά
	// δεδομένα στα οποία υπάρχει και attribute "reset".

	if (data.reset)
	Client.fyi.pano('Επαναδιαμορφώθηκε το σκηνικό του καφενείου');

	Arena.panelRefresh();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Pektis.prototype.pektisFormaPopupDOM = function(e) {
	Arena.inputRefocus(e);

	Arena.pektisFormaDOM.empty().
	data('pektis', this.pektisLoginGet()).
	append(Client.klisimo(function() {
		Arena.pektisFormaKlisimo(200);
	})).
	append(Arena.pektisPanelDOM = $('<div>').attr('id', 'pektisPanel').
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}));
	Arena.pektisPanelRefreshDOM();
	Arena.pektisFormaDOM.anadisi().finish().fadeIn('fast');
	return this;
};

Arena.pektisFormaKlisimo = function(delay) {
	if (delay === undefined) delay = 200;
	Arena.pektisFormaDOM.finish().fadeOut(delay, function() {
		Arena.pektisFormaDOM.empty();
		delete Arena.pektisPanelDOM;
	});

	return Arena;
};

Arena.pektisPanelRefreshDOM = function() {
	var login, pektis, prosklisiButton;

	if (!Arena.pektisPanelDOM) return Arena;
	Arena.pektisPanelDOM.empty();

	if (!Arena.pektisFormaDOM) return Arena;
	login = Arena.pektisFormaDOM.data('pektis');
	if (!login) return Arena;
	pektis = Arena.skiniko.skinikoPektisGet(login);
	if (!pektis) return Arena;

	Arena.pektisPanelDOM.
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	append(prosklisiButton = $('<button>').text('Πρόσκληση').on('click', function(e) {
		var button = $(this);

		Arena.inputRefocus(e);
		if ($(this).data('apostoli')) return;

		if (!Arena.ego.trapezi) return Client.fyi.epano('Απροσδιόριστο τραπέζι');
		if (Arena.ego.sinedria.sinedriaOxiPektis()) return Client.fyi.epano('Δεν είστε παίκτης στο τραπέζι');

		Client.fyi.pano('Αποστολή πρόσκλησης. Παρακαλώ περιμένετε…');
		Client.skiserService('prosklisiApostoli', 'pros=' + login.uri()).
		done(function(rsp) {
			Arena.pektisFormaKlisimo(100);
			button.removeData('apostoli');
			Client.fyi.pano();
		}).
		fail(function(err) {
			button.removeData('apostoli');
			Client.skiserFail(err);
		});
	})).
	append($('<button>').text('Μήνυμα'));

	if (Arena.ego.isFilos(login)) Arena.pektisPanelDOM.append($('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/misc/Xgreen.png',
		title: 'Ανάκληση φιλίας',
	}).on('click', function(e) {
		Arena.alagiSxesis(e, login);
	}));
	else Arena.pektisPanelDOM.append($('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/misc/filos.png',
		title: 'Φίλος',
	}).on('click', function(e) {
		Arena.alagiSxesis(e, login, 'ΦΙΛΟΣ');
	}));

	if (Arena.ego.isApoklismenos(login)) Arena.pektisPanelDOM.append($('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/misc/Xred.png',
		title: 'Άρση αποκλεισμού',
	}).on('click', function(e) {
		Arena.alagiSxesis(e, login);
	}));
	else Arena.pektisPanelDOM.append($('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/misc/apoklismos.png',
		title: 'Αποκλεισμός',
	}).on('click', function(e) {
		Arena.alagiSxesis(e, login, 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ');
	}));

	prosklisiButton.css('display', Arena.ego.isPektis() ? 'inline-block' : 'none');
	Arena.pektisPanelDOM.append($('<div>').attr('id', 'pektisFormaOnoma').text(login));
	return Arena;
};

// Η αλλαγή σχέσης δεν αφορά κανέναν παρά μόνον τον παίκτη που την αλλάζει.
// Έτσι στέλνουμε την αλλαγή στον skiser και κατά την επιστροφή επιτελούμε
// αυτά που θα κάναμε αν η αλλαγή σχέσης ερχόταν ως κίνηση από τον skiser.
// Αυτή η τακτική δεν είναι η προσήκουσα, καθώς αν κάνουμε αλλαγή σχέσης
// με κάποιον άλλον τρόπο, ο skiser δεν έχει τον τρόπο να ενημερώσει τον
// παίκτη.

Arena.alagiSxesis = function(e, login, sxesi) {
	Arena.inputRefocus(e);
	Client.skiserService('sxesi', 'pektis=' + login, 'sxesi=' + sxesi).
	done(function(rsp) {
		var sinedria, thesi;

		Arena.ego.pektis.pektisSxesiSet(login, sxesi);
		Arena.pektisPanelRefreshDOM(Arena.skiniko.skinikoPektisGet(login));

		// Αλλάζουμε την εμφάνιση του σχετιζόμενου/αποσυσχετιζόμενου
		// παίκτη στα τραπέζια του καφενείου.

		Arena.skiniko.pektisEntopismosDOM(login);

		// Μένει να δούμε αν ο συσχετιζόμενος/αποσυσχετιζόμενος παίκτης
		// είναι ενεργός, οπότε θα πρέπει να ενημερώσουμε τις εμφανίσεις
		// του στις διάφορες περιοχές του καφενείου.

		sinedria = Arena.skiniko.skinikoSinedriaGet(login);
		if (!sinedria) return;

		sinedria.
		sinedriaNiofertosRefreshDOM().
		sinedriaRebelosRefreshDOM().
		sinedriaTheatisRefreshDOM();
	}).
	fail(function(err) {
		Client.skiserFail(err);
	});
};

Arena.panelRefresh = function() {
	Arena.cpanel.bpanelRefresh();
	Arena.pektisPanelRefreshDOM();
	return Arena;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Sinedria.prototype.sinedriaCreateDOM = function() {
	var skiniko, pektis, trapezi;

	skiniko = this.sinedriaSkinikoGet();
	if (!skiniko) return this;
	pektis = skiniko.skinikoPektisGet(this.sinedriaPektisGet());

	if (this.hasOwnProperty('rebelosDOM')) this.rebelosDOM.remove();
	this.rebelosDOM = $('<div>').addClass('pektis rebelos').data('pektis', pektis).
	on('click', function(e) {
		pektis.pektisFormaPopupDOM(e);
	});
	this.sinedriaRebelosRefreshDOM();

	if (this.hasOwnProperty('theatisDOM')) this.theatisDOM.remove();
	this.theatisDOM = $('<div>').addClass('pektis theatis').data('pektis', pektis).
	on('click', function(e) {
		pektis.pektisFormaPopupDOM(e);
	});
	if (this.hasOwnProperty('tsoxaTheatisDOM')) this.tsoxaTheatisDOM.remove();
	this.tsoxaTheatisDOM = $('<div>').addClass('pektis tsoxaTheatis').data('pektis', pektis).
	on('click', function(e) {
		pektis.pektisFormaPopupDOM(e);
	});
	this.sinedriaTheatisRefreshDOM();

	if (this.hasOwnProperty('niofertosDOM')) this.niofertosDOM.remove();
	this.niofertosDOM = $('<div>').addClass('pektis niofertos').data('pektis', pektis).
	on('click', function(e) {
		pektis.pektisFormaPopupDOM(e);
	});
	this.
	sinedriaNiofertosRefreshDOM().
	sinedriaNiofertosPushDOM();

	trapezi = this.sinedriaTrapeziGet();
	if (!trapezi) {
		Arena.kafenio.rebelosDOM.prepend(this.rebelosDOM);
		return this;
	}

	if (this.sinedriaOxiTheatis())
	return this;

	trapezi = skiniko.skinikoTrapeziGet(trapezi);
	if (!trapezi) return this;

	trapezi.trapeziTheatisPushDOM(this);
	return this;
};

Sinedria.prototype.sinedriaNiofertosRefreshDOM = function() {
	this.sinedriaSxesiRefreshDOM(this.niofertosDOM);
	return this;
};

Sinedria.prototype.sinedriaNiofertosPushDOM = function() {
	var dom;

	dom = Arena.partida.niofertosDOM.children('.niofertos');
	if (dom.length > 3) dom.last().remove();

	Arena.partida.niofertosDOM.prepend(this.niofertosDOM);
	return this;
};

Sinedria.prototype.sinedriaRebelosRefreshDOM = function() {
	this.sinedriaSxesiRefreshDOM(this.rebelosDOM);
	return this;
};

Sinedria.prototype.sinedriaTheatisRefreshDOM = function() {
	this.sinedriaSxesiRefreshDOM(this.theatisDOM, this.tsoxaTheatisDOM);
	return this;
};

Sinedria.prototype.sinedriaDetachRebelosDOM = function() {
	if (!this.rebelosDOM) return this;
	this.rebelosDOM.detach();
	return this;
};

Sinedria.prototype.sinedriaSxesiRefreshDOM = function() {
	var login, i, dom;

	login = this.sinedriaPektisGet();
	for (i = 0; i < arguments.length; i++) {
		dom = arguments[i];
		dom.removeClass('filos apoklismenos ego').text(login);
		if (login.isEgo()) dom.addClass('ego');
		else if (Arena.ego.isFilos(login)) dom.addClass('filos');
		else if (Arena.ego.isApoklismenos(login)) dom.addClass('apoklismenos');
	}

	return this;
};

Sinedria.prototype.sinedriaDetachTheatisDOM = function() {
	if (this.theatisDOM) this.theatisDOM.detach();
	if (this.tsoxaTheatisDOM) this.tsoxaTheatisDOM.detach();
	return this;
};

Sinedria.prototype.sinedriaDetachNiofertosDOM = function() {
	if (!this.niofertosDOM) return this;
	this.niofertosDOM.detach();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Trapezi.prototype.trapeziGetDOM = function() {
	return this.DOM;
};

Trapezi.prototype.trapeziCreateDOM = function() {
	var trapezi = this, klikarismeno = false;

	if (this.hasOwnProperty('DOM')) this.DOM.empty();
	else this.DOM = $('<div>').addClass('trapezi').prependTo(Arena.kafenio.trapeziDOM);

	this.DOM.
	append($('<hr>').addClass('trapeziFraktis')).
	append(this.tsoxaDOM = $('<div>').addClass('trapeziTsoxa')).
	append(this.optsDOM = $('<div>').addClass('trapeziOpts')).
	append(this.theatisDOM = $('<div>').addClass('trapeziTheatis'));
	this.trapeziSimetoxiRefreshDOM();

	this.tsoxaDOM.append(this.dataDOM = $('<div>').addClass('trapeziData').
	on('click', function(e) {
		var trapeziKodikos;

		Arena.inputRefocus(e);
		if (klikarismeno) return;

		// Αν ο χρήστης κάνει κλικ στο τραπέζι που ήδη έχει επιλέξει, τότε απλώς
		// εμφανίζεται η παρτίδα.

		if (Arena.ego.sinedria.sinedriaTrapeziGet() === trapezi.trapeziKodikosGet()) {
			Arena.partidaModeSet();
			return;
		}

		trapeziKodikos = trapezi.trapeziKodikosGet();
		Client.fyi.pano('Είσοδος στο τραπέζι ' + trapeziKodikos + '. Παρακαλώ περιμένετε…');
		klikarismeno = true;
		Client.skiserService('trapeziEpilogi', 'trapezi=' + trapeziKodikos).
		done(function() {
			klikarismeno = false;
			Client.fyi.pano();
		}).
		fail(function(err) {
			klikarismeno = false;
			Client.fyi.pano();
			Client.skiserFail(err);
		});
	}));
	this.trapeziDataRefreshDOM();

	this.trapeziOptsRefreshDOM();

	this.thesiDOM = {};
	this.trapeziThesiWalk(function(thesi) {
		this.tsoxaDOM.append(this.thesiDOM[thesi] = $('<div>').addClass('pektis trapeziPektis'));
		this.trapeziThesiRefreshDOM(thesi);
	});

	return this;
};

Trapezi.prototype.trapeziRefreshDOM = function() {
	this.trapeziCreateDOM();
	return this;
};

// Η μέθοδος "trapeziSimetoxiRefreshDOM" ενημερώνει το χρώμα της τσόχας του τραπεζιού
// στο καφενείο, ανάλογα με το αν ο χρήστης είναι θεατής ή όχι στο ανά χείρας τραπέζι.

Trapezi.prototype.trapeziSimetoxiRefreshDOM = function() {
	this.tsoxaDOM.removeClass('trapeziTsoxaTheatis');
	if (Arena.ego.oxiTrapezi(this)) return this;
	if (Arena.ego.oxiTheatis()) return this;
	this.tsoxaDOM.addClass('trapeziTsoxaTheatis');
	return this;
};

Trapezi.prototype.trapeziDataRefreshDOM = function() {
	var ipolipo, kodikos;

	kodikos = this.trapeziKodikosGet();
	ipolipo = this.trapeziIpolipoGet();

	this.dataDOM.empty().
	removeClass('trapeziDataEpilogi trapeziDataProsklisi').
	append($('<div>').addClass('trapeziDataKodikos').
	attr('title', 'Κωδικός τραπεζιού: ' + kodikos).text(kodikos)).

	append($('<div>').addClass('trapeziDataIpolipo').
	attr('title', 'Τρέχον υπόλοιπο κάσας: ' + ipolipo + ' καπίκια').text(ipolipo / 10));

	if (Arena.ego.isTrapezi(this)) this.dataDOM.addClass('trapeziDataEpilogi');
	else if (Arena.ego.isProsklisi(this)) this.dataDOM.addClass('trapeziDataProsklisi');

	this.DOM.find('.trapeziTelosIcon').remove();
	if (ipolipo <= 1000)
	this.tsoxaDOM.append($('<img>').addClass('trapeziTelosIcon').attr({
		src: 'ikona/endixi/telos.png',
		title: 'Η κάσα έχει τελειώσει',
	}));

	return this;
};

Trapezi.prototype.trapeziOptsRefreshDOM = function() {
	this.optsDOM.empty();
	if (this.trapeziOxiAsoi()) this.trapeziOptionDOM('Δεν παίζονται οι άσοι', 'asoiOn.png');
	if (this.trapeziIsPaso()) this.trapeziOptionDOM('Παίζεται το πάσο', 'pasoOn.png');
	return this;
};

Trapezi.prototype.trapeziOptionDOM = function(desc, img) {
	this.optsDOM.append($('<img>').addClass('trapeziOption').attr({
		title: desc,
		src: 'ikona/panel/' + img,
	}));
	return this;
};

Trapezi.prototype.trapeziThesiRefreshDOM = function(thesi) {
	var skiniko, dom, login, pektis, sinedria;

	if (thesi === undefined) return this.trapeziThesiWalk(function(thesi) {
		this.trapeziThesiRefreshDOM(thesi);
	});

	skiniko = this.trapeziSkinikoGet();
	if (!skiniko) return this;

	dom = this.thesiDOM[thesi];
	dom.removeClass('offline fantasma filos apoklismenos ego');

	login = this.trapeziPektisGet(thesi);
	if (login) {
		dom.text(login);
		sinedria = skiniko.skinikoSinedriaGet(login);
		if (!sinedria) dom.addClass('offline');
		if (login.isEgo()) dom.addClass('ego');
		else if (Arena.ego.isFilos(login)) dom.addClass('filos');
		else if (Arena.ego.isApoklismenos(login)) dom.addClass('apoklismenos');
	}
	else {
		login = this.trapeziTelefteosGet(thesi);
		if (login) dom.addClass('fantasma').text(login);
	}

	pektis = login ? skiniko.skinikoPektisGet(login) : null;
	if (pektis) dom.on('click', function(e) {
		pektis.pektisFormaPopupDOM(e);
	});
	else dom.off('click').html('&mdash;');

	return this;
};

Trapezi.prototype.trapeziTheatisPushDOM = function(sinedria) {
	this.theatisDOM.prepend(sinedria.theatisDOM);
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Prosklisi.prototype.prosklisiCreateDOM = function() {
	var prosklisi = this, kodikos, del, klikdel = false, kliapodoxi = false;

	this.prosklisiDeleteDOM();

	kodikos = this.prosklisiKodikosGet();
	this.DOM = $('<div>').addClass('prosklisi').

	// Ακολουθεί κώδικας σχετικός με το εικονίδιο ανάκλησης/απόρριψης
	// της προσκλήσεως.

	append(del = $('<img>').addClass('prosklisiIcon').
	attr({src: 'ikona/misc/Xred.png'}).
	on('click', function(e) {
		Arena.inputRefocus(e);
		if (klikdel) return;
		klikdel = true;

		Client.skiserService('prosklisiDiagrafi', 'prosklisi=' + kodikos).
		done(function(rsp) {
			klidel = false;
		}).
		fail(function(err) {
			Client.skiserFail(err);
			klidel = false;
		});
	}));

	// Αν η πρόσκληση είναι εξερχόμενη, τότε εμφανίζεται κάπως υποτονική.

	if (this.prosklisiProsGet().oxiEgo()) {
		del.attr({title: 'Ανάκληση πρόσκλησης ' + kodikos});
		this.DOM.append($('<div>').addClass('prosklisiPros').text(this.prosklisiProsGet()));
	}

	// Αλλιώς η πρόσκληση είναι εισερχόμενη και θα εμφανιστεί με εντονότερα
	// χρώματα. Επίσης, θα μπορεί να γίνει αποδοχή.

	else {
		del.attr({title: 'Απόρριψη πρόσκλησης ' + kodikos});
		this.DOM.addClass(this.prosklisiApoGet().oxiEgo() ? 'prosklisiIserxomeni' : 'prosklisiIkothen').
		append($('<div>').addClass('prosklisiApo').text(this.prosklisiApoGet())).
		attr({title: 'Αποδοχή πρόσκλησης ' + kodikos}).
		on('click', function(e) {
			var skiniko, trapezi;

			Arena.inputRefocus(e);
			if (prosklisi.prosklisiProsGet() !== Client.session.pektis)
			return Client.fyi.epano('Η πρόσκληση αυτή δεν σας αφορά');

			skiniko = prosklisi.prosklisiSkinikoGet();
			if (!skiniko) return;

			trapezi = skiniko.skinikoTrapeziGet(prosklisi.prosklisiTrapeziGet());
			if (!trapezi) return Client.fyi.epano('Δεν βρέθηκε το τραπέζι');

			if (Arena.ego.sinedria.sinedriaTrapeziGet() === trapezi.trapeziKodikosGet()) {
				if (trapezi.trapeziThesiPekti(Client.session.pektis))
				return Client.fyi.epano("Παίζετε ήδη σ' αυτό το τραπέζι");

				if (!trapezi.trapeziKeniThesi())
				return Client.fyi.epano("Δεν υπάρχει κενή θέση σ' αυτό το τραπέζι");
			}

			Client.fyi.pano();
			del.working(true);
			Client.skiserService('prosklisiApodoxi', 'prosklisi=' + kodikos).
			done(function(rsp) {
				del.working(false);
			}).
			fail(function(err) {
				del.working(false);
				Client.skiserFail(err);
			});
		});
	}

	this.DOM.append($('<div>').addClass('prosklisiTrapezi').text(this.prosklisiTrapeziGet()));
	Arena.prosklisi.areaDOM.prepend(this.DOM);

	return this;
};

Prosklisi.prototype.prosklisiGetDOM = function() {
	return this.DOM;
};

Prosklisi.prototype.prosklisiDeleteDOM = function() {
	var dom;

	dom = this.prosklisiGetDOM();
	if (dom) dom.remove();
	delete this.DOM;

	return this;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sizitisi.zebraPaleta = [
	'#B45F04',
	'#B4045F',
	'#006600',
	'#8A0808',
	'#084B8A',
	'#CD5C5C',
	'#663300',
	'#D52A00',
	'#666699',
];

Sizitisi.zebraIndex = Sizitisi.zebraPaleta.length;

Sizitisi.zebraXroma = {};

Sizitisi.prototype.sizitisiGetDOM = function() {
	return this.DOM;
};

Sizitisi.prototype.sizitisiCreateDOM = function(pro) {
	var pektis, klasi, xroma, dom, sxolioDOM;

	pektis = this.sizitisiPektisGet();
	klasi = 'sizitisiPektis';
	if (pektis.isEgo()) {
		klasi += ' sizitisiPektisEgo';
		xroma = '#144C88';
	}
	else {
		xroma = Sizitisi.zebraXroma[pektis];
		if (!xroma) {
			xroma = Sizitisi.zebraPaleta[Sizitisi.zebraIndex++ % Sizitisi.zebraPaleta.length];
			Sizitisi.zebraXroma[pektis] = xroma;
		}
	}

	dom = pro ? Arena.sizitisi.proepiskopisiDOM.empty() : this.DOM = $('<div>');

	dom.addClass('sizitisi').
	append($('<div>').addClass(klasi).css('color', xroma).text(pektis)).
	append(sxolioDOM = $('<div>').addClass('sizitisiSxolio'));

	this.sizitisiSxolioCreateDOM(sxolioDOM);

	if (pro) {
		if (Arena.sizitisi.oxiPagomeni()) Arena.sizitisi.areaDOM.scrollKato();
		return this;
	}

	this.DOM.appendTo(this.sizitisiTrapeziGet() ? Arena.sizitisi.trapeziDOM : Arena.sizitisi.kafenioDOM);
	return this;
};

Sizitisi.prototype.sizitisiSxolioCreateDOM = function(dom) {
	var sxolio, tmima, dom, html, i;

	sxolio = this.sizitisiSxolioGet();
	tmima = sxolio.split('^');

	dom.empty();

	switch (tmima[0]) {
	
	// Αν το πρώτο πεδίο του σχολίου είναι "FP" τότε πρόκειται για τα φύλλα της
	// προηγούμενης διανομής του παίκτη.

	case 'FP':
		sxolio = tmima[1].string2xartosia().xartosiaTaxinomisi().xartosiaDOM();
		dom.append(sxolio);
		return this;
	}

	for (i = 0; i < tmima.length; i++) {
		if (tmima[i].match(/^E[0-9]+:[0-9]+$/)) {
			Sizitisi.emoticonAppend(dom, tmima[i], xoros);
			continue;
		}

		if (tmima[i] === '~') {
			dom.append($('<br />'));
			continue;
		}

		sxolio = tmima[i].replace(/</g, '&lt;');
		dom.append(sxolio);
	}

	return this;
};

Sizitisi.emoticonAppend = function(dom, s, xoros) {
	var tmima, omada, ikona;

	tmima = s.split(':');
	if (tmima.length != 2) return;

	omada = parseInt(tmima[0].replace(/^E/, ''));
	ikona = parseInt(tmima[1]);
	dom.append($('<img>').addClass('sizitisiEmoticon').
	attr('src', Client.server + 'ikona/emoticon/set' + omada + '/' + xoros.epanel.lefkoma[omada][ikona]));
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "pektisEntopismosDOM" δέχεται ως παράμετρο το login name κάποιου παίκτη
// και ενημερώνει την εμφάνιση του συγκεκριμένου παίκτη στην περιοχή τραπεζιών.

Skiniko.prototype.pektisEntopismosDOM = function(pektis) {
	var sinedria, sinedriaDOM, trapeziPekti, theatis;

	// Εντοπίζουμε τη συνεδρία του παίκτη (εφόσον υπάρχει) και το τραπέζι που
	// αναφέρεται στη συγκεκριμένη συνεδρία.

	sinedria = this.skinikoSinedriaGet(pektis);
	if (sinedria) {
		trapeziPekti = sinedria.sinedriaTrapeziGet();
	}
	else {
		trapeziPekti = undefined;
	}

	// Διατρέχουμε όλες τις θέσεις παικτών όλων των τραπεζιών και ενημερώνουμε
	// τις θέσεις του συγκεκριμένου παίκτη.

	this.skinikoThesiWalk(function(thesi) {
		if (this.trapeziPektisGet(thesi) !== pektis) return;
		this.trapeziThesiRefreshDOM(thesi);

		if (Arena.ego.oxiTrapezi(this)) return;
		Arena.partida.pektisRefreshDOM(thesi);
	});

	return this;
};

Skiniko.prototype.pektisTrapeziScroll = function(anim) {
	var cdom, tdom, scrollTop;

	if (!Arena.ego.trapezi) return this;

	cdom = Arena.kafenioDOM;
	tdom = Arena.ego.trapezi.trapeziGetDOM();
	scrollTop = tdom.offset().top - cdom.offset().top + cdom.scrollTop() - 4;
	cdom.finish();
	if (anim) cdom.animate({scrollTop: scrollTop}, 100);
	else cdom.scrollTop(scrollTop);
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Υπάρχουν κάποιες δομές και διαδικασίες που αφορούν στον χρήστη που τρέχει την
// εφαρμογή. Αυτές εντάσσονται στο name space "ego".

Arena.ego = {};

Arena.ego.isTrapezi = function(trapezi) {
	if (!Arena.ego.trapezi) return false;
	if (!trapezi) return true;

	return (typeof trapezi.trapeziKodikosGet === 'function' ?
		trapezi.trapeziKodikosGet() == Arena.ego.trapeziKodikos
	:
		Arena.ego.trapeziKodikos == trapezi
	);
};

Arena.ego.oxiTrapezi = function(trapezi) {
	return !Arena.ego.isTrapezi(trapezi);
};

Arena.ego.isPektis = function() {
	return Arena.ego.sinedria.sinedriaIsPektis();
};

Arena.ego.oxiPektis = function() {
	return !Arena.ego.isPektis();
};

Arena.ego.isTheatis = function() {
	return Arena.ego.sinedria.sinedriaIsTheatis();
};

Arena.ego.oxiTheatis = function() {
	return !Arena.ego.isTheatis();
};

Arena.ego.isProsklisi = function(trapezi) {
	return trapezi.trapeziIsProsklisi(Client.session.pektis);
};

Arena.ego.oxiProsklisi = function(trapezi) {
	return !Arena.ego.isProsklisi(trapezi);
};

Arena.ego.isFilos = function(pektis) {
	return Arena.ego.pektis.pektisIsFilos(pektis);
};

Arena.ego.isApoklismenos = function(pektis) {
	return Arena.ego.pektis.pektisIsApoklismenos(pektis);
};

Arena.ego.thesiGet = function() {
	return Arena.ego.sinedria.sinedriaThesiGet();
};

Arena.ego.thesiMap = function(thesi) {
	var egoThesi = Arena.ego.thesiGet();

	switch (egoThesi) {
	case 2:
	case 3:
		thesi += (4 - egoThesi);
		if (thesi > 3) thesi -= 3;
	}

	return thesi;
};
