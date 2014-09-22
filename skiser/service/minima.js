////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: minima');

Service.minima = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.minima.send = function(nodereq) {
	var paraliptis, apostoleas, kimeno, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;
	if (nodereq.denPerastike('kimeno', true)) return;

	apostoleas = nodereq.loginGet();
	paraliptis = nodereq.url.pektis;
	kimeno = nodereq.url.kimeno;

	query = 'INSERT INTO `minima` (`apostoleas`, `paraliptis`, `kimeno`) VALUES (' +
		apostoleas.json() + ', ' + paraliptis.json() + ', ' + kimeno.json(false) + ')';
	DB.connection().query(query, function(conn, rows) {
		var minimaId, kinisi;

		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Απέτυχε η αποστολή του μηνύματος');

		minimaId = conn.insertId;
		nodereq.end(minimaId);

		kinisi = new Kinisi({
			idos: 'ML',
			data: {
				id: minimaId,
				apostoleas: apostoleas,
				paraliptis: paraliptis,
			}
		});

		Server.skiniko.
		kinisiAdd(kinisi);
	});
};
