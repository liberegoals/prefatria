Radiofono = function(props) {
	Globals.initObject(this, props);
};

Radiofono.prototype.radiofonoIdGet = function() {
	return this.Id;
};

Radiofono.prototype.radiofonoPerigrafiGet = function() {
	return this.perigrafi;
};

Radiofono.prototype.radiofonoLinkGet = function() {
	return this.link;
};

Radiofono.prototype.radiofonoListaAppend = function() {
	var dom;

	Arena.radiaki.DOM.
	append(dom = $('<div>').addClass('radiofono').
	data('radiofono', this).
	text(this.radiofonoPerigrafiGet()));

	if (this.radiofonoIdGet() === Arena.radiaki.trexon)
	dom.addClass('radiofonoTrexon');

	return this;
};

Radiofono.prototype.radiofonoEpilogi = function() {
	Arena.radiaki.win = window.open(this.radiofonoLinkGet(), 'radiaki');
	Arena.radiaki.trexon = this.radiofonoIdGet();
	Arena.radiaki.DOM.css('display', 'none');

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.radiaki = {
	lista: [
		new Radiofono({
			id: 'active',
			perigrafi: 'Active Radio',
			link: 'http://www.e-radio.gr/Active-Radio-Internet-Radio-i48/live',
		}),

		new Radiofono({
			id: 'RSC',
			perigrafi: 'Radio Swiss Classic',
			link: 'http://www.radioswissclassic.ch/en/reception/internet',
		}),
	],

	trexon: null,
};

Arena.radiaki.setup = function() {
	var i, radiofono, dom;

	Client.ofelimoDOM.
	append(Arena.radiaki.DOM = $('<div>').attr('id', 'radiaki').
	on('click', '.radiofono', function(e) {
		var radiofono;

		Arena.inputRefocus(e);
		radiofono = $(this).data('radiofono');
		if (radiofono) {
			radiofono.radiofonoEpilogi();
			return;
		}

		if (Arena.radiaki.win)
		Arena.radiaki.win.close();

		delete Arena.radiaki.win;
	}));

	for (i = 0; i < Arena.radiaki.lista.length; i++) {
		radiofono = Arena.radiaki.lista[i];
		Arena.radiaki.DOM.
		append(dom = $('<div>').addClass('radiofono').
		data('radiofono', radiofono).
		text(radiofono.radiofonoPerigrafiGet()));

		if (i === Arena.radiaki.trexon)
		dom.addClass('radiofonoTrexon');
	}

	Arena.radiaki.DOM.
	append($('<div>').addClass('radiofono').
	html('Off'));

	return Arena;
};
