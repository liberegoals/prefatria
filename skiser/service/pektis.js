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

// Αν κάποιος παίκτης δεν έχει σχετική συνεδρία, ή δεν έχει προσπελαστεί
// για περισσότερες 12 ώρες, τον βγάζουμε εκτός σκηνικού.

Service.pektis.timeout = 12 * 60 * 60;

Service.pektis.check = function() {
	var tora;

	tora = Globals.tora();
	Server.skiniko.skinikoPektisWalk(function() {
		var poll, login;

		poll = this.pektisPollGet();
		if (tora - poll < Service.pektis.timeout)
		return;

		login = this.pektisLoginGet();
		if (Server.skiniko.skinikoSinedriaGet(login))
		return;

		console.log(login + ': αποκαθήλωση παίκτη');
		Server.skiniko.skinikoPektisDelete(login);
	});
};
