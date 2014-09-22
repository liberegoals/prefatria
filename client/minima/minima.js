Minima = {};

$(document).ready(function() {
	Minima.setupMinimata();
});

Minima.setupMinimata = function() {
	Client.tabPektis();
	Client.tabKlisimo($('#toolbarRight'));

	Minima.minimataDOM = $('#minimata');
	Minima.editFormaDOM = $('#minimaEditForma');
	Minima.editFormaDOM.siromeno();

	Minima.minimataDOM.find('td.minimaPanel').
	append($('<div>').addClass('minimaPanelButton').
	append($('<img>').addClass('minimaPanelIcon').attr({
		src: '../ikona/minima/diagrafi.png',
		title: 'Διαγραφή μηνύματος',
	}))).
	append($('<div>').addClass('minimaPanelButton').
	append($('<img>').addClass('minimaPanelIcon').attr({
		src: '../ikona/minima/diavasmeno.png',
	}))).
	append($('<div>').addClass('minimaPanelButton').
	append($('<img>').addClass('minimaPanelIcon').attr({
		src: '../ikona/minima/kratimeno.png',
	})));

	Minima.minimataDOM.
	on('mouseenter', '.minima', function(e) {
		$(this).addClass('minimaTrexon').
		children('.minimaPios').attr('title', 'Απάντηση');
	}).
	on('mouseleave', '.minima', function(e) {
		$(this).removeClass('minimaTrexon').
		children('.minimaPios').removeAttr('title');
	}).
	on('click', '.minima', function(e) {
		//Minima.editFormaDOM.finish().fadeIn(100);
	});

	Minima.zebraSetup();
};

Minima.zebraSetup = function() {
	var count = 0;

	Minima.minimataDOM.find('tr').each(function() {
		var i;

		i = count++ % 2;
		$(this).removeClass('minimaZebra0 minimaZebra1').addClass('minimaZebra' + i);
	});
};
