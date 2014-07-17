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
	conn.connection.query(query, function(err, res) {
		if (res && (res.affectedRows == 1))
		return Service.trapezi.miaPrefa2(nodereq, conn, res.insertId);

		conn.rollback();
		nodereq.error('Απέτυχε η δημιουργία τραπεζιού');
	});
};

Service.trapezi.miaPrefa2 = function(nodereq, conn, trapezi) {
	var query = 'REPLACE INTO `prosklisi` (`trapezi`, `apo`, `pros`) VALUES (' +
		trapezi + ', ' + nodereq.login.json() + ', ' + nodereq.login.json() + ')';
	conn.connection.query(query, function(err, res) {
		if (res && (res.affectedRows > 0))
		return Service.trapezi.miaPrefa3(nodereq, conn, trapezi, res.insertId);

		conn.rollback();
		nodereq.error('Απέτυχε η δημιουργία πρόσκλησης');
	});
};

Service.trapezi.miaPrefa3 = function(nodereq, conn, trapezi, prosklisi) {
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

Service.trapezi.exodos = function(nodereq) {
	var skiniko, sinedria, trapezi, thesi, kinisi;

	if (nodereq.isvoli()) return;

	skiniko = Server.skiniko;
	sinedria = nodereq.sinedria;
	trapezi = skiniko.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (!trapezi) return nodereq.end('Απέτυχε η έξοδος από το τραπέζι');

	thesi = trapezi.trapeziThesiPekti(nodereq.login);
	if (thesi) DB.connection().transaction(function(conn) {
		Service.trapezi.exodosPektis(nodereq, conn, sinedria, trapezi, thesi);
	});
	else Service.trapezi.exodosTheatis(nodereq, sinedria);
};

Service.trapezi.exodosPektis = function(nodereq, conn, sinedria, trapezi, thesi) {
	var query;

	query = 'UPDATE `trapezi` SET `pektis' + thesi + '` = NULL WHERE `kodikos` = ' + trapezi.trapeziKodikosGet();
	conn.connection.query(query, function(err, res) {
		if ((!res) || (res.affectedRows < 1)) {
			conn.rollback();
			return nodereq.error('Απέτυχε η έξοδος παίκτη από το τραπέζι');
		}

		Service.trapezi.exodosPektis2(nodereq, conn, sinedria);
	});
};

Service.trapezi.exodosPektis2 = function(nodereq, conn, sinedria) {
	var query;

	query = 'UPDATE `sinedria` SET `trapezi` = NULL, `thesi` = NULL, `simetoxi` = NULL ' +
		'WHERE `pektis` = ' + nodereq.login.json();
	conn.connection.query(query, function(err, res) {
		if ((!res) || (res.affectedRows < 1)) {
			conn.rollback();
			return nodereq.error('Απέτυχε η ενημέρωση της σνεδρίας');
		}

		conn.commit();
		Service.trapezi.exodos2(nodereq);
	});
};

Service.trapezi.exodosTheatis = function(nodereq, sinedria) {
	var query, conn;

	query = 'UPDATE `sinedria` SET `trapezi` = NULL, `thesi` = NULL, `simetoxi` = NULL ' +
		'WHERE `pektis` = ' + nodereq.login.json();
	conn = DB.connection();
	conn.connection.query(query, function(err, res) {
		conn.free();
		if ((!res) || (res.affectedRows < 1)) return nodereq.error('Απέτυχε η ενημέρωση της σνεδρίας');
		Service.trapezi.exodos2(nodereq);
	});
};

Service.trapezi.exodos2 = function(nodereq) {
	var kinisi;

	kinisi = new Kinisi('RT');
	kinisi.data = {
		pektis: nodereq.login,
	};

	nodereq.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
	nodereq.end();
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
	var p1, p1, kodikos, query, conn;

	p1 = trapezi.trapeziPektisGet(h1);
	p2 = trapezi.trapeziPektisGet(h2);
	kodikos = trapezi.trapeziKodikosGet();

	query = 'UPDATE `trapezi` SET `pektis' + h1 + '` = ' + (p2 ? p2.json() : 'NULL') +
		', `pektis' + h2 + '` = ' + (p1 ? p1.json() : 'NULL') + ' WHERE `kodikos` = ' + kodikos;
	conn = DB.connection();
	conn.connection.query(query, function(err, res) {
		conn.free();
		if ((!res) || (res.affectedRows != 1)) return nodereq.error('Δεν άλλαξε η διάταξη των παικτών');
		Service.trapezi.diataxi3(nodereq, kodikos, h1, p2, h2, p1);
	});
};

Service.trapezi.diataxi3 = function(nodereq, kodikos, h1, p1, h2, p2) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi('DX');
	kinisi.data = {
		trapezi: kodikos,
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

	p1 = trapezi.trapeziPektisGet(1);
	a1 = trapezi.trapeziApodoxiGet(1);

	p2 = trapezi.trapeziPektisGet(2);
	a2 = trapezi.trapeziApodoxiGet(2);

	p3 = trapezi.trapeziPektisGet(3);
	a3 = trapezi.trapeziApodoxiGet(3);

	kodikos = trapezi.trapeziKodikosGet();

	query = 'UPDATE `trapezi` SET ' +
		'`pektis1` = ' + (p1 ? p1.json() : 'NULL') + ', `apodoxi2` = ' + a1.json() + ', ' +
		'`pektis2` = ' + (p2 ? p2.json() : 'NULL') + ', `apodoxi2` = ' + a2.json() + ', ' +
		'`pektis3` = ' + (p3 ? p3.json() : 'NULL') + ', `apodoxi3` = ' + a3.json() + ' ' +
		'WHERE `kodikos` = ' + kodikos;
	conn = DB.connection();
	conn.connection.query(query, function(err, res) {
		conn.free();
		if ((!res) || (res.affectedRows != 1)) return nodereq.error('Δεν άλλαξε η διάταξη των παικτών');
		Service.trapezi.roloi2(nodereq, kodikos, p3, a3, p1, a1, p2, a2);
	});
};

Service.trapezi.roloi2 = function(nodereq, kodikos, p1, a1, p2, a2, p3, a3) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi('RL');
	kinisi.data = {
		trapezi: kodikos,
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
	if (!trapezi.trapeziKlidoma()) return;

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
	conn.connection.query(query, function(err, res) {
		conn.free();
		if (res && (res.affectedRows == 1))
		return Service.trapezi.apodoxi2(nodereq, trapezi, thesi, ixodopa);

		trapezi.trapeziXeklidoma();
		nodereq.error('Δεν άλλαξε κάτι στο τραπέζι');
	});
};

Service.trapezi.apodoxi2 = function(nodereq, trapezi, thesi, apodoxi) {
	var skiniko = Server.skiniko;

	nodereq.end();

	kinisi = new Kinisi('AX');
	kinisi.data = {
		trapezi: trapezi.trapeziKodikosGet(),
		thesi: thesi,
		apodoxi: apodoxi,
	};

	skiniko.
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
	if (delay === undefined) delay = 2000;

	// Πρόκειται να μοιραστεί νέα διανομή. Έχουμε κρατημένα τα φύλλα της
	// τρέχουσας διανομής (όπως αυτά διαμορφώθηκαν μετά τη φάση της αγοράς)
	// στη λίστα "filaSave", οπότε τα αντιγράφουμε στη λίστα "filaPrev" από
	// την οποία αντλούνται για επίδειξη.

	trapezi.trapeziFilaPrevSet();

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
