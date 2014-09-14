////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: profinfo');

Service.profinfo = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.profinfo.get = function(nodereq) {
	var paraliptis, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;

	paraliptis = nodereq.loginGet();
	query = 'SELECT `pektis`, `sxoliastis`, `kimeno` FROM `profinfo` WHERE `pektis` = ' +
		nodereq.url.pektis.json();
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		Globals.awalk(rows, function(i, profinfo) {
			if ((profinfo['sxoliastis'] != profinfo['pektis']) &&
			(profinfo['sxoliastis'] != paraliptis)) return;

			for (var i = 0; i < 50; i++)
			profinfo['kimeno'] += ' asdasdasda';
			nodereq.write(profinfo['sxoliastis'].json() + ':' + profinfo['kimeno'].json() + ',');
		});
		nodereq.end();
	});
};
