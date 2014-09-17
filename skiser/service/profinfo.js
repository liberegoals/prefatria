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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.profinfo.put = function(nodereq) {
	var login, pektis, sxoliastis, kimeno, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;
	if (nodereq.denPerastike('kimeno', true)) return;

	login = nodereq.url.pektis;
	pektis = Server.skiniko.skinikoPektisGet(login);
	if (!pektis) return nodereq.error('Δεν βρέθηκε ο παίκτης στο σκηνικό');

	if (!pektis.hasOwnProperty('profinfo'))
	return nodereq.error('Δεν βρέθηκαν πληροφορίες προφίλ στο σκηνικό');

	sxoliastis = nodereq.loginGet();
	kimeno = nodereq.url.kimeno.trim();
	query = 'REPLACE INTO `profinfo` (`pektis`, `sxoliastis`, `kimeno`) VALUES (' +
		login.json() + ', ' + sxoliastis.json() + ', ' + kimeno.json() + ')';
	DB.connection().query(query, function(conn, rows) {
		var kinisi;

		conn.free();
		if (conn.affectedRows < 1)
		return nodereq.error('Απέτυχε η καταχώρηση του προφίλ στην database');

		nodereq.end();

		// Επιτελούμε απευθείας την αλλαγή στο σηνικό του skiser και δεν
		// το κάνουμε μέσω κινήσεως εξ αιτίας της ιδιαιτερότητας που υπάρχει
		// λόγω της ιδιωτικότητας της πληροφορίας.

		pektis.pektisProfinfoSet(sxoliastis, kimeno);

		// Αν ο σχολιαστής δεν είναι ο ίδιος ο παίκτης, τότε η πληροφορία
		// είναι απόρρητη και αφορά μόνο τον ίδιο τον σχολιαστή, ο οποίος
		// ωστόσο έχει ήδη την πληροφορία στα χέρια του καθώς την έχει
		// συντάξει ο ίδιος, επομένως δεν χρειάζεται να κοινοποιήσουμε
		// κάτι σε κάποιον από τους clients.

		if (login != sxoliastis) return;

		// Ο σχολιαστής είναι ο ίδιος ο παίκτης, επομένως πρόκειται για το
		// προφίλ που συντάσσει ο ίδιος ο παίκτης για τον εαυτό του και αυτό
		// το προφίλ πρέπει να δημοσιοποιηθεί.

		kinisi = new Kinisi({
			idos: 'PI',
			data: {
				pektis: login,
				sxoliastis: sxoliastis,
				kimeno: kimeno,
			}
		});

		// Όπως προείπαμε, η ενημέρωση της πληροφορίας προφίλ στο σκηνικό τού
		// skiser έχει ήδη γίνει, επομένως το μόνο που έχουμε να κάνουμε είναι
		// να κοινοποιήσουμε την πληροφορία στους clients. Απλώς θα πρέπει να
		// αποφύγουμε να κοινοποιήσουμε την πληροφορία στον ίδιο τον συντάκτη
		// και αυτό το πετυχαίνουμε μέσω της μεθόδου αδιαφορίας.

		Server.skiniko.
		kinisiAdd(kinisi);
	});
};
