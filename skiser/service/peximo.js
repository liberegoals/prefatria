////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: dilosi');

Service.peximo = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.peximo.peximo = function(nodereq) {
	var data;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;
	if (nodereq.denPerastike('filo', true)) return;

	// Ελέγχουμε και μετατρέπουμε σε ακέραιο τη θέση του παίκτη
	// που παίζει το φύλλο.

	if (Prefadoros.oxiThesi(nodereq.url.pektis))
	return nodereq.error('ακαθόριστη θέση παίκτη');
	nodereq.url.pektis = parseInt(nodereq.url.pektis);

	data = {
		nodereq: nodereq,
	};

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi) return Service.peximo.apotixia(data, 'ακαθόριστο τραπέζι');
	if (!data.trapezi.trapeziKlidoma()) return  Service.peximo.apotixia(data, 'Το τραπέζι είναι κλειδωμένο');
	if (data.trapezi.partidaFasiGet() !== 'ΠΑΙΧΝΙΔΙ') return  Service.peximo.apotixia(data, 'Τραπέζι εκτός φάσης');
	if (Debug.flagGet('epomenosCheck') && (data.trapezi.partidaEpomenosGet() !== nodereq.url.pektis))
	return  Service.peximo.apotixia(data, 'Παίκτης εκτός φάσης');

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();
	if (!data.dianomi) return Service.peximo.apotixia(data, 'ακαθόριστη διανομή');

	data.trapeziKodikos = data.trapezi.trapeziKodikosGet();
	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();

	DB.connection().transaction(function(conn) {
		data.conn = conn;
		Service.peximo.peximo2(data);
	});
};

Service.peximo.peximo2 = function(data) {
	var query;

	data.kinisiPeximo = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.nodereq.url.pektis,
			idos: 'ΦΥΛΛΟ',
			data: data.nodereq.url.filo,
		},
	});

	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		data.kinisiPeximo.data.dianomi + ', ' + data.kinisiPeximo.data.pektis + ', ' +
		data.kinisiPeximo.data.idos.json() + ', ' + data.kinisiPeximo.data.data.json() + ')';
	data.conn.connection.query(query, function(err, res) {
		if (err || (res.affectedRows != 1))
		return Service.peximo.apotixia(data, 'Απέτυχε η ένταξη παιξίματος φύλλου στην database');


		data.energiaFiloKodikos = res.insertId;
		data.kinisiPeximo.data.kodikos = data.energiaFiloKodikos;
		Server.skiniko.processKinisi(data.kinisiPeximo);

		switch (data.trapezi.partidaFasiGet()) {
		case 'ΠΛΗΡΩΜΗ':
			Service.peximo.pliromi(data);
			break;
		default:
			data.conn.commit();
			delete data.conn;

			data.trapezi.trapeziXeklidoma();
			data.nodereq.end();

			Server.skiniko.
			kinisiAdd(data.kinisiPeximo);
			break;
		}
	});
};

Service.peximo.pliromi = function(data) {
	var dianomi, query;

	dianomi = data.dianomi;
	query = 'UPDATE `dianomi` SET ' +
		'`kasa1` = ' + dianomi.dianomiKasaGet(1) + ', `metrita1` = ' + dianomi.dianomiMetritaGet(1) + ', ' +
		'`kasa2` = ' + dianomi.dianomiKasaGet(2) + ', `metrita2` = ' + dianomi.dianomiMetritaGet(2) + ', ' +
		'`kasa3` = ' + dianomi.dianomiKasaGet(3) + ', `metrita3` = ' + dianomi.dianomiMetritaGet(3) +
		' WHERE `kodikos` = ' + data.dianomiKodikos;
	data.conn.connection.query(query, function(err, res) {
		if ((!err) && (res.affectedRows == 1)) 
		return Service.peximo.pliromi2(data);

		data.conn.rollback();
		delete data.conn;

		dianomi.dianomiEnergiaDelete(data.energiaFiloKodikos);
		dianomi.energiaArray.pop();
		data.trapezi.partidaReplay();
		Service.peximo.apotixia(data, 'Απέτυχε η ενημέρωση πληρωμής διανομής στην database');
	});
};

Service.peximo.pliromi2 = function(data) {
	var dianomi, kinisiPliromi;

	dianomi = data.dianomi;
	data.conn.commit();
	delete data.conn;

	kinisiPliromi = data.dianomi.kinisiPliromi();
	Server.skiniko.
	processKinisi(kinisiPliromi).
	kinisiAdd(data.kinisiPeximo, false).
	kinisiAdd(kinisiPliromi);
	data.trapezi.trapeziXeklidoma();
	data.nodereq.end();

	Service.trapezi.dianomiSeLigo(data.trapezi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.peximo.apotixia = function(data, msg) {
	if (data.conn) data.conn.rollback();
	if (data.trapezi) data.trapezi.trapeziXeklidoma();
	data.nodereq.error(msg);
};
