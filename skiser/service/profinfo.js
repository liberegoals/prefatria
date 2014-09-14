////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: profinfo');

Service.profinfo = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.profinfo.get = function(nodereq) {
	var pektis, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;

	pektis = Server.skiniko.skinikoPektisGet(nodereq.url.pektis);
	if (!pektis) return nodereq.error('Δεν βρέθηκε ο παίκτης στο σκηνικό');

	// Εφόσον ο παίκτης βρίσκεται στο σκηνικό του skiser, πρέπει να
	// υπάρχουν και οι πληροφορίες προφίλ, τις οποίες επιστρέφουμε
	// άμεσα.

	if (pektis.hasOwnProperty('profinfo'))
	return Service.profinfo.get2(nodereq, pektis);

	// Για κάποιο λόγο δεν βρέθηκαν στον skiser πληροφορίες προφίλ
	// για τον παίκτη, οπότε τις φορτώνουμε τώρα από την database.

	console.log(nodereq.url.pektis + ': ζητήθηκαν πληροφορίες προφίλ από την database');
	pektis.profinfo = {};
	query = 'SELECT ' + Profinfo.projection + ' FROM `profinfo` WHERE `pektis` = ' +
		nodereq.url.pektis.json();
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		Globals.awalk(rows, function(i, profinfo) {
			pektis.pektisProfinfoSet(profinfo['sxoliastis'], profinfo['kimeno']);
		});

		Service.profinfo.get2(nodereq, pektis);
	});
};

Service.profinfo.get2 = function(nodereq, pektis) {
	var login, paraliptis;

	login = pektis.pektisLoginGet();
	paraliptis = nodereq.loginGet();
	Globals.walk(pektis.profinfo, function(sxoliastis, kimeno) {
		if ((sxoliastis != login) && (sxoliastis != paraliptis))
		return;

		nodereq.write(sxoliastis.json() + ':' + kimeno.json() + ',');
	});
	nodereq.end();
};
