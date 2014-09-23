Minima = function(props) {
	Globals.initObject(this, props);
};

Minima.prototype.kodikosGet = function() {
	return this.kodikos;
};

Minima.prototype.poteGet = function() {
	return this.pote;
};

Minima.prototype.apostoleasGet = function() {
	return this.apostoleas;
};

Minima.prototype.paraliptisGet = function() {
	return this.paraliptis;
};

Minima.prototype.piosGet = function() {
	return(this.paraliptis != Client.session.pektis ?  this.paraliptis : this.apostoleas);
};

Minima.prototype.kimenoGet = function() {
	return this.kimeno;
};

Minima.prototype.kimenoGetHTML = function() {
	var kimeno = this.kimenoGet();
	return(kimeno ? kimeno.replace(/\r?\n/g, '<br />') : '');
};

Minima.prototype.poteGet = function() {
	return this.pote;
};

Minima.prototype.pushDOM = function() {
	var pios, kimeno;

	$('<tr>').addClass('minima').
	append($('<td>').addClass('minimaKodikos').text(this.kodikosGet())).
	append($('<td>').addClass('minimaImerominia').text(this.poteGet())).
	append($('<td>').addClass('minimaPios').
	append($('<div>').addClass('minimaPiosOnoma').text(this.piosGet())).
	append($('<img>').addClass('minimaIdosIcon').attr({
		src: 'asdasda',
		title: 'ddd',
	}))).
	append($('<td>').addClass('minimaKimeno').html(this.kimenoGetHTML())).
	prependTo(Minima.minimataDOM);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

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
	on('click', '.minima .minimaPios', function(e) {
// TODO
/*
		Minima.editFormaDOM.finish().fadeIn(100);
*/
	});

	Minima.zebraSetup();
	Minima.editFormaSetup();
};

Minima.editFormaSetup = function() {
	Minima.editFormaDOM = $('#minimaEditForma');
	Minima.editFormaKimenoDOM = $('#minimaEditFormaKimeno');
	Minima.editFormaPanelSetup();
	Minima.editFormaDOM.addClass('formaSoma').siromeno({
		position: 'fixed',
	}).
	append(Client.klisimo(function() {
		Minima.editFormaKlisimo();
	})).
	css('display', 'none');
};

Minima.editFormaPanelSetup = function() {
	Minima.editFormaParaliptisLoginDOM = $('#minimaEditFormaParaliptisLogin');
	$('#minimaEditFormaPanel').
	append($('<button>').addClass('formaButton').attr('type', 'submit').text('Αποστολή').
	on('click', function(e) {
		var paraliptis, kimeno;

		paraliptis = Minima.editFormaParaliptisLoginDOM.val().trim();
		if (!paraliptis) {
			Client.fyi.epano('Ακαθόριστος παραλήπτης');
			Client.sound.beep();
			return;
		}

		kimeno = Minima.editFormaKimenoDOM.val().trim();
		if (!kimeno) {
			Client.fyi.epano('Κενό μήνυμα');
			Client.sound.beep();
			return;
		}

		Client.fyi.pano('Αποστολή μηνύματος. Παρακαλώ περιμένετε…');
		Client.skiserService('minimaSend', 'pektis=' + paraliptis, 'kimeno=' + kimeno.uri()).
		done(function(rsp) {
			Client.fyi.pano();
			Minima.editFormaKlisimo();
			new Minima({
				kodikos: parseInt(rsp),
				apostoleas: Client.session.pektis,
				paraliptis: paraliptis,
				kimeno: kimeno,
				pote: Globals.tora(),
			}).pushDOM();
		}).
		fail(function(err) {
			Client.sound.beep();
			Client.skiserFail(err);
		});
	})).
	append($('<button>').addClass('formaButton').attr('type', 'button').text('Άκυρο').
	on('click', function(e) {
		Minima.editFormaKlisimo();
	}));
};

Minima.editFormaKlisimo = function() {
	Minima.editFormaDOM.finish().fadeOut(100);
};

Minima.zebraSetup = function() {
	var count = 0;

	Minima.minimataDOM.find('tr').each(function() {
		var i;

		i = count++ % 2;
		$(this).removeClass('minimaZebra0 minimaZebra1').addClass('minimaZebra' + i);
	});
};
