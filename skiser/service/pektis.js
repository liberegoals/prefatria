////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: pektis');

Service.pektis = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.pektis.fetch = function(nodereq) {
	var skiniko, pektis, conn, query;

	if (nodereq.anonimo()) return;
	if (nodereq.denPerastike('login')) return nodereq.error('Δεν περάστηκε login name παίκτη');

	skiniko = nodereq.skinikoGet();
	pektis = skiniko.skinikoPektisGet(nodereq.url.login);
	if (pektis) return nodereq.end(pektis.pektisFeredata());

	query = 'SELECT * FROM `pektis` WHERE `login` = ' + nodereq.url.login.json();
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		if (rows.length != 1) return nodereq.error('Δεν βρέθηκε ο παίκτης στην database');

		pektis = new Pektis(row);
		skiniko.skinikoPektisSet(pektis);
		nodereq.end(pektis.stringify);

	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
