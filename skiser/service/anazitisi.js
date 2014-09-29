////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: anazitisi');

Service.anazitisi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.anazitisi.anazitisi = function(nodereq) {
	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pattern', true)) return;
	if (nodereq.denPerastike('katastasi', true)) return;
	if (nodereq.denPerastike('sxesi', true)) return;

	switch (nodereq.url.katastasi) {
	case 'ONLINE':
	case 'AVAILABLE':
		Service.anazitisi.skiniko(nodereq);
		break;
	default:
		Service.anazitisi.database(nodereq);
		break;
	}
};

Service.anazitisi.skiniko = function(nodereq) {
	var zitoulas, pattern, diathesimos, sxesi;

	zitoulas = nodereq.pektisGet();
	pattern = nodereq.url.pattern;
	if (pattern) pattern = new RegExp(pattern.replace(/%/g, '.*').replace(/_/g, '.'), "i");
	diathesimos = (nodereq.url.katastasi === 'AVAILABLE');
	sxesi = parseInt(nodereq.url.sxesi);

	Server.skiniko.skinikoSinedriaWalk(function() {
		var login, pektis;

		login = this.sinedriaPektisGet();

		if (sxesi && zitoulas.pektisOxiFilos(login))
		return;

		if (diathesimos && this.sinedriaIsPektis())
		return;

		if (pattern && (!login.match(pattern))) {
			pektis = Server.skiniko.skinikoPektisGet(login);
			if (!pektis) return;
			if (!pektis.pektisOnomaGet().match(pattern)) return;
		}

		nodereq.write('{login:' + login.json() + '},');
	});
	nodereq.end();
};

Service.anazitisi.database = function(nodereq) {
	var pattern, sxesi, query;

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
