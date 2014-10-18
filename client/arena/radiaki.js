Radiofono = function(props) {
	Globals.initObject(this, props);
};

Radiofono.prototype.radiofonoIdGet = function() {
	return this.id;
};

Radiofono.prototype.radiofonoPerigrafiGet = function() {
	return this.perigrafi;
};

Radiofono.prototype.radiofonoLinkGet = function() {
	return this.link;
};

Radiofono.prototype.radiofonoListaAppend = function() {
	if (this.DOM)
	this.DOM.remove();

	Arena.radiaki.DOM.
	append(this.DOM = $('<div>').addClass('radiofono').
	data('radiofono', this).
	text(this.radiofonoPerigrafiGet()));

	return this;
};

Radiofono.prototype.radiofonoEpilogi = function() {
	this.DOM.addClass('radiofonoTrexon');
	Arena.radiaki.win = window.open(this.radiofonoLinkGet(), 'radiaki');

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
			iid: 'erotokritos',
			perigrafi: 'Ερωτόκριτος FM 87.9',
			link: 'http://www.easyradio.gr/erotokritos',
		}),

		new Radiofono({
			id: 'MMJazz',
			perigrafi: 'Modern Mainstream (Jazz)',
			link: 'http://player.slipstreamradio.com/player/slipstream/' +
				'accujazz/?channel=Channel9&sub=SubModernJazz',
		}),

		new Radiofono({
			id: 'SAJazz',
			perigrafi: 'Straight Ahead (Jazz)',
			link: 'http://player.slipstreamradio.com/player/slipstream/' +
				'accujazz/?channel=Channel9&sub=SubStraightAhead',
		}),

		new Radiofono({
			id: 'RSC',
			perigrafi: 'Radio Swiss Classic',
			link: 'http://webplayer.radioswissclassic.ch',
		}),
	],

	trexon: null,
};

Arena.radiaki.setup = function() {
	var i;

	Client.ofelimoDOM.
	append(Arena.radiaki.DOM = $('<div>').attr('id', 'radiaki').
	on('click', '.radiofono', function(e) {
		var radiofono;

		Arena.inputRefocus(e);
		Arena.radiaki.DOM.css('display', 'none');
		$('.radiofonoTrexon').removeClass('radiofonoTrexon');

		radiofono = $(this).data('radiofono');
		if (radiofono) {
			radiofono.radiofonoEpilogi();
			return;
		}

		if (Arena.radiaki.win)
		Arena.radiaki.win.close();

		delete Arena.radiaki.win;
	}));

	Globals.awalk(Arena.radiaki.lista, function(i, radiofono) {
		radiofono.radiofonoListaAppend();
	});

	Arena.radiaki.DOM.
	append($('<div>').addClass('radiofono radiofonoOff').
	html('&mdash;&nbsp;Off&nbsp;&mdash;'));

	return Arena;
};
