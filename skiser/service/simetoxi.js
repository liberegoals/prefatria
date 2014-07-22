////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: simetoxi');

Service.simetoxi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.simetoxi.dilosi = function(nodereq) {
	var data;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('thesi', true)) return;
	if (nodereq.denPerastike('dilosi', true)) return;

	if (Prefadoros.oxiThesi(nodereq.url.thesi)) return nodereq.error('ακαθόριστη θέση δηλούντος');
	nodereq.url.thesi = parseInt(nodereq.url.thesi);

	data = {
		nodereq: nodereq,
	};

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi) return Service.simetoxi.apotixia(data, 'ακαθόριστο τραπέζι');
	if (!data.trapezi.trapeziKlidoma()) return  Service.simetoxi.apotixia(data, 'Το τραπέζι είναι κλειδωμένο');
	if (data.trapezi.partidaFasiGet() !== 'ΣΥΜΜΕΤΟΧΗ') return  Service.simetoxi.apotixia(data, 'Τραπέζι εκτός φάσης');
	if (Debug.flagGet('epomenosCheck') && (data.trapezi.partidaEpomenosGet() !== nodereq.url.thesi))
	return  Service.simetoxi.apotixia(data, 'Παίκτης εκτός φάσης');

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();
	if (!data.dianomi) return Service.simetoxi.apotixia(data, 'ακαθόριστη διανομή');

	data.trapeziKodikos = data.trapezi.trapeziKodikosGet();
	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();

	DB.connection().transaction(function(conn) {
		data.conn = conn;
		Service.simetoxi.dilosi2(data);
	});
};

Service.simetoxi.dilosi2 = function(data) {
	var kinisiSimetoxi;

	kinisiSimetoxi = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.trapezi.partidaEpomenosGet(),
			idos: 'ΣΥΜΜΕΤΟΧΗ',
			data: data.nodereq.url.dilosi,
		},
	});

	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		kinisiSimetoxi.data.dianomi + ', ' + kinisiSimetoxi.data.pektis + ', ' +
		kinisiSimetoxi.data.idos.json() + ', ' + kinisiSimetoxi.data.data.json() + ')';
	data.conn.connection.query(query, function(err, res) {
		var kinisiPliromi;

		if (err || (res.affectedRows != 1))
		return Service.simetoxi.apotixia(data, 'Απέτυχε η ένταξη της δήλωσης συμμετοχής στην database');
		data.conn.commit();
		data.nodereq.end();

		kinisiSimetoxi.data.kodikos = res.insertId;
		Server.skiniko.
		processKinisi(kinisiSimetoxi).
		kinisiAdd(kinisiSimetoxi, false);

		if (data.trapezi.partidaFasiGet() !== 'ΠΛΗΡΩΜΗ') {
			Server.skiniko.kinisiAdd();
			data.trapezi.trapeziXeklidoma();
			return;
		}

		kinisiPliromi = data.dianomi.kinisiPliromi();
		Server.skiniko.
		processKinisi(kinisiPliromi).
		kinisiAdd(kinisiPliromi);
		data.trapezi.trapeziXeklidoma();
		Service.trapezi.dianomiSeLigo(data.trapezi, 3000);

	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.simetoxi.apotixia = function(data, msg) {
	if (data.conn) data.conn.rollback();
	if (data.trapezi) data.trapezi.trapeziXeklidoma();
	data.nodereq.error(msg);
};
