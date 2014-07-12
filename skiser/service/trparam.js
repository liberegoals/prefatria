////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: trparam');

Service.trparam = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trparam.set = function(nodereq) {
	var sinderia, trapezi, conn, query;

	if (nodereq.isvoli()) return;
	if (nodereq.oxiTrapezi()) return;
	if (nodereq.denPerastike('param', true)) return;
	if (nodereq.denPerastike('timi', true)) return;

	sinedria = nodereq.sinedriaGet();
	if (sinedria.sinedriaOxiPektis()) return nodereq.error('Δεν είστε παίκτης στο τραπέζι');

	conn = DB.connection();
	query = 'REPLACE INTO `trparam` (`trapezi`, `param`, `timi`) VALUES (' +
		(trapezi = sinedria.sinedriaTrapeziGet()) + ', ' + nodereq.url.param.json() + ', ' +
		nodereq.url.timi.json() + ')';
	conn.connection.query(query, function(err, res) {
		conn.free();
		if ((!res) || (res.affectedRows < 1)) return nodereq.error('Απέτυχε η αλλαγή παραμέτρου τραπεζιού');
		Service.trparam.set2(nodereq, trapezi);
	});
};

Service.trparam.set2 = function(nodereq, trapezi) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi({
		idos: 'TS',
		data: {
			pektis: nodereq.loginGet(),
			trapezi: trapezi,
			param: nodereq.url.param,
			timi: nodereq.url.timi,
		},
	});
	if (nodereq.url.apodoxi) kinisi.data.apodoxi = 1;

	Server.skiniko.processKinisi(kinisi).kinisiAdd(kinisi);
};
