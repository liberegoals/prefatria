$(document).ready(function() {
	var i;

	Arena = (window.opener && window.opener.Arena ? window.opener.Arena : null);
	Client.bodyDOM.css({
		backgroundImage: "url('../ikona/paraskinio/kitapi.jpg')",
	});
return;

	Prefadoros.thesiWalk(function(thesi) {
		var perioxiDom, onomaDom, daravaeriDom, kasaDom, kl, kr, dom, h;

		perioxiDom = $('#kitapiPerioxi' + thesi);
		Kitapi['perioxi' + thesi + 'DOM'] = perioxiDom;

		dataDom = $('<div>').addClass('kitapiPektisData').
		append(onomaDom = $('<div>').addClass('kitapiPektisOnoma').
		text('θέση ' + thesi));
		Kitapi['onoma' + thesi + 'DOM'] = onomaDom;

		if (thesi === 3) {
			kl = '31';
			kr = '32';
		}
		else if (thesi === 2) {
			kl = '23';
			kr = '21';
		}
		else {
			kl = '13';
			kr = '12';
		}

		daraveriDom = $('<table>').css('width', '100%').
		append($('<td>').attr('id', 'kitapiDaraveri' + kl).addClass('kitapiDaraveri').
		append($('<div>').addClass('kitapiStili').text(thesi + 'L'))).
		append(kasaDom = $('<td>').css({
			textAlign: 'center',
		})).
		append($('<td>').attr('id', 'kitapiDaraveri' + kr).addClass('kitapiDaraveri').
		append($('<div>').addClass('kitapiStili').text(thesi + 'R')));

		if (thesi === 1) {
			kasaDom.
			append(dataDom);
		}
		else {
			perioxiDom.append(dataDom);
		}

		dom = $('<div>').
		addClass('kitapiStili kitapiStiliKasa').
		appendTo(kasaDom);

		if (thesi !== 1) {
			h = perioxiDom.outerHeight();
			h -= dataDom.outerHeight();
			dom.css('height', h + 'px');
		}

		Kitapi['kasa' + thesi + 'DOM'] = dom;
		perioxiDom.append(daraveriDom);
	});

	// Εισάγουμε μέγιστο πλήθος εγγραφών κάσας για τον Νότο, ώστε να
	// διορθωθούν οι διαστάσεις του παραθύρου και να αποφύγουμε κατά
	// το δυνατόν τα scrollbars.

	for (i = 0; i < 10; i++) {
		Kitapi.kasaPush(1, 0, false);
	}
	Kitapi.resize(true);
	kasaStiliDom = Kitapi.kasa1DOM.empty();
Kitapi.testData();
});

Kitapi = {};

Kitapi.unload = function() {
	if (Kitapi.unloaded) return;
	Kitapi.unloaded = true;
	if (Arena) Arena.kitapi.klisimo();
}

$(window).on('beforeunload', function() {
	Kitapi.unload();
});

$(window).on('unload', function() {
	Kitapi.unload();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kitapi.kasaMax32 = 14;

Kitapi.kasaPush = function(thesi, kasa, resize) {
	var kasaStiliDom, count, stiles, xorane, platos;

	kasaStiliDom = Kitapi['kasa' + thesi + 'DOM'];
	count = kasaStiliDom.children('.kitapiKasa').length + 1;

	xorane = (thesi === 1 ? 10 : Kitapi.kasaMax32);
	stiles = Math.floor(count / xorane);
	if ((stiles * xorane) < count) stiles++;
	platos = (40 * stiles) + 'px';
	stiles += '';

	kasaStiliDom.css({
		width: platos,
		'column-count': stiles,
		'-moz-column-count': stiles,
		'-webkit-column-count': stiles,
	}).append($('<div>').addClass('kitapiKasa kitapiKasaDiagrafi').text(kasa));

	if (resize === undefined) resize = true;
	if (resize) Kitapi.resize();
};

Kitapi.resize = function(max32) {
	var dh, dw;

	dh = ($(document.body).height() - $(window).outerHeight()) || $(document).height() - $(window).height();
	if (dh <= 0) return;
	if (dh > 200) return;

	dw = parseInt(dh * 0.86);
	window.resizeBy(dw, dh);
	if (!Arena) return;

	Arena.kitapi.position.width += dw;
	Arena.kitapi.position.height += dh;
	if (max32) Kitapi.kasaMax32 = 13;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kitapi.testData = function() {
	var aa, timer;

	aa = 0;
	timer = setInterval(function() {
		var thesi, kasa;

		thesi = Globals.random(1, 3);
		kasa = Globals.random(1, 150);
		Kitapi.kasaPush(thesi, kasa);
		if (aa++ > 150) clearInterval(timer);
	}, Globals.random(100, 100));
};
