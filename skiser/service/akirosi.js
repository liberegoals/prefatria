////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: akirosi');

Service.akirosi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.akirosi.start = function(nodereq) {
	var data, pektis, energiaArray, energia, idos;

	if (nodereq.isvoli()) return;

	data = {
		nodereq: nodereq,
	};

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi) return nodereq.error('ακαθόριστο τραπέζι');
	if (!data.trapezi.trapeziKlidoma()) return  nodereq.error('Το τραπέζι είναι κλειδωμένο');

	pektis = nodereq.sinedriaGet().sinedriaThesiGet();
	if (!pektis) return nodereq.error('Ακαθόριστη θέση παίκτη');

	switch (data.trapezi.partidaFasiGet()) {
	case 'ΔΗΛΩΣΗ':
	case 'ΑΛΛΑΓΗ':
	case 'ΣΥΜΜΕΤΟΧΗ':
	case 'ΠΑΙΧΝΙΔΙ':
	case 'CLAIM':
		break;
	default:
		return Service.akirosi.apotixia(data, 'Τραπέζι εκτός φάσης');
	}

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();
	if (!data.dianomi)
	return Service.akirosi.apotixia(data, 'Ακαθόριστη διανομή');

	if (!data.dianomi.hasOwnProperty('energiaArray'))
	return Service.akirosi.stop2(data, 'Δεν υπάρχουν ενέργειες στη διανομή');

	energiaArray = data.dianomi.energiaArray;
	if (energiaArray.length < 2)
	return Service.akirosi.stop2(data, 'Δεν υπάρχουν ενέργειες προς διαγραφή');

	// Εκκινούμε την ακύρωση ενεργειών ακυρώνοντας την τελευταία ενέργεια.
	// Ωστόσο, υπάρχει περίπτωση η ενέργεια που ακυρώνουμε να επισύρει και
	// επιπλέον ακυρώσεις.

	data.ecount = energiaArray.length - 1;
	while (true) {
		energia = energiaArray[data.ecount];
		data.energiaKodikos = energia.energiaKodikosGet();
		if (!data.energiaKodikos)
		return Service.akirosi.apotixia(data, 'Ακαθόριστη ενέργεια προς διαγραφή');

		idos = energia.energiaIdosGet();
		if (idos === 'ΤΖΟΓΟΣ') {
			data.ecount--;
			continue;
		}

		break;
	}

	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();
	DB.connection().transaction(function(conn) {
		data.conn = conn;
		Service.akirosi.start2(data);
	});
};

Service.akirosi.start2 = function(data) {
	var query = 'DELETE FROM `energia` WHERE `dianomi` = ' + data.dianomiKodikos +
		' AND `kodikos` >= ' + data.energiaKodikos;
	data.conn.connection.query(query, function(err, res) {
		if (err || (res.affectedRows < 1))
		return Service.akirosi.apotixia(data, 'Αποτυχία διαγραφής ενέργειας από την database');

		Service.akirosi.start3(data);
	});
};

Service.akirosi.start3 = function(data) {
	var kinisi;

	data.conn.commit();
	delete data.conn;
	data.nodereq.end();

	kinisi = new Kinisi({
		idos: 'AK',
		data: {
			trapezi: data.trapezi.trapeziKodikosGet(),
			pektis: data.nodereq.loginGet(),
			ecount: data.ecount,
		},
	});

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
	data.trapezi.trapeziXeklidoma();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.akirosi.stop = function(nodereq) {
	var data;

	if (nodereq.isvoli()) return;

	data = {
		nodereq: nodereq,
	};

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi) return nodereq.error('ακαθόριστο τραπέζι');
	if (!data.trapezi.trapeziKlidoma()) return  nodereq.error('Το τραπέζι είναι κλειδωμένο');

	Service.akirosi.stop2(data);
};

Service.akirosi.stop2 = function(data, minima) {
	var kinisi = new Kinisi({
		idos: 'AK',
		data: {
			trapezi: data.trapezi.trapeziKodikosGet(),
		},
	});

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
	data.nodereq.end(minima);
	data.trapezi.trapeziXeklidoma();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.akirosi.apotixia = function(data, msg) {
	if (data.conn) data.conn.rollback();
	if (data.trapezi) data.trapezi.trapeziXeklidoma();
	data.nodereq.error(msg);
};
