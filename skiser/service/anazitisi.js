////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: anazitisi');

Service.anazitisi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.anazitisi.anazitisi = function(nodereq) {
	var pattern, sxesi, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pattern', true)) return;
	if (nodereq.denPerastike('sxesi', true)) return;

	pattern = nodereq.url.pattern;
	sxesi = parseInt(nodereq.url.sxesi);
	if ((!pattern) && (!sxesi))
	return nodereq.error('Δεν δόθηκαν επαρκή κριτήρια');

	query = 'SELECT `login`, `onoma` FROM `pektis` WHERE 1';

	if (pattern) {
		pattern = ('%' + pattern + '%').json();
		query += ' AND ((`login` LIKE ' + pattern + ') OR (`onoma` LIKE ' + pattern + '))';
	}

	if (sxesi)
	query += " AND (`login` IN (SELECT `sxetizomenos` FROM `sxesi` WHERE `pektis` LIKE " +
		nodereq.loginGet().json() + " AND `sxesi` = 'ΦΙΛΟΣ'))";

	DB.connection().query(query, function(conn, rows) {
		var i;

		conn.free();
		for (i = 0; i < rows.length; i++) {
			nodereq.write('{login:' + rows[i].login.json() + ',onoma:' + rows[i].onoma.json() + '},');
		}
		nodereq.end();
	});
};
