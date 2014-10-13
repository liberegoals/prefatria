////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: trapezi');

Service.trapezi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.miaPrefa = function(nodereq) {
	if (nodereq.isvoli()) return;

	DB.connection().transaction(function(conn) {
		Service.trapezi.miaPrefa1(nodereq, conn);
	});
};

Service.trapezi.miaPrefa1 = function(nodereq, conn) {
	var query = 'INSERT INTO `trapezi` (`pektis1`, `poll`) VALUES (' + nodereq.login.json() + ', NOW())';
	conn.query(query, function(conn, res) {
		if (res.affectedRows == 1)
		return Service.trapezi.miaPrefa2(nodereq, conn, res.insertId);

		conn.rollback();
		nodereq.error('Απέτυχε η δημιουργία τραπεζιού');
	});
};

Service.trapezi.miaPrefa2 = function(nodereq, conn, trapezi) {
	var query;

	query = "UPDATE `sinedria` SET `trapezi` = " + trapezi + ", `thesi` = 1, " +
		"`simetoxi` = 'ΠΑΙΚΤΗΣ' WHERE `pektis` LIKE " + nodereq.login.json();
	conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.trapezi.miaPrefa3(nodereq, conn, trapezi);

		conn.rollback();
		nodereq.error('Απέτυχε η ενημέρωση της συνεδρίας');
	});
};

Service.trapezi.miaPrefa3 = function(nodereq, conn, trapezi) {
	var query = 'REPLACE INTO `prosklisi` (`trapezi`, `apo`, `pros`) VALUES (' +
		trapezi + ', ' + nodereq.login.json() + ', ' + nodereq.login.json() + ')';
	conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.trapezi.miaPrefa4(nodereq, conn, trapezi, res.insertId);

		conn.rollback();
		nodereq.error('Απέτυχε η δημιουργία πρόσκλησης');
	});
};

Service.trapezi.miaPrefa4 = function(nodereq, conn, trapezi, prosklisi) {
	var kinisi;

	conn.commit();
	nodereq.end();

	kinisi = new Kinisi('TR');
	kinisi.data.trapezi = {
		kodikos: trapezi,
		pektis1: nodereq.login,
	};

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi, false);

	kinisi = new Kinisi('PL');
	kinisi.data = {
		kodikos: prosklisi,
		trapezi: trapezi,
		apo: nodereq.login,
		pros: nodereq.login,
	};

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.epilogi = function(nodereq) {
	var skiniko, trapezi;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('trapezi', true)) return;

	skiniko = Server.skiniko;
	trapezi = skiniko.skinikoTrapeziGet(nodereq.url.trapezi);
	if (!trapezi) return nodereq.error('Δεν βρέθηκε το τραπέζι επιλογής');

	kinisi = new Kinisi('ET');
	kinisi.data = {
		trapezi: trapezi.kodikos,
		pektis: nodereq.login,
	};

	skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
	nodereq.end();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ακολουθεί υπηρεσία εξόδου παίκτη/θεατή από το τραπέζι.

Service.trapezi.exodos = function(nodereq) {
	var trapeziKodikos, trapezi, thesi;

	if (nodereq.isvoli()) return;

	trapeziKodikos = nodereq.sinedria.sinedriaTrapeziGet();
	if (!trapeziKodikos) return nodereq.end('Ακαθόριστο τραπέζι');

	trapezi = Server.skiniko.skinikoTrapeziGet(trapeziKodikos);
	if (!trapezi) return nodereq.end('Δεν βρέθηκε το τραπέζι στο σκηνικό');

	// Ελέγχουμε αν ο παίκτης συμμετέχει ως παίκτης στο τραπέζι από το οποίο εξέρχεται.
	// Σ' αυτή την περίπτωση θα πρέπει να κρατήσουμε στοιχεία τελευταίου καθημένου και
	// τελευταίας συμμετοχής.

	thesi = trapezi.trapeziThesiPekti(nodereq.login);
	if (thesi) DB.connection().transaction(function(conn) {
		Service.trapezi.exodosPektis(nodereq, conn, trapeziKodikos, thesi);
	});

	// Αλλιώς ο παίκτης συμμετέχει ως θεατής, οπότε η διαδικασία είναι μάλλον
	// απλούστερη.

	else Service.trapezi.exodosTheatis(nodereq);
};

//--------------------------------------------------------------------------------------------------------------------------@

// Πρώτο βήμα κατά την έξοδο του παίκτη από το τραπέζι στο οποίο συμμετέχει ως παίκτης
// είναι η ενημέρωση του σχετικού πεδίου στο συγκεκριμένο τραπέζι.

Service.trapezi.exodosPektis = function(nodereq, conn, trapezi, thesi) {
	var query;

	query = 'UPDATE `trapezi` SET `pektis' + thesi + '` = NULL WHERE `kodikos` = ' + trapezi;
	conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			conn.rollback();
			return nodereq.error('Απέτυχε η έξοδος παίκτη από το τραπέζι');
		}

		Service.trapezi.exodosPektis2(nodereq, conn, trapezi, thesi);
	});
};

// Κατόπιν ενημερώνουμε τον πίνακα τελευταίου καθημένου με τα στοιχεία θέσης
// του εξερχόμενου παίκτη. Με άλλα λόγια καταγράφουμε ότι στο συγκεκριμένο
// τραπέζι, στη συγκεκριμένη θέση καθόταν ο συγκεκριμένος παίκτης.

Service.trapezi.exodosPektis2 = function(nodereq, conn, trapezi, thesi) {
	var query;

	query = 'REPLACE INTO `telefteos` (`trapezi`, `thesi`, `pektis`) VALUES (' +
		trapezi + ', ' + thesi + ', ' + nodereq.login.json() + ')';
	conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			conn.rollback();
			return nodereq.error('Απέτυχε η ενημέρωση τελευταίου παίκτη');
		}

		Service.trapezi.exodosPektis3(nodereq, conn, trapezi, thesi);
	});
};

// Κατόπιν ενημερώνουμε τον πίνακα συμμετοχών όπου καταγράφουμε ότι στο συγκεκριμένο
// τραπέζι, ο συγκεκριμένος παίκτης κάθησε τελευταία φορά στη συγκεκριμένη θέση.

Service.trapezi.exodosPektis3 = function(nodereq, conn, trapezi, thesi) {
	var query;

	query = 'REPLACE INTO `simetoxi` (`trapezi`, `pektis`, `thesi`) VALUES (' +
		trapezi + ', ' + nodereq.login.json() + ', ' + thesi + ')';
	conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			conn.rollback();
			return nodereq.error('Απέτυχε η ενημέρωση συμμετοχής');
		}

		conn.commit();
		Service.trapezi.exodos2(nodereq);
	});
};

//--------------------------------------------------------------------------------------------------------------------------@

// Κατά την έξοδο του θεατή από το τραπέζι, απλώς ενημερώνουμε τη σχετική συνεδρία
// καθαρίζοντας τα στοιχεία θέσης. Αυτό δεν το κάναμε στην περίπτωση της εξόδου
// του παίκτη από το τραπέζι, καθώς η κένωση τη συγκεκριμένης θέσης αρκεί για τη
// διόρθωση τυχόν λανθασμένων στοιχείων θέσης συνεδρίας κατά την επανεκκίνηση
// του skiser.

Service.trapezi.exodosTheatis = function(nodereq) {
	var query, conn;

	query = 'UPDATE `sinedria` SET `trapezi` = NULL, `thesi` = NULL, `simetoxi` = NULL ' +
		'WHERE `pektis` = ' + nodereq.login.json();
	conn = DB.connection();
	conn.query(query, function(conn, res) {
		conn.free();
		if (res.affectedRows < 1)
		return nodereq.error('Απέτυχε η ενημέρωση της σνεδρίας');

		Service.trapezi.exodos2(nodereq);
	});
};

//--------------------------------------------------------------------------------------------------------------------------@

// Ακολουθεί το τελευταίο βήμα εξόδου παίκτη/θεατή από το τραπέζι. Πρόκειται
// για τη δημιουργία της σχετικής κίνησης, την επεξεργασία της στο σκηνικό
// του skiser και την τοποθέτησή της στο transaction log προκειμένου να
// ενημερωθούν και οι clients.

Service.trapezi.exodos2 = function(nodereq) {
	var kinisi;

	nodereq.end();

	kinisi = new Kinisi({
		idos: 'RT',
		data: {
			pektis: nodereq.login,
		},
	});

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.diataxi = function(nodereq) {
	var trapezi;

	if (nodereq.isvoli()) return;
	if (nodereq.oxiTrapezi()) return;

	trapezi = nodereq.trapeziGet();
	switch (trapezi.trapeziThesiPekti(nodereq.loginGet())) {
	case 1: return Service.trapezi.diataxi2(nodereq, trapezi, 2, 3);
	case 2: return Service.trapezi.diataxi2(nodereq, trapezi, 1, 3);
	case 3: return Service.trapezi.diataxi2(nodereq, trapezi, 1, 2);
	}

	return nodereq.error('Δεν είστε παίκτης στο τραπέζι');
};

Service.trapezi.diataxi2 = function(nodereq, trapezi, h1, h2) {
	var p1, p2, kodikos, query, conn;

	p1 = trapezi.trapeziPektisGet(h1);
	p2 = trapezi.trapeziPektisGet(h2);
	kodikos = trapezi.trapeziKodikosGet();

	query = 'UPDATE `trapezi` SET `pektis' + h1 + '` = ' + (p2 ? p2.json() : 'NULL') +
		', `pektis' + h2 + '` = ' + (p1 ? p1.json() : 'NULL') + ' WHERE `kodikos` = ' + kodikos;
	conn = DB.connection();
	conn.query(query, function(conn, res) {
		conn.free();
		if (res.affectedRows != 1)
		return nodereq.error('Δεν άλλαξε η διάταξη των παικτών');

		Service.trapezi.diataxi3(nodereq, kodikos, h1, p2, h2, p1);
	});
};

Service.trapezi.diataxi3 = function(nodereq, kodikos, h1, p1, h2, p2) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi('DX');
	kinisi.data = {
		trapezi: kodikos,
		pektis: nodereq.loginGet(),
		h1: h1,
		p1: p1,
		h2: h2,
		p2: p2,
	};

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.roloi = function(nodereq) {
	var trapezi, p1, a1, p2, a2, p3, a3, kodikos, query, conn;

	if (nodereq.isvoli()) return;
	if (nodereq.sinedria.sinedriaOxiPektis()) {
		nodereq.url.thesi = nodereq.sinedria.sinedriaThesiGet().epomeniThesi();
		Service.sinedria.thesiTheasis2(nodereq);
		return;
	}

	trapezi = nodereq.trapeziGet();
	if (trapezi.trapeziIsIdioktito())
	return nodereq.end('Το τραπέζι είναι ιδιόκτητο');

	p1 = trapezi.trapeziPektisGet(1);
	a1 = trapezi.trapeziApodoxiGet(1);

	p2 = trapezi.trapeziPektisGet(2);
	a2 = trapezi.trapeziApodoxiGet(2);

	p3 = trapezi.trapeziPektisGet(3);
	a3 = trapezi.trapeziApodoxiGet(3);

	kodikos = trapezi.trapeziKodikosGet();

	query = 'UPDATE `trapezi` SET ' +
		'`pektis1` = ' + (p3 ? p3.json() : 'NULL') + ', `apodoxi1` = ' + a3.json() + ', ' +
		'`pektis2` = ' + (p1 ? p1.json() : 'NULL') + ', `apodoxi2` = ' + a1.json() + ', ' +
		'`pektis3` = ' + (p2 ? p2.json() : 'NULL') + ', `apodoxi3` = ' + a2.json() + ' ' +
		'WHERE `kodikos` = ' + kodikos;
	conn = DB.connection();
	conn.query(query, function(conn, res) {
		conn.free();
		if (res.affectedRows != 1)
		return nodereq.error('Δεν άλλαξε η διάταξη των παικτών');

		Service.trapezi.roloi2(nodereq, kodikos, p3, a3, p1, a1, p2, a2);
	});
};

Service.trapezi.roloi2 = function(nodereq, kodikos, p1, a1, p2, a2, p3, a3) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi('RL');
	kinisi.data = {
		trapezi: kodikos,
		pektis: nodereq.loginGet(),
		p1: p1,
		a1: a1,
		p2: p2,
		a2: a2,
		p3: p3,
		a3: a3,
	};

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.apodoxi = function(nodereq) {
	var trapezi, thesi, apodoxi, ixodopa;

	if (nodereq.isvoli()) return;
	if (nodereq.oxiPektis()) return;

	trapezi = nodereq.trapeziGet();
	if (!trapezi.trapeziKlidoma('trapezi.apodoxi'))
	return nodereq.error('Το τραπέζι είναι κλειδωμένο');

	thesi = trapezi.trapeziThesiPekti(nodereq.login);
	if (!thesi) {
		trapezi.trapeziXeklidoma();
		nodereq.error('Δεν είστε παίκτης στο τραπέζι');
		return;
	}

	if ((!Debug.flagGet('rithmisiPanta')) && trapezi.trapeziIsDianomi()) {
		trapezi.trapeziXeklidoma();
		nodereq.error('Υπάρχει διανομή');
		return;
	}

	apodoxi = trapezi.trapeziIsApodoxi(thesi);
	ixodopa = apodoxi ? 'ΟΧΙ' : 'ΝΑΙ';

	query = 'UPDATE `trapezi` SET `apodoxi' + thesi + '` = ' + ixodopa.json() +
		' WHERE `kodikos` = ' + trapezi.trapeziKodikosGet();
	conn = DB.connection();
	conn.query(query, function(conn, res) {
		conn.free();
		if (res.affectedRows == 1)
		return Service.trapezi.apodoxi2(nodereq, trapezi, thesi, ixodopa);

		trapezi.trapeziXeklidoma();
		nodereq.error('Δεν άλλαξε κάτι στο τραπέζι');
	});
};

Service.trapezi.apodoxi2 = function(nodereq, trapezi, thesi, apodoxi) {
	var kinisi;

	nodereq.end();

	kinisi = new Kinisi('AX');
	kinisi.data = {
		trapezi: trapezi.trapeziKodikosGet(),
		thesi: thesi,
		apodoxi: apodoxi,
	};

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);

	if (trapezi.trapeziApodoxiCount() < 3) return trapezi.trapeziXeklidoma();
	//if (trapezi.trapeziIsDianomi()) return trapezi.trapeziXeklidoma();

	Service.trapezi.dianomi(trapezi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.dianomi = function(trapezi, fail) {
	DB.connection().transaction(function(conn) {
		trapezi.trapeziNeaDianomi(conn, function(conn, dianomi, energia) {
			conn.commit();
			Server.skiniko.
			processKinisi(dianomi).
			processKinisi(energia).
			kinisiAdd(dianomi, false).
			kinisiAdd(energia);
			this.trapeziXeklidoma();
		}, fail);
	});
};

Service.trapezi.dianomiSeLigo = function(trapezi, delay) {
	var tzogos, kinisi;

	// Αν υφίσταται τζόγος τρέχουσας διανομής, τον στέλνουμε με τα δεδομένα
	// της νέας διανομής ώστε να μπορούν να τον δουν οι παίκτες.

	tzogos = trapezi.partidaTzogosGet();
	if (tzogos && (tzogos.xartosiaMikos() === 2)) {
		kinisi = new Kinisi({
			idos: 'ZP',
			data: {
				trapezi: trapezi.trapeziKodikosGet(),
				fila: tzogos.xartosia2string(),
			},
		});
		Server.skiniko.
		kinisiAdd(kinisi);
	}

	// Πρόκειται να μοιραστεί νέα διανομή. Έχουμε κρατημένα τα φύλλα της
	// τρέχουσας διανομής (όπως αυτά διαμορφώθηκαν μετά τη φάση της αγοράς)
	// στη λίστα "filaSave", οπότε τα αντιγράφουμε στη λίστα "filaPrev" από
	// την οποία αντλούνται για επίδειξη.

	trapezi.trapeziFilaPrevSet();

	if (delay === undefined)
	delay = 3000;

	setTimeout(function() {
		Service.trapezi.dianomi(trapezi);
	}, delay);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.klidomaCheck = function(nodereq, trapezi, thesi, apodoxi) {
	var tora = Globals.torams();

	Server.skiniko.skinikoTrapeziWalk(function() {
		var klidoma = this.trapeziKlidomaGet();
		if (!klidoma) return;
		if (tora - klidoma < 3000) return;

		this.trapeziXeklidoma();
		console.log(this.trapeziKodikosGet() + ': ξεκλείδωμα τραπεζιού');
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Από καιρού εις καιρόν και μέσω των διαδικασιών περιπόλου ελέγχονται τα τραπέζια
// προκειμένου κάποια από να αρχειοθετηθούν. Δεν κλειδώνουμε τα τραπέζια καθώς κάτι
// τέτοιο δημιουργεί περιπλοκές.

Service.trapezi.check = function() {
	var tora, arxio, arxio2;

	tora = Globals.tora();
	if (Debug.flagGet('trapeziCheck'))
	console.log('Περίπολος: trapezi.check: ' + Globals.poteOra(tora, true) + ' (' + Service.trapezi.kenoTimeout +
		', ' + Service.trapezi.oxiKenoTimeout + ')');

	// Κρατάμε στη λίστα "arxio" τα τραπέζια που αρχειοθετούνται
	// λόγω μεγάλου χρόνου αδράνειας.

	arxio = {};

	Server.skiniko.skinikoTrapeziWalk(function() {
		var trapezi;

		if (this.trapeziSeXrisi(tora))
		return;

		trapezi = this.trapeziKodikosGet();
		console.log(trapezi + ': ανενεργό τραπέζι');
		arxio[trapezi] = true;
	});

	// Αρχειοθετούμε στην database τα τραπέζια που έκλεισαν λόγω
	// μεγάλου χρόνου αδράνειας. Παράλληλα δημιουργούμε δεύτερη
	// λίστα με τα τραπέζια που αρχειοθετούνται επιτυχώς στην
	// database.

	arxio2 = {};
	Service.trapezi.arxiothetisi(arxio, arxio2);
};

Service.trapezi.kenoTimeout = 5 * 60;
Service.trapezi.oxiKenoTimeout = 15 * 60;

// Η μέθοδος "trapeziSeXrisi" ελέγχει αν οι παίκτες του τραπεζιού έχουν αποχωρήσει
// από το τραπέζι και το τραπέζι έχει μείνει χωρίς online επισκέπτες για μεγάλο
// χρονικό διάστημα.

Trapezi.prototype.trapeziSeXrisi = function(tora) {
	var timeout, thesi, pektis;

	// Ελέγχουμε κατ' αρχάς αν υπάρχει παίκτης στο τραπέζι που δεν έχει
	// αποχωρήσει ακόμη, προκειμένου να αποφασίσουμε το χρόνο που το
	// τραπέζι θα θεωρηθεί ανενεργό. Αν υπάρχει έστω και ένας παίκτης
	// στο τραπέζι δίνουμε περισσότερο χρόνο.

	timeout = Service.trapezi.kenoTimeout;

	for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) {
		if (!this.trapeziPektisGet(thesi))
		continue;

		// Εφόσον υπάρχει παίκτης ξεχασμένος στο τραπέζι αυξάνουμε
		// το χρόνο αδράνειας.

		timeout = Service.trapezi.oxiKenoTimeout;
		break;
	}

	if (tora === undefined)
	tora = Globals.tora();

	if (tora - this.trapeziPollGet() < timeout)
	return true;

	// Το poll timestamp του τραπεζιού δείχνει ότι το τραπέζι είναι
	// ανανεργό. Ωστόσο, υπάρχει περίπτωση κάποιος από τους παίκτες
	// του τραπεζιού να παρακολουθεί, ή να παίζει σε άλλο τραπέζι.
	// Σενάριο: Ανοίγω τραπέζι, προσκαλώ δύο φίλους και μέχρι να
	// έρθουν αυτοί παρακολουθώ σε κάποιο άλλο τραπέζι. Σ' αυτή την
	// περίπτωση τα pollings που κάνω ενημερώνουν το poll timestamp
	// στο τραπέζι που παρακολουθώ και έτσι το κυρίως τραπέζι μου
	// θα φανεί ανενεργό και θα δρομολογηθεί προς αρχειοθέτηση,
	// πράγμα που δεν είναι σωστό.

	for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) {
		pektis = this.trapeziPektisGet(thesi);
		if (!pektis) continue;

		// Αν οποιοσδήποτε παίκτης του τραπεζιού έχει ενεργή
		// συνεδρία, τότε το τραπέζι θεωρείται ενεργό.

		if (Server.skiniko.skinikoSinedriaGet(pektis))
		return true;
	}

	// Είναι πια η ώρα το τραπέζι να θεωρηθεί ανενεργό.

	return false;
};

// Η function "arxiothesisi" δέχεται μια λίστα τραπεζιών και επιχειρεί να τα
// αρχειοθετήσει στην database, δηλαδή να ενημερώσει το timestamp αρχειοθέτησης
// σε καθένα από αυτά τα τραπέζια. Ως δεύτερη παράμετρο περνάμε μια αρχικά κενή
// λίστα και εισάγουμε σ' αυτήν τη λίστα τα τραπέζια τα οποία αρχειοθετήθηκαν
// επιτυχώς στην database, προκειμένου αμέσως μετά να ενημερώσουμε τους clients
// ότι αυτά τα τραπέζια έχουν αρχειοθετηθεί.

Service.trapezi.arxiothetisi = function(lista, lista2) {
	var trapezi;

	// Η αρχειοθέτηση των τραπεζιών γίνεται αλυσιδωτά ώστε να αποφύγουμε
	// τη δημιουργία πολλών database connections. Αρχειοθετούμε, δηλαδή,
	// το πρώτο τραπέζι της λίστας και διακόπτουμε τη διαδικασία, καθώς
	// κατά το τέλος της διαδικασίας αρχειοθέτησης εκκινούμε εκ αναδρομικά
	// τη διαδικασία.

	for (trapezi in lista) {
		delete lista[trapezi];
		Service.trapezi.arxiothetisiTrapezi(trapezi, lista, lista2);
		return;
	}

	// Η λίστα έχει εξαντληθεί και εκκινούμε τις διαδικασίες κλεισίματος
	// της αρχειοθέτησης τραπεζιών.

	Service.trapezi.arxiothetisiTelos(lista2);
};

Service.trapezi.arxiothetisiTrapezi = function(trapeziKodikos, lista, lista2) {
	var trapezi, conn, query;

	trapezi = Server.skiniko.skinikoTrapeziGet(trapeziKodikos);
	if (!trapezi) return;

	conn = DB.connection();
	query = 'UPDATE `trapezi` SET `arxio` = NOW()';

	// Επιχειρούμε να «πληρώσουμε» τις κενές θέσεις του τραπεζιού
	// με τα ονόματα των παικτών που κάθισαν τελευταίοι σ' αυτές.

	trapezi.trapeziThesiWalk(function(thesi) {
		var pektis;

		pektis = this.trapeziPektisGet(thesi);
		if (pektis) return;

		pektis = this.trapeziTelefteosGet(thesi);
		if (!pektis) return;

		query += ', `pektis' + thesi + '` = ' + pektis.json();
	});

	query += ' WHERE `kodikos` = ' + trapeziKodikos;

	conn.query(query, function(conn, res) {
		if (res.affectedRows != 1) {
			conn.free();
			console.error(trapeziKodikos + ': απέτυχε η αρχειοθέτηση του τραπεζιού');
			Service.trapezi.arxiothetisi(lista, lista2);
			return;
		}

		// Το τραπέζι έχει αρχειοθετηθεί επιτυχώς. Ακολουθούν οι διαγραφές
		// προσκλήσεων και συζήτησης του τραπεζιού. Κανονικά θα έπρεπε να
		// γίνουν όλα αυτά στα πλαίσια κάποιας ενιαίας transaction, αλλά
		// δεν πειράζει και να αποτύχουν οι διαγραφές, οπότε αποφεύγουμε
		// τη διαδικασία λογικής transaction.

		lista2[trapeziKodikos] = true;
		Service.trapezi.arxiothetisiProsklisi(conn, trapeziKodikos, lista, lista2);
	});
};

Service.trapezi.arxiothetisiProsklisi = function(conn, trapezi, lista, lista2) {
	var query;

	query = 'DELETE FROM `prosklisi` WHERE `trapezi` = ' + trapezi;
	conn.query(query, function(conn) {
		/*
		TODO
		if (!res) {
			conn.free();
			console.error(trapezi + ': απέτυχε η διαγραφή προσκλήσεων κατά την αρχειοθέτηση');
			Service.trapezi.arxiothetisi(lista, lista2);
			return;
		}
		*/

		Service.trapezi.arxiothetisiSizitisi(conn, trapezi, lista, lista2);
	});
};

Service.trapezi.arxiothetisiSizitisi = function(conn, trapezi, lista, lista2) {
	var query;

	query = 'DELETE FROM `sizitisi` WHERE `trapezi` = ' + trapezi;
	conn.query(query, function(conn) {
		conn.free();
		/*
		TODO
		if (!res)
		console.error(trapezi + ': απέτυχε η διαγραφή συζήτησης κατά την αρχειοθέτηση');
		*/

		Service.trapezi.arxiothetisi(lista, lista2);
	});
};

Service.trapezi.arxiothetisiTelos = function(lista) {
	var trapezi, kinisi;

	kinisi = null;
	for (trapezi in lista) {
		kinisi = new Kinisi({
			idos: 'AT',
			data: {
				trapezi: trapezi,
			}
		});

		Server.skiniko.
		processKinisi(kinisi).
		kinisiAdd(kinisi, false);
	}

	if (kinisi)
	Server.skiniko.kinisiAdd();
};
