////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: minima');

Service.minima = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.minima.send = function(nodereq) {
	var pektis, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;
	if (nodereq.denPerastike('kimeno', true)) return;

	pektis = Server.skiniko.skinikoPektisGet(nodereq.url.pektis);
	if (!pektis) return nodereq.error('Δεν βρέθηκε ο παίκτης στο σκηνικό');

	query = 'INSERT INTO `minima (`apostoleas`, `paraliptis`, `kimeno`) VALUES (' +
		nodereq.loginGet().json() + ', ' + nodereq.url.pektis.json() + ', ' +
		nodereq.url.kimeno.json() + ')';
	DB.connection().query(query, function(conn, rows) {
		var kinisi;

		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Απέτυχε η αποστολή του μηνύματος');

		kinisi = new Kinisi({
			idos: 'ML',
			data: {
				id: minimaId,
				pektis: nodereq.url.pektis,
			}
		});

		Server.skiniko.
		kinisiAdd(kinisi);
	});
};
