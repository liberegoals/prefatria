Minima = {};

$(document).ready(function() {
	Minima.setupMinimata();
});

Minima.setupMinimata = function() {
	Client.tabPektis();
	Client.tabKlisimo($('#toolbarRight'));

	Minima.minimataDOM = $('#minimata');

	Minima.minimataDOM.find('td.minimaPanel').
	append($('<div>').addClass('minimaPanelButton').
	append($('<img>').addClass('minimaPanelIcon').attr({
		src: '../ikona/minima/diagrafi.png',
		title: 'Διαγραφή μηνύματος',
	}).
	on('click', function(e) {
		var minimaDOM, kodikos;

		minimaDOM = $(this).parents('.minima');
		kodikos = minimaDOM.find('.minimaKodikos').text();
		if (!kodikos) return;

		Client.fyi.pano('Διαγραφή μηνύματος. Παρακαλώ περιμένετε…');
		Client.skiserService('minimaDelete', 'minima=' + kodikos).
		done(function(rsp) {
			Client.fyi.pano(rsp);
			Client.sound.skisimo();
			minimaDOM.addClass('minimaDiagrafi').
			fadeOut(function() {
				$(this).remove();
			});
		}).
		fail(function(err) {
			Client.sound.beep();
			Client.skiserFail(err);
		});
	}))).
	append($('<div>').addClass('minimaPanelButton').
	append($('<img>').addClass('minimaPanelIcon').attr({
		src: '../ikona/minima/diavasmeno.png',
	}).
	on('click', function(e) {
		var minimaDOM, kodikos;

		minimaDOM = $(this).parents('.minima');
		kodikos = minimaDOM.find('.minimaKodikos').text();
		if (!kodikos) return;

		Client.fyi.pano('Αλλαγή κατάστασης μηνύματος. Παρακαλώ περιμένετε…');
		Client.skiserService('minimaDiavasma', 'minima=' + kodikos).
		done(function(rsp) {
			Client.fyi.pano(rsp);
			Client.sound.tak();
			if (rsp === 'ΔΙΑΒΑΣΜΕΝΟ')
			minimaDOM.addClass('minimaDiavasmeno').removeClass('minimaTrexon');

			else
			minimaDOM.addClass('minimaTrexon').removeClass('minimaDiavasmeno');
		}).
		fail(function(err) {
			Client.sound.beep();
			Client.skiserFail(err);
		});
	}))).
	append($('<div>').addClass('minimaPanelButton').
	append($('<img>').addClass('minimaPanelIcon').attr({
		src: '../ikona/minima/kratimeno.png',
	})));

	Minima.minimataDOM.
	on('mouseenter', '.minima', function(e) {
		$(this).addClass('minimaTrexon');
		$(this).children('.minimaPios').attr('title', 'Απάντηση');
		$(this).children('.minimaPanel').finish().fadeTo(100, 1);
	}).
	on('mouseleave', '.minima', function(e) {
		$(this).removeClass('minimaTrexon');
		$(this).children('.minimaPios').removeAttr('title');
		$(this).children('.minimaPanel').finish().fadeTo(100, 0);
	}).
	on('click', '.minima', function(e) {
		//Minima.editFormaDOM.finish().fadeIn(100);
	});

	Minima.zebraSetup();
	Minima.editFormaSetup();
};

Minima.editFormaSetup = function() {
	Minima.editFormaDOM = $('#minimaEditForma');
	Minima.editFormaDOM.addClass('formaSoma').siromeno({
		position: 'fixed',
	}).
	append(Client.klisimo(function() {
		Minima.editFormaDOM.finish().fadeOut(100);
	})).
	css('display', 'none');
};

Minima.zebraSetup = function() {
	var count = 0;

	Minima.minimataDOM.find('tr').each(function() {
		var i;

		i = count++ % 2;
		$(this).removeClass('minimaZebra0 minimaZebra1').addClass('minimaZebra' + i);
	});
};
