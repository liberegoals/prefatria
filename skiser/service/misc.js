////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: misc');

Service.misc = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Με το αίτημα κόρνας ο παίκτης κορνάρει σε όσους έχουν σχέση με το τραπέζι στο
// οποίο παίζει. Όσοι βρίσκονται στο τραπέζι του ως παίκτες ή ως θεατές θα δουν
// στη συζήτηση του τραπεζιού μια κόρνα από τον συγκεκριμένο παίκτη και θα
// ακούσουν ηχητικό σήμα κόρνας. Αν κάποιος παίκτης του τραπεζιού αλητεύει
// σε άλλο τραπέζι, τοτε και αυτός θα ακούσει το σήμα.

Service.misc.korna = function(nodereq) {
	if (nodereq.isvoli()) return;
	if (nodereq.oxiPektis()) return;
	nodereq.end();

	Server.skiniko.
	kinisiAdd(new Kinisi({
		idos: 'KN',
		data: {
			pektis: nodereq.loginGet(),
			trapezi: nodereq.trapeziGet().trapeziKodikosGet(),
		},
	}));;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

var aaaa = 0;
Service.misc.fortosData = function(nodereq) {
aaaa++;
	nodereq.write('pektes: 102,');
	nodereq.write('trapezia: 24,');
	nodereq.write('fortos: ' + aaaa + ',');
	nodereq.end();
};
