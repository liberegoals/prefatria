////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: misc');

Service.misc = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.misc.korna = function(nodereq) {
	var kinisi;

	if (nodereq.isvoli()) return;
	if (nodereq.oxiPektis()) return;

	nodereq.end();

	kinisi = new Kinisi('KN');
	kinisi.data = {
		pektis: nodereq.loginGet(),
		trapezi: nodereq.trapeziGet().trapeziKodikosGet(),
	};

	Server.skiniko.
	kinisiAdd(kinisi);
};
