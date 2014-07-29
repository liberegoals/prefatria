////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: prosklisi');

Service.prosklisi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.prosklisi.apostoli = function(nodereq) {
	var sinderia, trapezi, conn, query;

	if (nodereq.isvoli()) return;
	if (nodereq.oxiTrapezi()) return;
	if (nodereq.denPerastike('pros', true)) return;

	sinedria = nodereq.sinedriaGet();
	if (sinedria.sinedriaOxiPektis()) return nodereq.error('Δεν είστε παίκτης στο τραπέζι');

	conn = DB.connection();
	query = 'REPLACE INTO `prosklisi` (`trapezi`, `apo`, `pros`, `epidosi`) VALUES (' +
		(trapezi = sinedria.sinedriaTrapeziGet()) + ', ' + nodereq.login.json() + ', ' +
		nodereq.url.pros.json() + ', NOW())';
	conn.connection.query(query, function(err, res) {
		conn.free();
		if ((!res) || (res.affectedRows < 1)) return nodereq.error('Απέτυχε η καταχώρηση της προσκλήσεως');
		Service.prosklisi.apostoli2(nodereq, res.insertId, trapezi);
	});
};

Service.prosklisi.apostoli2 = function(nodereq, kodikos, trapezi) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi({
		idos: 'PL',
		data: {
			kodikos: kodikos,
			trapezi: trapezi,
			apo: nodereq.login,
			pros: nodereq.url.pros,
		},
	});

	Server.skiniko.processKinisi(kinisi).kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.prosklisi.diagrafi = function(nodereq) {
	var prosklisi, sinderia, data, conn, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('prosklisi', true)) return;

	prosklisi = Server.skiniko.skinikoProsklisiGet(nodereq.url.prosklisi);
	if (!prosklisi) return nodereq.error('Δεν βρέθηκε πρόσκληση');

	data = {
		nodereq: nodereq,
		prosklisi: nodereq.url.prosklisi,
		trapezi: prosklisi.prosklisiTrapeziGet(),
	};

	data.apo = prosklisi.prosklisiApoGet();
	data.pros = prosklisi.prosklisiProsGet();

	if ((data.apo != nodereq.login) && (data.pros != nodereq.login))
	return nodereq.error('Η πρόσκληση δεν σας αφορά');

	conn = DB.connection();
	query = 'DELETE FROM `prosklisi` WHERE `kodikos` = ' + nodereq.url.prosklisi;
	conn.connection.query(query, function(err, res) {
		conn.free();
		if ((!res) || (res.affectedRows != 1)) return nodereq.error('Απέτυχε η διαγραφή της προσκλήσεως');
		Service.prosklisi.diagrafi2(data);
	});
};

Service.prosklisi.diagrafi2 = function(data) {
	var kinisi;

	data.nodereq.end();
	kinisi = new Kinisi({
		idos: 'DL',
		data: {
			kodikos: data.prosklisi,
			apo: data.apo,
			pros: data.pros,
		},
	});

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);

	// Έχουμε διαγράψει την πρόσκληση και θα ελέγξουμε μήπως
	// το τραπέζι είναι πριβέ, οπότε θα πρέπει να ελέγξουμε
	// μήπως ο παραλήπτης είναι θεατής στο τραπέζι και σ' αυτή
	// την περίπτωση να κάνουμε τις απαραίτητες ενέργειες.

	Service.prosklisi.diagrafi3(data);
};

Service.prosklisi.diagrafi3 = function(data) {
	var sinedria, trapezi, conn, query;

	sinedria = Server.skiniko.skinikoSinedriaGet(data.pros);
	if (!sinedria) return;

	if (sinedria.sinedriaOxiTrapezi(data.trapezi)) return;
	if (sinedria.sinedriaOxiTheatis()) return;

	trapezi = Server.skiniko.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return;
	if (trapezi.trapeziIsDimosio()) return;

	conn = DB.connection();
	query = 'UPDATE `sinedria` SET `trapezi` = NULL, `thesi` = NULL, `simetoxi` = NULL ' +
		'WHERE `pektis` = ' + data.pros.json();
	conn.connection.query(query, function(err, res) {
		var kinisi;

		conn.free();

		// Αν κάτι δεν πήγε καλά, αφήνω τον θεατή στο κλειδωμένο
		// τραπέζι ώστε οι κλειδοκράτορες να γνωρίζουν ότι αυτός
		// παραμένει.

		if ((!res) || (res.affectedRows < 1))
		return;

		kinisi = new Kinisi({
			idos: 'RT',
			data: {
				pektis: data.pros,
			},
		});

		Server.skiniko.
		processKinisi(kinisi).
		kinisiAdd(kinisi);
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.prosklisi.apodoxi = function(nodereq) {
	var skiniko = nodereq.skiniko, prosklisi, sinderia, trapezi, trapeziKodikos, thesi;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('prosklisi', true)) return;

	prosklisi = skiniko.skinikoProsklisiGet(nodereq.url.prosklisi);
	if (!prosklisi) return nodereq.error('Δεν βρέθηκε πρόσκληση');
	if (prosklisi.prosklisiProsGet() != nodereq.login) return nodereq.error('Η πρόσκληση δεν σας αφορά');

	trapezi = skiniko.skinikoTrapeziGet(prosklisi.prosklisiTrapeziGet());
	if (!trapezi) return node.error('Δεν βρέθηκε το τραπέζι');
	trapeziKodikos = trapezi.trapeziKodikosGet();

	// Εξετάζουμε πρώτα την περίπτωση κατά την οποία ο παίκτης είναι ήδη ενταγμένος
	// ως παίκτης στο τραπέζι της πρόσκλησης.

	thesi = trapezi.trapeziThesiPekti(nodereq.login);
	if (thesi) return Service.prosklisi.apodoxiEpanodos(nodereq, trapeziKodikos, thesi);

	// Δοκιμάζουμε τη θέση που κατείχε/παρακολουθούσε ο παίκτης παλιότερα
	// στο συγκεκριμένο τραπέζι. Αν η θέση είναι κατειλημμένη, παίρνουμε
	// την πρώτη κενή θέση.

	thesi = trapezi.trapeziSimetoxiGet(nodereq.login);
	if (trapezi.trapeziOxiKeniThesi(thesi)) thesi = trapezi.trapeziKeniThesi();

	// Αν έχει βρεθεί κενή θέση στο τραπέζι, τότε εντάσσουμε τον παίκτη
	// ως παίκτη στη συγκεκριμένη θέση του τραπεζιού.

	if (thesi) return DB.connection().transaction(function(conn) {
		Service.prosklisi.apodoxiPektis(nodereq, conn, trapeziKodikos, thesi);
	});

	// Δεν βρέθηκε κενή θέση, επομένως θα εντάξουμε τον παίκτη ως θεατή στο τραπέζι.

	Service.prosklisi.apodoxiTheatis(nodereq, trapeziKodikos, trapezi);
};

Service.prosklisi.apodoxiEpanodos = function(nodereq, trapeziKodikos, thesi) {
	var simetoxi, query, conn;

	simetoxi = 'ΠΑΙΚΤΗΣ';
	query = 'UPDATE `sinedria` SET `trapezi` = ' + trapeziKodikos + ', `thesi` = ' + thesi +
		', `simetoxi` = ' + simetoxi.json() + ' WHERE `pektis` = ' + nodereq.login.json();
	conn = DB.connection();
	conn.connection.query(query, function(err, res) {
		conn.free();
		if ((!res) || (res.affectedRows != 1)) return nodereq.error('Απέτυχε η επάνοδος παίκτη');
		Service.prosklisi.apodoxi2(nodereq, trapeziKodikos, thesi, simetoxi);
	});
};

Service.prosklisi.apodoxiPektis = function(nodereq, conn, trapeziKodikos, thesi) {
	var query, simetoxi = 'ΠΑΙΚΤΗΣ';

	query = 'UPDATE `sinedria` SET `trapezi` = ' + trapeziKodikos + ', `thesi` = ' + thesi +
		', `simetoxi` = ' + simetoxi.json() + ' WHERE `pektis` = ' + nodereq.login.json();
	conn.connection.query(query, function(err, res) {
		if ((!res) || (res.affectedRows != 1)) {
			conn.rollback();
			return nodereq.error('Απέτυχε η ενημέρωση της συνεδρίας');
		}

		Service.prosklisi.apodoxiPektis2(nodereq, conn, trapeziKodikos, thesi, simetoxi);
	});
};

Service.prosklisi.apodoxiPektis2 = function(nodereq, conn, trapeziKodikos, thesi, simetoxi) {
	var query;

	query = 'UPDATE `trapezi` SET `pektis' + thesi + '` = ' + nodereq.login.json() +
		' WHERE `kodikos` = ' + trapeziKodikos;
	conn.connection.query(query, function(err, res) {
		if ((!res) || (res.affectedRows != 1)) {
			conn.rollback();
			return nodereq.error('Απέτυχε η ενημέρωση του τραπεζιού');
		}

		conn.commit();
		Service.prosklisi.apodoxi2(nodereq, trapeziKodikos, thesi, simetoxi);
	});
};

Service.prosklisi.apodoxiTheatis = function(nodereq, trapeziKodikos, trapezi) {
	var thesi, simetoxi, query, conn;

	thesi = trapezi.trapeziSimetoxiGet(nodereq.login);
	simetoxi = 'ΘΕΑΤΗΣ';
	query = 'UPDATE `sinedria` SET `trapezi` = ' + trapeziKodikos + ', `thesi` = ' + thesi +
		', `simetoxi` = ' + simetoxi.json() + ' WHERE `pektis` = ' + nodereq.login.json();
	conn = DB.connection();
	conn.connection.query(query, function(err, res) {
		conn.free();
		if ((!res) || (res.affectedRows != 1)) return nodereq.error('Απέτυχε η αποδοχή ως θεατής');
		Service.prosklisi.apodoxi2(nodereq, trapeziKodikos, thesi, simetoxi);
	});
};

Service.prosklisi.apodoxi2 = function(nodereq, trapeziKodikos, thesi, simetoxi) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi({
		idos: 'AL',
		data: {
			pektis: nodereq.login,
			trapezi: trapeziKodikos,
			thesi: thesi,
			simetoxi: simetoxi,
		},
	});

	Server.skiniko.processKinisi(kinisi).kinisiAdd(kinisi);
};
