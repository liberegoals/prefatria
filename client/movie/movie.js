$(document).ready(function() {
	Client.
	tabPektis().
	tabKlisimo();
	Movie.setup();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Movie = {};

Movie.setup = function() {
	try {
		Movie.arxioData();
	} catch (e) {
		Movie.zitaData();
	}
};

Movie.arxioData = function() {
	Movie.trapezi = self.opener.Arxio.movie.trapezi;
	Movie.displayTrapezi();
	return Movie;
};

// Η function "zitaData" αποστέλλει query αναζήτησης παρτίδων στον server και διαχειρίζεται
// την απάντηση, η οποία περιέχει τα στοιχεία των επιλεγμένων παρτίδων.

Movie.zitaData = function() {
	Client.fyi.pano('Αναζήτηση διανομών. Παρακαλώ περιμένετε…');
	Client.ajaxService('arxio/epilogi.php', 'partida=' + Movie.trapezi.kodikos).
	done(function(rsp) {
		Client.fyi.pano();
		Movie.paralaviData(rsp);
		Movie.displayTrapezi();
	}).
	fail(function(err) {
		Client.ajaxFail('Παρουσιάστηκε σφάλμα κατά την αναζήτηση παρτίδων');
	});

	return Movie;
};

Movie.displayTrapezi = function() {
	console.log(Movie.trapezi.dianomi);
	return Movie;
};

Movie.checkOpen = function() {
	return self;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "paralaviData" καλείται κατά την επιστροφή των αποτελεσμάτων,
// και σκοπό έχει τη διαχείριση των αποτελεσμάτων αυτών.

Movie.paralaviData = function(data) {
	var trapezi;

	try {
		trapezi = data.evalAsfales();
	} catch (e) {
		console.error(data);
		Client.fyi.epano('Επεστράφησαν ακαθόριστα δεδομένα');
		Client.sound.beep();
		return Movie;
	}

	Movie.trapezi = Movie.trapeziProcess(trapezi);
	return Movie;
};

Movie.trapeziProcess = function(trapeziEco) {
	var trapezi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties του σχετικού τραπεζιού
	// έναντι των οικονομικών τοιαύτων.

	trapezi = new Trapezi();
	for (prop in Movie.trapeziEcoMap) {
		trapezi[Movie.trapeziEcoMap[prop]] = trapeziEco[prop];
	}

	Globals.awalk(trapezi.dianomiArray, function(i, dianomi) {
		dianomi = Movie.dianomiProcess(dianomi);
		trapezi.dianomiArray[i] = dianomi;
		trapezi.trapeziDianomiSet(dianomi);
	});

	ts = parseInt(trapezi.stisimo);
	if (ts) trapezi.stisimo = ts + Client.timeDif;

	ts = parseInt(trapezi.arxio);
	if (ts) trapezi.arxio = ts + Client.timeDif;

	return trapezi;
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties του τραπεζιού είναι συντομογραφικά.
// Η λίστα "trapeziEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τού τραπεζιού στα πραγαμτικά τους ονόματα.

Movie.trapeziEcoMap = {
	k: 'kodikos',
	s: 'stisimo',
	p1: 'pektis1',
	p2: 'pektis2',
	p3: 'pektis3',
	a: 'arxio',
	t: 'trparam',
	d: 'dianomiArray',
};

// Η function "energiaProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας ενεργειών που επεστράφησαν από τον server.

Movie.energiaProcess = function(energiaEco) {
	var energia, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής ενέργειας
	// έναντι των οικονομικών τοιαύτων.

	energia = new Energia();
	for (prop in Movie.energiaEcoMap) {
		energia[Movie.energiaEcoMap[prop]] = energiaEco[prop];
	}

	ts = parseInt(energia.pote);
	if (ts) energia.pote = ts + Client.timeDif;

	return energia;
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties της ενέργειας είναι συντομογραφικά.
// Η λίστα "energiaEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τής ενέργειας στα πραγαμτικά τους ονόματα.

Movie.energiaEcoMap = {
	k: 'kodikos',
	p: 'pektis',
	t: 'pote',
	i: 'idos',
	d: 'data',
};

// Η function "dianomiProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας διανομών που επεστράφησαν από τον server.

Movie.dianomiProcess = function(dianomiEco) {
	var dianomi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής διανομής
	// έναντι των οικονομικών τοιαύτων.

	dianomi = {};
	for (prop in Movie.dianomiEcoMap) {
		dianomi[Movie.dianomiEcoMap[prop]] = dianomiEco[prop];
	}

	ts = parseInt(dianomi.enarxi);
	if (ts) dianomi.enarxi = ts + Client.timeDif;

	return new Dianomi(dianomi).
		processEnergiaList(dianomiEco['e']);
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties της διανομής είναι συντομογραφικά.
// Η λίστα "dianomiEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τής διανομής στα πραγαμτικά τους ονόματα.

Movie.dianomiEcoMap = {
	k: 'kodikos',
	d: 'dealer',
	s: 'enarxi',
	k1: 'kasa1',
	m1: 'metrita1',
	k2: 'kasa2',
	m2: 'metrita2',
	k3: 'kasa3',
	m3: 'metrita3',
};

Dianomi.prototype.processEnergiaList = function(elist) {
	var dianomi = this;

	Globals.awalk(elist, function(i, energiaEco) {
		var energia;

		energia = Movie.energiaProcess(energiaEco);
		dianomi.dianomiEnergiaSet(energia);
		dianomi.energiaArray[i] = energia;
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
