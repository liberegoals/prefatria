$(document).ready(function() {
	// Χρειαζόμαστε πρόσβαση στη βασική σελίδα του «Πρεφαδόρου», από
	// την οποία εκκίνησε το funchat. Σ' αυτή τη σελίδα υπάρχει global
	// μεταβλητή "Arena" και ουσιαστικά αυτήν χρειαζόμαστε.
	// Αν δεν υπάρχει γονική σελίδα, ή η μεταβλητή "Arena" δεν βρεθεί
	// στη γονική σελίδα, τότε θεωρούμε ότι το funchat έχει εκκινήσει
	// ανεξάρτητα σε δική του σελίδα.

	Arena = (window.opener && window.opener.Arena ? window.opener.Arena : null);

	Funchat.ofelimoDOM = $('#ofelimo');
	Funchat.listaArrayWalk(function() {
		this.funchatCreateDOM();
	});

	return;
	setInterval(function() {
		var count;

		count = 0;
		for (i in $.cache)
		count++;

		console.log('jQuery cache size: ' + count);
	}, 10000);
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
return;
	Client.ajaxService('asdasda').
	done(function(rsp) {
		Client.fyi.pano(rsp);
	}).
	fail(function(err) {
		Client.fyi.epano('asdasd');
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Funchat.prototype.funchatCreateDOM = function() {
	var kimeno, ixos;

	if (this.hasOwnProperty('dom'))
	return this;

	this.dom = $('<div>').addClass('funchatItem').appendTo(Funchat.ofelimoDOM).
	data('item', this).
	on('click', function(e) {
		var item, id, sxolio;

		e.stopPropagation();

		if (Funchat.oxiArena())
		return;

		if (Arena.ego.oxiPektis())
		return;

		item = $(this).data('item');
		if (!item) return;

		id = item.funchatIdGet();
		if (!id) return;

		sxolio = 'FC^' + id;
		self.opener.Client.skiserService('sizitisiPartida', 'sxolio=' + sxolio.uri());
		Arena.inputRefocus();
	});

	kimeno = this.funchatKimenoGet();
	if (kimeno) this.dom.attr('title', kimeno);

	if (this.hasOwnProperty('img'))
	$('<img>').addClass('funchatIkona').attr('src', Funchat.server + this.img).appendTo(this.dom);

	ixos = this.funchatIxosGet();
	if (!ixos) return this;

	$('<img>').addClass('funchatIxosIcon').attr({
		src: '../ikona/panel/entasi.png',
		title: 'Δοκιμή ηχητικού εφέ',
	}).
	on('click', function(e) {
		var item, pezi, sigasiIcon;

		e.stopPropagation();

		item = $(this).parent().data('item');
		if (!item) return;

		pezi = item.funchatIxosPeziGet();
		if (pezi) {
			item.funchatIxosPeziDelete(pezi);
			$(this).attr({
				src: '../ikona/panel/entasi.png',
				title: 'Δοκιμή ηχητικού εφέ',
			});

			return;
		}

		$(this).attr({
			src: '../ikona/panel/sigasi.png',
			title: 'Σίγαση δοκιμής ηχητικού εφέ',
		});

		sigasiIcon = $(this);
		pezi = item.funchatIxosPlay({
			callback: function() {
				sigasiIcon.trigger('click');
			},
		});
		item.funchatIxosPeziSet(pezi);
	}).
	appendTo(this.dom);

	return this;
};

Funchat.prototype.funchatIxosPeziSet = function(pezi) {
	this.ixosPezi = pezi;
	return this;
};

Funchat.prototype.funchatIxosPeziGet = function() {
	return this.ixosPezi;
};

Funchat.prototype.funchatIxosPeziDelete = function(pezi) {
	var dom;

	if (pezi === undefined)
	pezi = this.funchatIxosPeziGet();

	delete this.ixosPezi;
	if (!pezi) return this;

	dom = pezi.get(0);
	if (dom) dom.pause();
	pezi.remove();

	return this;
};
