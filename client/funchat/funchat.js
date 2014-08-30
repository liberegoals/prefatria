Funchat = function(props) {
	Globals.initObject(this, props);
};

$(document).ready(function() {
	// Χρειαζόμαστε πρόσβαση στη βασική σελίδα του «Πρεφαδόρου», από
	// την οποία εκκίνησε το funchat. Σ' αυτή τη σελίδα υπάρχει global
	// μεταβλητή "Arena" και ουσιαστικά αυτήν χρειαζόμαστε.
	// Αν δεν υπάρχει γονική σελίδα, ή η μεταβλητή "Arena" δεν βρεθεί
	// στη γονική σελίδα, τότε θεωρούμε ότι το funchat έχει εκκινήσει
	// ανεξάρτητα σε δική του σελίδα.

	Arena = (window.opener && window.opener.Arena ? window.opener.Arena : null);
	Funchat.server = (Arena ? Arena.funchat.server : 'http://www.opasopa.net/prefadorosFC/');

	Funchat.ofelimoDOM = $('#ofelimo');
	Funchat.listaWalk(function() {
		this.funchatCreateDOM();
	});
});

Funchat.isArena = function() {
	return Arena;
};

Funchat.oxiArena = function() {
	return !Funchat.isArena();
};

Funchat.unload = function() {
	if (Funchat.unloaded) return;
	Funchat.unloaded = true;

	if (Funchat.oxiArena())
	return;

	Funchat.diastasiSave();
	Arena.funchat.klisimo();
};

$(window).
on('resize', function() {
	Funchat.diastasiSave();
}).
on('beforeunload', function() {
	Funchat.unload();
}).
on('unload', function() {
	Funchat.unload();
});

Funchat.diastasiSave = function() {
	Client.ajaxService('asdasda').
	done(function(rsp) {
		Client.fyi.pano(rsp);
	}).
	fail(function(err) {
		Client.fyi.epano('asdasd');
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Funchat.prototype.funchatKimenoGet = function() {
	return this.txt;
};

Funchat.prototype.funchatIxosGet = function() {
	return this.ixos;
};

Funchat.prototype.funchatEntasiGet = function() {
	return this.entasi;
};

Funchat.prototype.funchatIxosPlay = function() {
	var ixos;

	ixos = this.funchatIxosGet();
	if (!ixos) return this;

	Client.sound.play(Funchat.server + ixos, this.funchatEntasiGet());
};

Funchat.prototype.funchatCreateDOM = function() {
	var kimeno;

	if (this.hasOwnProperty('dom'))
	return this;

	this.dom = $('<div>').addClass('funchatItem').appendTo(Funchat.ofelimoDOM).
	data('item', this).
	on('click', function(e) {
		var item, ixos;

		item = $(this).data('item');
		if (!item) return;

		item.funchatIxosPlay();
	});

	kimeno = this.funchatKimenoGet();
	if (kimeno) this.dom.attr('title', kimeno);

	if (this.hasOwnProperty('img'))
	$('<img>').addClass('funchatIkona').attr('src', Funchat.server + this.img).appendTo(this.dom);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Funchat.lista = [];

Funchat.listaWalk = function(callback) {
	var i;

	for (i = 0; i < Funchat.lista.length; i++) {
		callback.call(Funchat.lista[i]);
	}
};

Funchat.lista.push(new Funchat({
	img: 'etsi.gif',
	txt: 'Έεεεεετσι!',
}));

Funchat.lista.push(new Funchat({
	img: 'elaStoThio.gif',
	txt: 'Έλα στο θείο!',
}));

Funchat.lista.push(new Funchat({
	img: 'egiptiakosXoros.gif',
	txt: 'Έλα στο θείο!',
}));

Funchat.lista.push(new Funchat({
	img: 'xipna.gif',
	txt: 'Ξύπνα ρεεε!',
}));

Funchat.lista.push(new Funchat({
	img: 'pouVadizoume.jpg',
	txt: 'Πού βαδίζουμε κύριοι!',
	ixos: 'pouVadizoume.mp3',
	entasi: 10,
}));

Funchat.lista.push(new Funchat({
	img: 'staExigoOrea.jpg',
	txt: 'Στα εξηγώ ωραία;',
	ixos: 'alefantos.mp3',
}));

Funchat.lista.push(new Funchat({
	img: 'pipaKaroto.gif',
	txt: 'Πω, πω, πω, τι τσιμπούσι ήταν αυτό!',
	ixos: 'tsibousiMale.mp3',
}));

Funchat.lista.push(new Funchat({
	img: 'tonIpiame.gif',
	txt: 'Πω, πω, πω, τι τσιμπούσι ήταν αυτό!',
	ixos: 'tsibousiFemale.mp3',
}));
