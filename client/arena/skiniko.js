// Θα χρησιμοποιήσουμε ένα global σκηνικό για την αρένα μας. Σ' αυτό το σκηνικό
// θα φορτώσουμε παίκτες, τραπέζια, προσκλήσεις, συνεδρίες κλπ.

Arena.skiniko = new Skiniko();

// Ο μετρητής "feredataID" μετρά τα πάσης φύσεως αιτήματα feredata και
// αποστέλλεται στον skiser με σκοπό να παραληφθεί εκ νέου μαζί με τα όποια
// αποτελέσματα. Κατά την παραλαβή ελέγχεται και αν βρεθεί παρωχημένος
// τα αποτελέσματα αγνοούνται καθώς αυτό σημαίνει ότι έχει ήδη υποβληθεί
// νεότερο αίτημα feredata.

Arena.feredataID = 0;

// Ο μετρητής "feredataAlagesCount" μετράει το πλήθος των αιτημάτων παραλαβής
// μεταβολών από το τελευταίο «φρεσκάρισμα» του σκηνικού μέσω αιτήματος παραλαβής
// πλήρων σκηνικών δεδομένων.

Arena.feredataAlagesCount = 0;

// Η σταθερά "feredataAlagesCountMax" δείχνει το πλήθος των αιτημάτων παραλαβής
// μεταβολών που θα σηματοδοτήσει αυτόματο «φρεσκάρισμα» του σκηνικού.

Arena.feredataAlagesCountMax = 500;

// Η μεταβλητή "Arena.feredataFreskaTS" δείχνει το timestamp του τελευταίου
// «φρεσκαρίσματος» του σκηνικού.

Arena.feredataFreskaTS = 0;

// Η σταθερά "feredataFreskaXronosMax" δείχνει τον μέγιστο επιτρεπτό χρόνο μεταξύ
// δύο «φρεσκαρισμάτων» του σκηνικού.

Arena.feredataFreskaXronosMax = 300;	// 5 λεπτά

// Ο timer "feredataTimer" αφορά σε δρομολογημένο αίτημα αποστολής αλλαγών.
// Πράγματι, τα αιτήματα αποστολής μεταβολών σκηνικού τα αποστέλλονται με
// κάποια καθυστέρηση, ανάλογα με την τιμή της μεταβλητής "feredataDelay".

Arena.feredataTimer = null;
Arena.feredataDelay = 300;

Arena.feredataTimerClear = function() {
	if (!Arena.feredataTimer)
	return Arena;

	clearTimeout(Arena.feredataTimer);
	Arena.feredataTimer = null;
	return Arena;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το στήσιμο του σκηνικού στον client γίνεται μέσω αιτήματος feredata για πλήρη
// σκηνικά δεδομένα.

Skiniko.prototype.stisimo = function(callback) {
	var skiniko = this;

	Arena.feredataTimerClear();
	Arena.feredataID++;
	if (Debug.flagGet('feredata') && Arena.ego.isDeveloper())
	console.log('Ζητήθηκαν πλήρη σκηνικά δεδομένα (id = ' + Arena.feredataID + ')');

	Arena.feredataAlagesCount = 0;
	Arena.feredataFreskaTS = Globals.tora();

	Client.skiserService('fereFreska', 'id=' + Arena.feredataID, 'ikonomika=1').
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

	if (Arena.ego.isDeveloper()) {
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

	this.skinikoResetDOM();
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

	// Οι διανομές παραλαμβάνονται είτε ως «οικονομική» λίστα ανά τραπέζι,
	// είτε ως array αναλυτικών δεδομένων όλων των διανομών.

	if (data.hasOwnProperty('dianomiEco')) {
		Globals.walk(data.dianomiEco, function(trapeziKodikos, dianomiArray) {
			trapezi = skiniko.skinikoTrapeziGet(trapeziKodikos);
			if (!trapezi) return;

			Globals.awalk(dianomiArray, function(i, dianomi) {
				dianomi = new Dianomi({
					kodikos: dianomi.k,
					trapezi: trapeziKodikos,
					dealer: dianomi.d,
					kasa1: dianomi.k1,
					metrita1: dianomi.m1,
					kasa2: dianomi.k2,
					metrita2: dianomi.m2,
					kasa3: dianomi.k3,
					metrita3: dianomi.m3,
				});

				trapezi.trapeziDianomiSet(dianomi);
				trapezi.dianomiArray.push(dianomi);
			});
		});
	}
	else if (data.hasOwnProperty('dianomi')) {
		Globals.awalk(data.dianomi, function(i, dianomi) {
			var trapezi;

			dianomi = new Dianomi(dianomi);
			trapezi = skiniko.skinikoTrapeziGet(dianomi.dianomiTrapeziGet());
			if (!trapezi) return;

			trapezi.trapeziDianomiSet(dianomi);
			trapezi.dianomiArray.push(dianomi);
		});
	}

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
	fortosRefreshDOM(data).
	anamoniAlages();

	return this;
};

Skiniko.prototype.fortosRefreshDOM = function(data) {
	Client.fortos.display({
		pektes: Globals.walk(this.sinedria),
		trapezia: Globals.walk(this.trapezi),
		cpuload: data.cpuload,
	});

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

	Arena.ego.plati = Arena.ego.pektis.pektisPlatiRBGet();
	Arena.ego.italp = (Arena.partida.plati === 'R' ? 'B' : 'R');

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.processPartidaData = function(data, online) {
	if (!data.partida) data.partida = {};
	if (!data.partida.sizitisi) data.partida.sizitisi = [];
	if (!data.partida.energia) data.partida.energia = [];

	if (!Arena.ego.trapezi) return this;
	if (!data.partida) return this;

	this.processPartidaSizitisiData(data.partida.sizitisi, online);
	this.processPartidaEnergiaData(data.partida.energia, online);
	return this;
};

Skiniko.prototype.processPartidaSizitisiData = function(sizitisiData, online) {
	var trapeziKodikos;

	if (!sizitisiData) return this;
	if (!sizitisiData.length) return this;

	sizitisiData.sort(function(s1, s2) {
		if (s1.kodikos < s2.kodikos) return -1;
		if (s1.kodikos > s2.kodikos ) return 1;
		return 0;
	});

	trapeziKodikos = Arena.ego.trapezi.trapeziKodikosGet();
	Globals.awalk(sizitisiData, function(i, sizitisi) {
		sizitisi.trapezi = trapeziKodikos;
		sizitisiData[i] = new Sizitisi(sizitisi);
		Arena.ego.trapezi.trapeziSizitisiSet(sizitisiData[i]);
	});

	return this;
};

Skiniko.prototype.processPartidaEnergiaData = function(energiaData, online) {
	var trapeziKodikos, dianomi, dianomiKodikos, allOnline, procOnline;

	if (!energiaData) return this;
	if (!energiaData.length) return this;

	dianomi = Arena.ego.trapezi.trapeziTelefteaDianomi();
	if (!dianomi) return this;

	energiaData.sort(function(s1, s2) {
		if (s1.kodikos < s2.kodikos) return -1;
		if (s1.kodikos > s2.kodikos ) return 1;
		return 0;
	});

	trapeziKodikos = Arena.ego.trapezi.trapeziKodikosGet();
	dianomiKodikos = dianomi.dianomiKodikosGet();
	allOnline = online;
	Globals.awalk(energiaData, function(i, energia) {
		if (energia.dianomi != dianomiKodikos) return;
		energia = new Energia(energia);
		energiaData[i] = energia;
		dianomi.dianomiEnergiaSet(energia);
		dianomi.energiaArray.push(energia);

		if (!online) return;
		if (!allOnline) return;

		procOnline = 'processEnergiaOnline' + energia.energiaIdosGet();
		if (typeof Arena.ego.trapezi[procOnline] !== 'function') allOnline = false;
	});

	Arena.ego.trapezi.partidaReplay();
	if (!online)
	return this;

	if (!allOnline) {
		Arena.partida.trapeziRefreshDOM();
		Arena.panelRefresh();
		return this;
	}

	Globals.awalk(energiaData, function(i, energia) {
		if (energia.dianomi != dianomiKodikos) return;
		procOnline = 'processEnergiaOnline' + energia.energiaIdosGet();
		if (typeof Arena.ego.trapezi[procOnline] !== 'function') return;
		Arena.ego.trapezi[procOnline](energia);
	});

	return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.anamoniAlages = function() {
	Arena.feredataTimerClear();
	Arena.feredataTimer = setTimeout(function() {
		Arena.feredataID++;
		if (Debug.flagGet('feredata') && Arena.ego.isDeveloper())
		console.log('Αναμένονται μεταβολές (id = ' + Arena.feredataID + ')');

		Client.skiserService('fereAlages', 'id=' + Arena.feredataID).
		done(function(rsp) {
			Arena.skiniko.processAlages(rsp);
		}).
		fail(function(err) {
			Arena.skiniko.feredataError(err);
		});
	}, Arena.feredataDelay);

	return this;
};

Skiniko.prototype.processAlages = function(rsp) {
	var data, trapeziPrin;

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
		if (Debug.flagGet('feredata')) console.log('\t' + rsp, '(υπεβλήθη νεότερο αίτημα)');
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
		Client.provlima('<div>Ο server σκηνικού διέκοψε την επικοινωνία</div>' +
			'<div style="text-align: center"><a href="' + Client.server +
			'isodos" target="_self">Επανείσοδος</a></div>', true);
		return this;

	// Παρουσιάστηκε κάποιο πρόβλημα στην ομαλή ενημέρωση σκηνικών δεδομένων
	// και θα πρέπει να δρομολογηθεί νέος κύκλος εκκινώντας με πλήρη σκηνικά
	// δεδομένα.

	case '?':
		this.feredataError('κρίθηκε αναγκαία η πλήρης επανασύσταση του σκηνικού');
		return this;
	}

	// Έχουν επιστραφεί δεδομένα. Αρχικά ενημερώνουμε την κονσόλα του browser.

	if (Debug.flagGet('feredata') && Arena.ego.isDeveloper()) {
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

	// Πριν επεξεργαστούμε τις μεταβολές σκηνικών δεδομένων που παραλάβαμε,
	// ελέγχουμε αν είναι κατάλληλη στιγμή να «φρεσκάρουμε» το σκηνικό.
	// Αν είναι, πράγματι, κατάλληλη η στιγμή να φρεσκάρουμε το σκηνικό,
	// αγνοούμε τις μεταβολές που μόλις παραλάβαμε και ζητάμε πλήρη
	// σκηνικά δεδομένα.

	if (this.skinikoFreskarisma()) {
		Client.fyi.kato('Δρομολογήθηκε φρεσκάρισμα σκηνικού…');
		Arena.cpanel.freskarismaButton.pbuttonGetDOM().trigger('click');
		return this;
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
		Arena.skiniko.processKinisi(kinisi);
	});

	this.processAlagesPartida(data, trapeziPrin);

	this.
	fortosRefreshDOM(data).
	anamoniAlages();

	return this;
};

Skiniko.prototype.skinikoFreskarisma = function() {
	// Αν είμαστε σε τραπέζι και η παρτίδα είναι σε φάση παιχνιδιού δεν κάνουμε
	// φρεσκάρισμα ώστε να αποφύγουμε τις απότομες μεταβολές σε κινήσεις φύλλων,
	// μπαζών κλπ.

	if (Arena.ego.isTrapezi()) {
		switch (Arena.ego.trapezi.partidaFasiGet()) {
		case 'ΔΙΑΝΟΜΗ':
		case 'ΣΥΜΜΕΤΟΧΗ':
			break;
		default:
			return false;
		}
	}

	// Ελέγχουμε αν έχουμε κάνει πολλά αιτήματα παραλαβής μεταβολών σκηνικού
	// χωρίς να έχει μεσολαβήσει παραλαβή πλήρων σκηνικών δεδομένων.

	if (++Arena.feredataAlagesCount > Arena.feredataAlagesCountMax) {
		console.log('Φρεσκάρισμα σκηνικού λόγω πληθώρας μεταβολών (>' + Arena.feredataAlagesCountMax + ')');
		return true;
	}

	// Ελέγχουμε αν έχει περάσει αρκετή ώρα από την τελευταία φορά που παραλάβαμε
	// πλήρη σκηνικά δεδομένα.

	if (Globals.tora() - Arena.feredataFreskaTS > Arena.feredataFreskaXronosMax) {
		console.log('Φρεσκάρισμα σκηνικού λόγω παρέλευσης χρόνου (>' + Arena.feredataFreskaXronosMax + 's)');
		return true;
	}

	return false;
};

Skiniko.prototype.processAlagesPartida = function(data, trapeziPrin) {
	var trapeziMeta, trapezi;

	trapeziMeta = Arena.ego.sinedria.sinedriaTrapeziGet();
	if (!trapeziMeta) {
		if (trapeziPrin) Arena.partida.refreshDOM(true);
		return this;
	}

	this.processPartidaData(data, true);

	if (trapeziMeta != trapeziPrin) {
		Arena.partida.refreshDOM(true);
		return this;
	}

	// Δεν έχει αλλάξει το τραπέζι του χρήστη. Όλα τα στοιχεία έχουν ενημερωθεί
	// στο σκηνικό και αυτό που έχουμε να κάνουμε τώρα είναι, ενδεχομένως, κάποιο
	// animation που θα καταλήξει στο νέο DOM.

	if (data.partida.sizitisi.length) {
		Globals.awalk(data.partida.sizitisi, function(i, sizitisi) {
			var pektis;

			pektis = sizitisi.sizitisiPektisGet();
			if (!pektis) return;

			if (pektis.isEgo())
			Arena.sizitisi.proepiskopisiDOM.empty();

			Arena.sizitisi.moliviTelos(pektis);
			sizitisi.sizitisiCreateDOM({
				online: true,
			});
		});

		Arena.sizitisi.scrollKato();
	}

	return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Σε περίπτωση προβλήματος επικοινωνίας σε αίτημα feredata επιχειρείται επαναστήσιμο
// του σκηνικού. Αυτή η διαδικασία επαναλαμβάνεται με χρονική καθυστέρηση η οποία
// σιγά σιγά αυξάνει και μετά από εύλογο αριθμό επαναλήψεων προκαλεί έξοδο από το
// πρόγραμμα.

Skiniko.prototype.feredataError = function(err, rsp) {
	var delay;

	console.error(rsp);
	if (!this.hasOwnProperty('feredataErrorCount')) {
		Client.skiserFail(err);
		this.feredataErrorCount = 1;
		delay = 100;
	}
	else if (this.feredataErrorCount++ < 5) delay = 200;
	else if (this.feredataErrorCount < 10) delay = 500;
	else if (this.feredataErrorCount < 15) delay = 1000;
	else return Client.provlima('<div>Σφάλμα ενημέρωσης σκηνικού</div>' +
	'<div style="text-align: center"><a href="' + Client.server + '" target="_self">' +
	'Επαναφόρτωση</a></div>', true);

	setTimeout(function() {
		Arena.skiniko.stisimo();
	}, delay);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Skiniko.prototype.skinikoCreateDOM = function(data) {
	this.skinikoResetDOM();

	Globals.awalk(data.trapezi.sort(function(t1, t2) {
		if (t1.kodikos < t2.kodikos) return -1;
		if (t1.kodikos > t2.kodikos) return 1;
		return 0;
	}), function(i, trapezi) {
		trapezi = Arena.skiniko.skinikoTrapeziGet(trapezi.kodikos);
		if (trapezi) trapezi.trapeziCreateDOM();
	});

	Globals.awalk(data.sinedria.sort(function(s1, s2) {
		if (s1.isodos < s2.isodos) return -1;
		if (s1.isodos > s2.isodos) return 1;
		return 0;
	}), function(i, sinedria) {
		sinedria = Arena.skiniko.skinikoSinedriaGet(sinedria.pektis);
		if (sinedria) sinedria.sinedriaCreateDOM();
	});

	Globals.awalk(data.prosklisi.sort(function(p1, p2) {
		if (p1.kodikos < p2.kodikos) return -1;
		if (p1.kodikos > p2.kodikos) return 1;
		return 0;
	}), function(i, prosklisi) {
		prosklisi = Arena.skiniko.skinikoProsklisiGet(prosklisi.kodikos);
		if (prosklisi) prosklisi.prosklisiCreateDOM();
	});

	Globals.awalk(data.sizitisi.sort(function(s1, s2) {
		if (s1.kodikos < s2.kodikos) return -1;
		if (s1.kodikos > s2.kodikos) return 1;
		return 0;
	}), function(i, sizitisi) {
		sizitisi = Arena.skiniko.skinikoSizitisiGet(sizitisi.kodikos);
		if (sizitisi) sizitisi.sizitisiCreateDOM();
	});

	// Ενημερώνουμε τα τμήματα του DOM που αφορούν στην παρτίδα του παίκτη.

	Arena.partida.refreshDOM(true);

	// Η συζήτηση του καφενείου και του τραπεζιού εμφανίζεται στον ίδιο χώρο.
	// Έχουν ήδη προστεθεί τα σχετικά DOM elements και κανονίζουμε τώρα την
	// εμφάνιση των τελευταίων σχολίων.

	if (Arena.sizitisi.oxiPagomeni())
	Arena.sizitisi.areaDOM.scrollKato({
		repeatAfter: 200,
	});

	// Όταν κάνουμε restart τον skiser οι ενεργές συνεδρίες λαμβάνουν φρέσκα σκηνικά
	// δεδομένα στα οποία υπάρχει και attribute "reset".

	if (data.reset) {
		Client.fyi.pano('Επαναδιαμορφώθηκε το σκηνικό του καφενείου');
		Arena.kitapi.refresh();
	}

	Arena.panelRefresh();
	return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.skinikoResetDOM = function() {
	this.skinikoSinedriaWalk(function() {
		Client.removeDOM(this);
	});
	this.skinikoPektisWalk(function() {
		Client.removeDOM(this);
	});
	this.skinikoTrapeziWalk(function() {
		Client.removeDOM(this);
	});
	Arena.rebelosDOM.empty();
	Arena.trapeziDOM.empty();
	Arena.prosklisi.areaDOM.empty();
	Arena.anazitisi.areaDOM.empty();
	Arena.sizitisi.kafenioDOM.empty();
	Arena.sizitisi.trapeziDOM.empty();

	Arena.partida.niofertosDOM.empty();
	Arena.partida.theatisDOM.empty();
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Pektis.prototype.pektisFormaPopupDOM = function(e) {
	var pektis = this, login;

	Arena.inputRefocus(e);

	login = this.pektisLoginGet();
	if (!login) return this;

	// Αν κάνουμε απόπειρα να ξανανοίξουμε το προφίλ του παίκτη του
	// οποίου ήδη έχουμε ανοικτό το προφίλ, τότε κλείνει το ανοικτό
	// προφίλ. Αυτό βοηθά στο να κάνουμε κλικ στο προφίλ του παίκτη,
	// να δούμε ό,τι θέλουμε να δούμε εκεί και να ξανακάνουμε κλικ
	// για να το κλείσουμε.

	if (Arena.pektisFormaDOM.data('pektis') === login) {
		Arena.pektisFormaKlisimo(200);
		return this;
	}

	// Οι πληροφορίες προφίλ των παικτών δεν έρχονται με το αρχικό πακέτο
	// σκηνικών δεδομένων, ούτε υπάρχει αρχικά property "profinfo" στους
	// παίκτες, παρά αυτό το συγκεκριμένο property συμπληρώνεται την πρώτη
	// φορά που θα παραλάβουμε πληροφορίες προφίλ για τον παίκτη. Αν, λοιπόν,
	// δεν βρεθεί property "profinfo" για τον παίκτη, τότε είναι η ώρα να
	// ζητηθούν οι πληροφορίες προφίλ από τον skiser, αλλιώς οι πληροφορίες
	// προφίλ έχουν ήδη παραληφθεί και προχωρούμε άμεσα στο άνοιγμα της φόρμας
	// προφίλ του παίκτη.

	if (this.hasOwnProperty('profinfo')) {
		pektis.pektisFormaPopupFillDOM(login);
		return this;
	}

	Client.fyi.pano('Ζητήθηκαν πληροφορίες προφίλ για τον παίκτη <span class="entona ble">' +
		login + '</span>. Παρακαλώ περιμένετε…');
	Client.skiserService('profinfoGet', 'pektis=' + login).
	done(function(rsp) {
		try {
			eval('pektis.profinfo = {' + rsp + '};');
		} catch (e) {
			Client.fyi.epano('Παρελήφθησαν ακαθόριστες πληροφορίες προφίλ για τον παίκτη ' +
				'<span class="entona ble">' + login + '</span>');
			Client.sound.beep();
			Arena.pektisFormaKlisimo(10);
			return;
		}

		Client.fyi.pano();
		pektis.pektisFormaPopupFillDOM(login);
	}).
	fail(function(err) {
		Client.skiserFail(err);
		Client.sound.beep();
		Arena.pektisFormaKlisimo(10);
	});

	return this;
};

Pektis.prototype.pektisFormaPopupFillDOM = function(login) {
	var egoDOM, idiosDOM, baraDOM;

	Arena.pektisFormaDOM.empty().
	data('pektis', login).
	append(Client.klisimo(function() {
		Arena.pektisFormaKlisimo();
	})).
	append(Arena.pektisPanelDOM = $('<div>').attr('id', 'pektisPanel').
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	})).
	append(idiosDOM = $('<div>').attr('id', 'profinfoIdios').addClass('profinfoArea')).
	append(egoDOM = $('<div>').attr('id', 'profinfoEgo').addClass('profinfoArea')).
	append(baraDOM = $('<div>').attr('id', 'profinfoIsozigio'));

	Arena.pektisPanelRefreshDOM();
	idiosDOM.append($('<div>').addClass('profinfoKimeno').html(this.profinfo[login]));
	if (login.isEgo()) egoDOM.empty();
	else egoDOM.append($('<div>').addClass('profinfoKimeno').html(this.profinfo[Client.session.pektis]));
	Arena.pektisFormaDOM.anadisi().finish().fadeIn('fast').
	find('.klisimoIcon').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	});

	baraDOM.
	append($('<img>').attr('id', 'profinfoIsozigioIcon').attr('src', 'ikona/misc/bara.png')).
	on('mousedown', function(e) {
		var y0;

		y0 = e.pageY;
		Arena.inputRefocus(e);
		$(document).
		off('mousemove').
		on('mousemove', function(e) {
			var y, dy, egoH, egoY, idiosH, h, baraY;

			y = e.pageY;
			dy = y - y0;
			if (dy === 0) return;
			y0 = y;

			egoH = parseInt(egoDOM.css('height'));
			if (egoH - dy < 0) dy = egoH;

			idiosH = parseInt(idiosDOM.css('height'));
			if (idiosH + dy < 0) dy = -idiosH;

			egoY = parseInt(egoDOM.css('top'));
			egoY += dy;

			baraY = parseInt(baraDOM.css('top'));
			baraY += dy;

			baraDOM.css('top', baraY + 'px');
			idiosDOM.css('height', (idiosH + dy) + 'px');
			egoDOM.css({
				height: (egoH - dy) + 'px',
				top: egoY + 'px',
			});
		}).
		off('mouseup').
		on('mouseup', function(e) {
			$(document).
			off('mousemove').
			off('mouseup');
		});
	});

	return this;
};

Arena.pektisFormaKlisimo = function(delay) {
	if (delay === undefined)
	delay = 200;

	Arena.pektisFormaDOM.finish().fadeOut(delay, function() {
		Arena.pektisFormaDOM.empty().
		removeData('pektis');
		delete Arena.pektisPanelDOM;
	});

	return Arena;
};

Arena.pektisPanelRefreshDOM = function() {
	var login, pektis, photoSrc, prosklisiButton, photoDOM;

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
	});

	photoSrc = pektis.pektisPhotoSrcGet();
	if (photoSrc) Arena.pektisPanelDOM.
	append($('<img>').addClass('pektisPanelIcon').
	css('marginLeft', '0px').attr({
		src: Client.server + 'ikona/pektis/photo.png',
		title: 'Φωτογραφία προφίλ',
	}).on('mouseenter', function(e) {
		if (photoDOM.data('emfanis')) return;
		photoDOM.finish().fadeIn(100);
	}).on('mouseleave', function(e) {
		if (photoDOM.data('emfanis')) return;
		photoDOM.finish().fadeOut(100);
	}).on('click', function(e) {
		Arena.inputRefocus(e);
		if (photoDOM.data('emfanis')) photoDOM.finish().fadeOut(100).removeData('emfanis');
		else photoDOM.finish().fadeIn(100).data('emfanis', true);
	}));

	Arena.pektisPanelDOM.
	append(prosklisiButton = $('<button>').text('Πρόσκληση').on('click', function(e) {
		var button = $(this);

		Arena.inputRefocus(e);

		// Ελέγχουμε αν ήδη βρίσκεται αποστολή παρόμοιας πρόσκλησης σε εξέλιξη.
		// Πράγματι, με double click, ο χρήστης στέλνει δυο απανωτές προσκλήσεις,
		// πράγμα που πρέπει να αποφύγουμε ώστε να μην σπαταλάμε πόρους.

		if ($(this).data('apostoli'))
		return;

		if (Arena.ego.oxiTrapezi())
		return Client.fyi.epano('Απροσδιόριστο τραπέζι');

		if (Arena.ego.oxiPektis())
		return Client.fyi.epano('Δεν είστε παίκτης στο τραπέζι');

		Client.fyi.pano('Αποστολή πρόσκλησης. Παρακαλώ περιμένετε…');
		Client.skiserService('prosklisiApostoli', 'pros=' + login.uri()).
		done(function(rsp) {
			button.removeData('apostoli');
			Arena.pektisFormaKlisimo(100);
			Client.fyi.pano();
		}).
		fail(function(err) {
			button.removeData('apostoli');
			switch (err.responseText) {
			case 'pektisApasxolimenos':
				Client.fyi.epano('Ο παίκτης <span class="ble entona">' + login +
					'</span> είναι απασχολημένος');
				break;
			case 'pektisNotFound':
				Client.fyi.epano('Ο παίκτης <span class="ble entona">' + login +
					'</span> δεν βρέθηκε στο σκηνικό');
				break;
			default:
				Client.skiserFail(err);
				break;
			}
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
		src: Client.server + 'ikona/pektis/filos.png',
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
		src: Client.server + 'ikona/pektis/apoklismos.png',
		title: 'Αποκλεισμός',
	}).on('click', function(e) {
		Arena.alagiSxesis(e, login, 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ');
	}));

	if (photoSrc) Arena.pektisFormaDOM.append(photoDOM = $('<img>').attr({
		id: 'pektisPhoto',
		src: 'photo/' + photoSrc,
	}).siromeno({
		top: '40px',
		left: '8px',
	}));

	prosklisiButton.css('display', Arena.dikeomaProsklisis() ? 'inline-block' : 'none');
	Arena.pektisPanelDOM.append($('<div>').attr('id', 'pektisFormaOnoma').text(login));
	return Arena;
};

Arena.dikeomaProsklisis = function() {
	if (Arena.ego.oxiPektis()) return false;
	if (Arena.ego.trapezi.trapeziIsElefthero()) return true;
	return Arena.ego.isThesi(1);
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Sinedria.prototype.sinedriaCreateDOM = function() {
	var skiniko, pektis, trapezi, jql;

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

	// Τα διακριτικά των αξιωμάτων είναι εμφανή μόνο στους διαχειριστές
	// και σε ανώτερα αξιώματα. Αυτό το κάνουμε για να αποφεύγουμε τις
	// διακρίσεις και τις σχετικές ερωτήσεις και παρεξηγήσεις. Δίνουμε
	// κάποια περιορισμένη πρόσβαση και στους ανέργους.

	if (Arena.ego.isDiaxiristis() || Arena.ego.isAnergos()) {
		jql = $();
		jql = jql.add(this.rebelosDOM);
		jql = jql.add(this.theatisDOM);
		jql = jql.add(this.tsoxaTheatisDOM);
		jql = jql.add(this.niofertosDOM);
		jql.pektisDiakritikaDOM(pektis);
	}

	trapezi = this.sinedriaTrapeziGet();
	if (!trapezi) {
		Arena.rebelosDOM.prepend(this.rebelosDOM);
		return this;
	}

	if (this.sinedriaOxiTheatis())
	return this;

	trapezi = skiniko.skinikoTrapeziGet(trapezi);
	if (!trapezi) return this;

	trapezi.trapeziTheatisPushDOM(this);
	return this;
};

// Η μέθοδος "pektisDiakritikaDOM" εφαρμόζεται σε κουτάκια παικτών και σκοπό
// έχει την προσάρτηση διακριτικού εικονιδίου σχετικού με το αξίωμα του
// παίκτη και, δευτερευόντως, άλλου εικονιδίου που αφορά στην επιδότηση.
 
jQuery.fn.pektisDiakritikaDOM = function(pektis) {
	return this.each(function() {
		var ikonidio, titlos;

		// Αρχικά αφαιρούμε τα διακριτικά εικονίδια που αφορούν
		// στο αξίωμα και σε τυχόν επιδότηση.

		$(this).children('.pektisAxiomaIcon,.pektisEpidotisiIcon').remove();
		if (!pektis) return;

		if (pektis.pektisIsEpidotisi()) {
			$(this).append($('<img>').addClass('pektisEpidotisiIcon').attr({
				src: 'ikona/panel/epidotisiOff.png',
				title: 'Επιδοτούμενος',
			}));
		}

		if (Arena.ego.oxiDiaxiristis())
		return;

		switch (pektis.pektisAxiomaGet()) {
		case 'ΠΡΟΕΔΡΟΣ':
			ikonidio = 'proedros.png';
			titlos = 'Πρόεδρος';
			break;
		case 'ADMINISTRATOR':
			ikonidio = 'administrator.png';
			titlos = 'Administrator';
			break;
		case 'ΔΙΑΧΕΙΡΙΣΤΗΣ':
			ikonidio = 'diaxiristis.png';
			titlos = 'Διαχειριστής';
			break;
		case 'ΕΠΟΠΤΗΣ':
			ikonidio = 'epoptis.png';
			titlos = 'Επόπτης';
			break;
		case 'VIP':
			ikonidio = 'vip.png';
			titlos = 'VIP';
			break;
		default:
			return;
		}

		$(this).append($('<img>').addClass('pektisAxiomaIcon').attr({
			src: 'ikona/axioma/' + ikonidio,
			title: titlos,
		}));
	});
};

Sinedria.prototype.sinedriaNiofertosRefreshDOM = function() {
	this.
	sinedriaSxesiRefreshDOM(this.niofertosDOM).
	sinedriaKatastasiRefreshDOM(this.niofertosDOM);
	return this;
};

Sinedria.prototype.sinedriaNiofertosPushDOM = function() {
	var dom;

	dom = Arena.partida.niofertosDOM.children('.niofertos');
	if (dom.length > 4) dom.last().remove();

	Arena.partida.niofertosDOM.prepend(this.niofertosDOM);
	return this;
};

Sinedria.prototype.sinedriaRebelosRefreshDOM = function() {
	this.
	sinedriaSxesiRefreshDOM(this.rebelosDOM).
	sinedriaKatastasiRefreshDOM(this.rebelosDOM);
	return this;
};

Sinedria.prototype.sinedriaTheatisRefreshDOM = function() {
	this.
	sinedriaSxesiRefreshDOM(this.theatisDOM, this.tsoxaTheatisDOM).
	sinedriaKatastasiRefreshDOM(this.theatisDOM, this.tsoxaTheatisDOM);
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

Sinedria.prototype.sinedriaKatastasiRefreshDOM = function() {
	var login, pektis, i, dom;

	login = this.sinedriaPektisGet();
	pektis = Arena.skiniko.skinikoPektisGet(login);

	for (i = 0; i < arguments.length; i++) {
		dom = arguments[i];
		dom.removeClass('apasxolimenos');
		if (!pektis) continue;
		if (pektis.pektisIsDiathesimos()) continue;
		dom.addClass('apasxolimenos');
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

Sinedria.prototype.sinedriaIsEgo = function() {
	return(this.sinedriaPektisGet() === Client.session.pektis);
};

Sinedria.prototype.sinedriaOxiEgo = function() {
	return !this.sinedriaIsEgo();
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Trapezi.prototype.trapeziGetDOM = function() {
	return this.DOM;
};

Trapezi.prototype.trapeziCreateDOM = function() {
	var trapezi = this;

	if (this.hasOwnProperty('DOM')) this.DOM.empty();
	else this.DOM = $('<div>').addClass('trapezi').prependTo(Arena.trapeziDOM);
	if (this.trapeziIsAorato()) this.DOM.css('display', 'none');

	this.DOM.
	append($('<hr>').addClass('trapeziFraktis')).
	append(this.tsoxaDOM = $('<div>').addClass('trapeziTsoxa')).
	append(this.optsDOM = $('<div>').addClass('trapeziOpts')).
	append(this.theatisDOM = $('<div>').addClass('trapeziTheatis'));
	this.trapeziSimetoxiRefreshDOM();

	this.tsoxaDOM.append(this.dataDOM = $('<div>').addClass('trapeziData').
	on('mouseenter', function(e) {
		var info;

		e.stopPropagation();
		info = $(this).data('info');
		if (!info) return;
		Client.fyi.pano(info);
	}).
	on('mouseleave', function(e) {
		e.stopPropagation();
		Client.fyi.pano();
	}).
	on('click', function(e) {
		var trapeziKodikos;

		Arena.inputRefocus(e);
		if ($(this).data('klikarismeno')) return;

		if (trapezi.trapeziIsPrive() && trapezi.trapeziOxiProsklisi(Client.session.pektis)) {
			Client.fyi.epano('Το τραπέζι είναι πριβέ');
			Client.sound.beep();
			return;
		}

		// Αν ο χρήστης κάνει κλικ στο τραπέζι που ήδη έχει επιλέξει, τότε απλώς
		// εμφανίζεται η παρτίδα.

		if (Arena.ego.sinedria.sinedriaTrapeziGet() === trapezi.trapeziKodikosGet()) {
			Arena.partidaModeSet();
			return;
		}

		trapeziKodikos = trapezi.trapeziKodikosGet();
		Client.fyi.pano('Είσοδος στο τραπέζι ' + trapeziKodikos + '. Παρακαλώ περιμένετε…');
		$(this).data('klikarismeno', true);
		Client.skiserService('trapeziEpilogi', 'trapezi=' + trapeziKodikos).
		done(function() {
			trapezi.dataDOM.removeData('klikarismeno');
			Client.fyi.pano();
		}).
		fail(function(err) {
			trapezi.dataDOM.removeData('klikarismeno');
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
	this.trapeziDataRefreshDOM();
	this.trapeziOptsRefreshDOM();
	this.trapeziThesiRefreshDOM();

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
	var kodikos, stisimo, ipolipo;

	kodikos = this.trapeziKodikosGet();
	stisimo = Globals.pote(this.trapeziStisimoGet() + Client.timeDif);
	ipolipo = this.trapeziIpolipoGet();

	this.dataDOM.empty().
	data('info', '<div class="aristera">' +
		'Τραπέζι <span class="prasino entona">' + kodikos + '</span>, ' +
		'στήθηκε <span class="prasino entona">' + stisimo + '</span>, ' +
		'υπόλοιπο κάσας: <span class="prasino entona">' + ipolipo + '</span> καπίκια' +
		'</div>').
	attr('title', 'Τραπέζι ' + kodikos + ', στήθηκε ' + stisimo).
	removeClass('trapeziDataEpilogi trapeziDataProsklisi trapeziDataPrive').
	append($('<div>').addClass('trapeziDataKodikos').text(kodikos)).

	append($('<div>').addClass('trapeziDataIpolipo').
	attr('title', 'Τρέχον υπόλοιπο κάσας: ' + ipolipo + ' καπίκια').text(ipolipo / 10));

	if (Arena.ego.isTrapezi(this)) this.dataDOM.addClass('trapeziDataEpilogi');
	else if (Arena.ego.isProsklisi(this)) this.dataDOM.addClass('trapeziDataProsklisi');
	else if (this.trapeziIsPrive()) this.dataDOM.addClass('trapeziDataPrive');

	this.DOM.find('.trapeziTelosIcon').remove();
	if (ipolipo <= 0)
	this.tsoxaDOM.append($('<img>').addClass('trapeziTelosIcon').attr({
		src: 'ikona/endixi/telos.png',
		title: 'Η κάσα έχει τελειώσει',
	}));

	return this;
};

Trapezi.prototype.trapeziOptsRefreshDOM = function() {
	this.optsDOM.empty();
	if (this.trapeziIsPaso()) this.trapeziOptionDOM('Παίζεται το πάσο', 'pasoOn.png');
	if (this.trapeziOxiAsoi()) this.trapeziOptionDOM('Δεν παίζονται οι άσοι', 'asoiOn.png');
	if (this.trapeziTeliomaAnisoropo())
	this.trapeziOptionDOM('Ανισόρροπη πληρωμή τελευταίας αγοράς', 'postel/anisoropo.png');
	else if (this.trapeziTeliomaDikeo())
	this.trapeziOptionDOM('Δίκαιη πληρωμή τελευταίας αγοράς', 'postel/dikeo.png');
	if (this.trapeziIsFiliki()) this.trapeziOptionDOM('Εκπαιδευτική/Φιλική παρτίδα', 'filiki.png');
	if (this.trapeziIsKlisto()) this.trapeziOptionDOM('Κλειστό τραπέζι', 'klisto.png');
	if (this.trapeziIsPrive()) {
		this.tsoxaDOM.addClass('prive');
		this.trapeziOptionDOM('Πριβέ τραπέζι', 'prive.png');
	}
	else {
		this.tsoxaDOM.removeClass('prive');
	}
	if (this.trapeziIsAorato()) this.trapeziOptionDOM('Αόρατο τραπέζι', 'aorato.png');
	if (this.trapeziIsIdioktito()) this.trapeziOptionDOM('Ιδιόκτητο τραπέζι',
		this.trapeziThesiPekti(Client.session.pektis) === 1 ? 'elefthero.png' : 'idioktito.png');
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
	var dom, login, pektis, sinedria;

	if (thesi === undefined) return this.trapeziThesiWalk(function(thesi) {
		this.trapeziThesiRefreshDOM(thesi);
	});

	dom = this.thesiDOM[thesi];
	dom.removeClass('offline fantasma filos apoklismenos ego apodoxi xapodoxi apasxolimenos');

	dom.addClass(this.trapeziIsApodoxi(thesi) ? 'apodoxi' : 'xapodoxi');

	login = this.trapeziPektisGet(thesi);
	pektis = (login ? Arena.skiniko.skinikoPektisGet(login) : null);

	if (login) {
		dom.text(login);
		if (Arena.ego.isDiaxiristis() || Arena.ego.isAnergos())
		dom.pektisDiakritikaDOM(pektis);

		sinedria = Arena.skiniko.skinikoSinedriaGet(login);
		if (!sinedria) dom.addClass('offline');
		if (login.isEgo()) dom.addClass('ego');
		else if (Arena.ego.isFilos(login)) dom.addClass('filos');
		else if (Arena.ego.isApoklismenos(login)) dom.addClass('apoklismenos');
		if (pektis && pektis.pektisIsApasxolimenos()) dom.addClass('apasxolimenos');
	}
	else {
		login = this.trapeziTelefteosGet(thesi);
		if (login) dom.addClass('fantasma').text(login);
		else dom.html('&mdash;');
	}

	if (pektis) dom.on('click', function(e) {
		pektis.pektisFormaPopupDOM(e);
	});
	else dom.off('click');

	return this;
};

Trapezi.prototype.trapeziTheatisPushDOM = function(sinedria) {
	if (!sinedria.theatisDOM) return this;
	sinedria.theatisDOM.detach();
	this.theatisDOM.prepend(sinedria.theatisDOM);
	return this;
};

// Η μέθοδος "telefteaPliromiSet" θέτει τα στοιχεία της λίστας "telefteaPliromi"
// στα ποσά που κέρδισε ή έχασε καθένας από τους παίκτες στην τελευταία πληρωμή.
// Μπορούμε να περάσουμε τα ποσά σε λίστα με δείκτες "kasa1", "metrita1", "kasa2",
// "metrita2", "kasa3", "metrita3". Αν δεν περάσουμε λίστα ποσών, υποτίθενται τα
// αντίστοιχα ποσά της προτελευταίας διανομής του τραπεζιού.

Trapezi.prototype.telefteaPliromiSet = function(posa) {
	var trapezi = this, dianomiArray, dianomi, kapikia;

	this.telefteaPliromi = {
		1: 0,
		2: 0,
		3: 0,
	};

	if (posa === undefined) {
		dianomiArray = this.dianomiArray;
		if (dianomiArray.length < 2) return this;

		posa = {};
		dianomi = dianomiArray[dianomiArray.length - 2];
		Prefadoros.thesiWalk(function(thesi) {
			posa['kasa' + thesi] = dianomi.dianomiKasaGet(thesi);
			posa['metrita' + thesi] = dianomi.dianomiMetritaGet(thesi);
		});
	}

	// Συντομογραφούμε το όνομα για απλούστευση του κώδικα που ακολουθεί.

	kapikia = this.telefteaPliromi;
	Prefadoros.thesiWalk(function(thesi) {
		var idx, kasa, asak;

		idx = 'metrita' + thesi;
		posa[idx] = parseInt(posa[idx]);
		if (posa[idx]) kapikia[thesi] += posa[idx];

		idx = 'kasa' + thesi;
		posa[idx] = parseInt(posa[idx]);
		if (!posa[idx]) return;

		kasa = posa[idx] * 2.0 / 3.0;
		kapikia[thesi] += kasa;

		asak = kasa / 2.0;
		switch (thesi) {
		case 1:
			kapikia[2] -= asak;
			kapikia[3] -= asak;
			break;
		case 2:
			kapikia[1] -= asak;
			kapikia[3] -= asak;
			break;
		case 3:
			kapikia[1] -= asak;
			kapikia[2] -= asak;
			break;
		}
	});

	Prefadoros.thesiWalk(function(thesi) {
		kapikia[thesi] = Math.round(kapikia[thesi]);
	});

	// Προχωρούμε σε κάποια μικροδιόρθωση των ποσών που έχουν υπολογιστεί.
	// Φροντίζουμε ώστε τυχόν ίδια ποσά να παραμείνουν ίδια.

	if (kapikia[1] == kapikia[2]) kapikia[3] -= (kapikia[1] + kapikia[2] + kapikia[3]); 
	else if (kapikia[1] == kapikia[3]) kapikia[2] -= (kapikia[1] + kapikia[2] + kapikia[3]); 
	else kapikia[1] -= (kapikia[1] + kapikia[2] + kapikia[3]); 

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Prosklisi.prototype.prosklisiCreateDOM = function() {
	var prosklisi = this, kodikos, del, klikdel = false;

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
				Client.fyi.epano(rsp);
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
	scrollTop = tdom.offset().top - cdom.offset().top + cdom.scrollTop() - 80;
	if (scrollTop < 0) scrollTop = 0;
	cdom.finish();
	if (anim) cdom.animate({scrollTop: scrollTop}, 400, 'easeInQuint');
	else cdom.scrollTop(scrollTop);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Filo.prototype.filoDOM = function(klisto) {
	var img;

	img = klisto ? Arena.ego.plati + 'V' : this.filoXromaGet() + this.filoAxiaGet();
	return $('<img>').data('filo', this).attr('src', 'ikona/trapoula/' + img + '.png');
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η μέθοδος "xartosiaDOM" δημιουργεί DOM element με τα φύλλα της χαρτωσιάς.
// Ως παράμετρο δίνουμε τη θέση του παίκτη, εκτός από την περίπτωση που πρόκειται
// για προηγούμενη χαρτωσιά που εμφανίζεται στη συζήτηση, όπου δεν καθορίζουμε θέση.

Xartosia.prototype.xartosiaDOM = function(iseht, klista) {
	var dom, xromaPrev = null, rbPrev = null, cnt = this.xartosiaMikos(), klasi;

	klasi = iseht ? 'tsoxaXartosiaFilo tsoxaXartosiaFilo' + iseht : 'tsoxaXartosiaFiloPrev';
	dom = $('<div>').addClass('tsoxaXartosiaContainer');
	Globals.awalk(this.xartosiaFilaGet(), function(i, filo) {
		var filoDOM, xroma, rb;

		filoDOM = filo.filoDOM(klista).addClass(klasi);

		// Το πρώτο φύλλο εμφανίζεται κανονικά στη σειρά του, τα υπόλοιπα
		// απανωτίζουν το προηγούμενο φύλλο.

		if (i === 0) filoDOM.css('marginLeft', 0);

		// Κατά τη διάρκεια της αλλαγής τα φύλλα του τζογαδόρου είναι 12,
		// επομένως απανωτίζουμε λίγο παραπάνω.

		else if (cnt > 10) filoDOM.addClass('tsoxaXartosiaFiloSteno' + iseht);

		// Τα φύλλα του Νότου φαίνονται μεγαλύτερα, καθώς ο διαθέσιμος χώρος
		// είναι πολύ περισσότερος.

		if (iseht === 1) filoDOM.addClass('tsoxaXartosiaFiloNotos');

		dom.append(filoDOM);

		// Μένει να ελέγξουμε αν υπάρχουν διαδοχικές ομοιόχρωμες φυλές, π.χ.
		// μετά τα μπαστούνια να ακολουθούν σπαθιά, ή μετά τα καρά να ακολουθούν
		// κούπες.

		if (klista) return;
		xroma = filo.filoXromaGet();
		if (xroma === xromaPrev) return;

		// Μόλις αλλάξαμε φυλή και πρέπει να ελέγξουμε αν η νέα φυλή είναι
		// ομοιόχρωμη με την προηγούμενη (κόκκινα/μαύρα).

		xromaPrev = xroma;
		rb = Prefadoros.xromaXroma[xroma];
		if (rb === rbPrev) filoDOM.addClass('tsoxaXartosiaFiloOmioxromo');
		else rbPrev = rb;
	});

	return dom;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Dilosi.prototype.dilosiDOM = function(idos) {
	var dom;

	if (idos === undefined) idos = 'Dilosi';
	dom = $('<div>').addClass('tsoxa' + idos);

	if (this.dilosiIsPaso()) {
		dom.text('ΠΑΣΟ');
		return dom;
	}

	if (this.dilosiIsTagrafo()) {
		dom.text('Άμα μείνουν');
		return dom;
	}
	
	if (this.dilosiIsExo()) dom.append($('<div>').addClass('tsoxa' + idos + 'Exo').text('Έχω'));
	dom.append($('<div>').addClass('tsoxa' + idos + 'Bazes').text(this.dilosiBazesGet()));
	dom.append($('<img>').addClass('tsoxa' + idos + 'Xroma').attr({
		src: Client.server + 'ikona/trapoula/xroma' + this.dilosiXromaGet() + '.png',
	}));

	if (this.dilosiIsAsoi())
	dom.
	append($('<div>').addClass('tsoxaDilosiAsoi').
	append($('<img>').addClass('tsoxaDilosiAsoiIcon').attr('src', 'ikona/panel/asoiOn.png')));

	return dom;
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
	if (!Arena.ego) return false;
	if (!Arena.ego.sinedria) return false;
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
	if (!Arena.ego.pektis) return false;
	return Arena.ego.pektis.pektisIsFilos(pektis);
};

Arena.ego.isApoklismenos = function(pektis) {
	if (!Arena.ego.pektis) return false;
	return Arena.ego.pektis.pektisIsApoklismenos(pektis);
};

Arena.ego.klistaFila = function() {
	if (Arena.ego.oxiTrapezi()) return false;
	if (Arena.ego.isPektis()) return false;
	return Arena.ego.trapezi.trapeziIsKlisto();
};

Arena.ego.thesiGet = function() {
	return Arena.ego.sinedria.sinedriaThesiGet();
};

Arena.ego.thesiMap = function(thesi) {
	var egoThesi;

	egoThesi = Arena.ego.thesiGet();
	switch (egoThesi) {
	case 2:
	case 3:
		thesi += (4 - egoThesi);
		if (thesi > 3) thesi -= 3;
	}

	return thesi;
};

// Η function "isThesi" επιστρέφει true εφόσον η θέση μας είναι αυτή
// που αναφέρεται στην παράμετρο.

Arena.ego.isThesi = function(thesi) {
	return(Arena.ego.thesiGet() == thesi);
};

Arena.ego.oxiThesi = function(thesi) {
	return !Arena.ego.isThesi(thesi);
};

Arena.ego.isVip = function() {
	if (!Arena.ego.pektis) return false;
	return Arena.ego.pektis.pektisIsVip();
};

Arena.ego.oxiVip = function() {
	if (!Arena.ego.pektis) return true;
	return Arena.ego.pektis.pektisOxiVip();
};

Arena.ego.isDiaxiristis = function() {
	if (!Arena.ego.pektis) return false;
	return Arena.ego.pektis.pektisIsDiaxiristis();
};

Arena.ego.oxiDiaxiristis = function() {
	if (!Arena.ego.pektis) return true;
	return Arena.ego.pektis.pektisOxiDiaxiristis();
};

Arena.ego.isDeveloper = function() {
	if (!Arena.ego.pektis) return false;
	return Arena.ego.pektis.pektisIsDeveloper();
};

Arena.ego.oxiDeveloper = function() {
	if (!Arena.ego.pektis) return true;
	return Arena.ego.pektis.pektisOxiDeveloper();
};

Arena.ego.isAnergos = function() {
	if (!Arena.ego.pektis) return false;
	return Arena.ego.pektis.pektisIsAnergos();
};

Arena.ego.isErgazomenos = function() {
	if (!Arena.ego.pektis) return true;
	return Arena.ego.pektis.pektisIsErgazomenos();
};

Arena.ego.isEpidotisi = function() {
	if (!Arena.ego.pektis) return false;
	return Arena.ego.pektis.pektisIsEpidotisi();
};

Arena.ego.oxiEpidotisi = function() {
	if (!Arena.ego.pektis) return true;
	return Arena.ego.pektis.pektisOxiEpidotisi();
};

Arena.ego.isApasxolimenos = function() {
	if (!Arena.ego.pektis) return false;
	return Arena.ego.pektis.pektisIsApasxolimenos();
};

Arena.ego.isDiathesimos = function() {
	if (!Arena.ego.pektis) return false;
	return Arena.ego.pektis.pektisIsDiathesimos();
};
