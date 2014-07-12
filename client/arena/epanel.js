Arena.epanel = new BPanel();

Arena.epanel.clickCommon = function(e) {
	Arena.inputRefocus(e);
};

Arena.epanel.bpanelButtonPush(new PButton({
	id: 'enalagi',
	img: '4Balls.png',
	title: 'Εναλλαγή εργαλείων',
	click: function(e) {
		Arena.epanel.bpanelEpomeniOmada();
		this.pbuttonGetDOM().strofi({
			strofi: 90,
			duration: 200,
		});
	},
}));

Arena.epanel.bpanelButtonPush(new PButton({
	id: 'arxiki',
	img: 'ikona/misc/mazemaPano.png',
	title: 'Αρχική σειρά εργαλείων',
	click: function(e) {
		Arena.epanel.bpanelOmadaSet(1);
		Arena.epanel.nottub['enalagi'].pbuttonGetDOM().strofi({
			strofi: -90,
			duration: 200,
		});
	},
}));

Arena.epanel.lefkoma = [
	[
		'pikra.png',
		'mati.png',
		'dakri.png',
		'klama.png',
		'tromos.png',
		'thimos.png',
		'ekplixi.png',
		'mataki.png',
		'gelaki.png',
		'gelio.png',
		'love.png',
	],
	[
		'kardia.png',
		'xara.png',
		'tomata.png',
		'gelaki.png',
		'kokinizo.png',
		'kamenos.png',
		'mati.png',
		'glosa.png',
		'keratas.png',
		'what.png',
		'devil.png',
	],
	[
		'boss.png',
		'smile.png',
		'look.png',
		'haha.png',
		'oops.png',
		'misdoubt.png',
		'doubt.png',
		'pudency.png',
		'beated.png',
		'sad.png',
		'ah.png',
	],
	[
		'angry.png',
		'ft.png',
		'eek.png',
		'razz.png',
		'shame.png',
		'lovely.png',
		'sad.png',
		'smile.png',
		'lol.png',
		'shuai.png',
		'sweat.png',
	],
	[
		'matia.gif',
		'binelikia.gif',
		'kapikia.gif',
		'bouketo.gif',
		'kakos.gif',
		'plastis.gif',
		'malakia.gif',
		'lol.gif',
		'love.gif',
		'oxi.gif',
		'tromos.gif',
	],
	[
		'hi.gif',
		'koroidia.gif',
		'matakia.gif',
		'toulipa.gif',
		'ipopto.gif',
		'aporia.gif',
		'klaps.gif',
		'ekplixi.gif',
		'tromos.gif',
		'binelikia.gif',
		'nani.gif',
	],
	[
		'gialiko.png',
		'glosa.png',
		'kokinisma.png',
		'mousitsa.png',
		'mataki.png',
		'gelaki.png',
		'lol.png',
		'love.png',
		'apogoitefsi.png',
		'zimia.png',
		'dakri.png',
	],
];

Arena.epanel.setup = function() {
	Globals.awalk(Arena.epanel.lefkoma, function(i, setaki) {
		var omada, dir;

		omada = i + 1;
		dir = 'ikona/emoticon/set' + (i + 1) + '/';
		Globals.awalk(setaki, function(i, emoticon) {
			Arena.epanel.bpanelButtonPush(new PButton({
				img: dir + emoticon,
				omada: omada,
			}));
		});
	});

	return Arena.epanel;
};

/*
Kafenio.epanel.iconDOM = function(omada, img, xoros) {
	if (xoros === undefined) xoros = Kafenio;
	return $('<img>').data('omada', omada).
	attr('src', Client.server + 'ikona/emoticon/set' + omada + '/' + xoros.epanel.lefkoma[omada][img]).
	on('click', function(e) {
		xoros.sizitisiInputDOM.val(xoros.sizitisiInputDOM.val() + '^E' + omada + ':' + img + '^');
		xoros.inputRefocus(e);
		Kafenio.sizitisiKeyup(null, xoros);
	});
};
*/
