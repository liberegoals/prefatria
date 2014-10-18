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
			id: 'rebetiko',
			perigrafi: 'Akous.gr (ρεμπέτικο)',
			link: 'http://www.akous.gr/player/palko/',
		}),

		new Radiofono({
			id: 'erotokritos',
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

Arena.radiaki.panelAnikto = function() {
	if (!Arena.radiaki.DOM)
	return false;

	return(Arena.radiaki.DOM.css('display') !== 'none');
};

Arena.radiaki.panelKlisto = function() {
	if (!Arena.radiaki.DOM)
	return true;

	return(Arena.radiaki.DOM.css('display') === 'none');
};

Arena.radiaki.setup = function() {
	Client.ofelimoDOM.
	append(Arena.radiaki.DOM = $('<div>').attr('id', 'radiaki').
	siromeno({
		top: '104px',
		left: '624px',
	}).
	on('click', '.radiofono', function(e) {
		var radiofono;

		Arena.inputRefocus(e);
		$('.radiofonoTrexon').removeClass('radiofonoTrexon');

		radiofono = $(this).data('radiofono');
		if (radiofono) {
			radiofono.radiofonoEpilogi();
			return;
		}

		if (Arena.radiaki.win)
		Arena.radiaki.win.close();

		delete Arena.radiaki.win;

		Arena.cpanel.
		bpanelButtonGet('radiaki').
		pbuttonGetDOM('radiaki').
		trigger('click');
	}).append(Client.klisimo(function(e) {
		Arena.cpanel.
		bpanelButtonGet('radiaki').
		pbuttonGetDOM('radiaki').
		trigger('click');
	})));

	Globals.awalk(Arena.radiaki.lista, function(i, radiofono) {
		radiofono.radiofonoListaAppend();
	});

	Arena.radiaki.DOM.
	append($('<div>').addClass('radiofono radiofonoOff').
	html('&mdash;&nbsp;Off&nbsp;&mdash;'));

	return Arena;
};
