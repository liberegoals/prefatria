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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.minima.diagrafi = function(nodereq) {
	var login, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('minima', true)) return;

	login = nodereq.loginGet();

	query = 'SELECT `apostoleas`, `paraliptis` FROM `minima` WHERE `kodikos` = ' + nodereq.url.minima;
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		if (rows.length != 1)
		return nodereq.error('Δεν βρέθηκε το μήνυμα');

		if ((rows[0].apostoleas != login) && (rows[0].paraliptis != login))
		return nodereq.error('Δεν έχετε πρόσβαση');

		Service.minima.diagrafi2(nodereq);
	});
};

Service.minima.diagrafi2 = function(nodereq) {
	var query;

	query = 'DELETE FROM `minima` WHERE `kodikos` = ' + nodereq.url.minima;
	DB.connection().query(query, function(conn, rows) {
		var kinisi;

		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Απέτυχε η διαγραφή του μηνύματος');

		nodereq.end();
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.minima.diavasma = function(nodereq) {
	var login, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('minima', true)) return;

	login = nodereq.loginGet();

	query = 'SELECT `apostoleas`, `paraliptis`, `status` FROM `minima` ' +
		'WHERE `kodikos` = ' + nodereq.url.minima;
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		if (rows.length != 1)
		return nodereq.error('Δεν βρέθηκε το μήνυμα');

		if (rows[0].apostoleas == login)
		return nodereq.error('Το μήνυμα είναι δικό σας');

		if (rows[0].paraliptis != login)
		return nodereq.error('Δεν έχετε πρόσβαση');

		Service.minima.diavasma2(nodereq, rows[0]['status']);
	});
};

Service.minima.diavasma2 = function(nodereq, katastasi) {
	var query;

	katastasi = (katastasi === 'ΔΙΑΒΑΣΜΕΝΟ' ? 'ΑΔΙΑΒΑΣΤΟ' : 'ΔΙΑΒΑΣΜΕΝΟ');
	query = 'UPDATE `minima` SET `status` = ' + katastasi.json() +
		' WHERE `kodikos` = ' + nodereq.url.minima;
	DB.connection().query(query, function(conn, rows) {
		var kinisi;

		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Απέτυχε η αλλαγή κατάστασης του μηνύματος');

		nodereq.end(katastasi);
	});
};
