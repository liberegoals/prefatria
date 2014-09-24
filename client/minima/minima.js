$(document).ready(function() {
	Client.tabPektis();
	Client.tabKlisimo($('#toolbarRight'));

	Minima.setupMinimata();

	Arena = null;
	if (!self.opener) return;
	Arena = self.opener.Arena;
	if (!Arena) return;

	// TODO
	return;

	Client.tab($('<a>').attr({href: '#'}).on('click', function(e) {
		try {
			setTimeout(function() {
				Arena.inputRefocus();
			}, 100);
		} catch (e) {
			self.close();
		}
		return false;
	}).append(Client.sinefo('Επιστροφή')), $('#toolbarLeft'));
});

Minima.unload = function() {
	if (!Arena) return;
	if (!Arena.minima) return;
	if (!Arena.minima.win) return;

	Arena.minima.win.close();
	Arena.minima.win = null;
};

$(window).
on('beforeunload', function() {
	Minima.unload();
}).
on('unload', function() {
	Minima.unload();
}).
on('focus', function() {
	setTimeout(function() {
		if (Arena) Arena.inputRefocus();
	}, 100);
});

Minima.setupMinimata = function() {
	Minima.minimataDOM = $('#minimata');

	Minima.minimataDOM.

	// Τοποθετώντας τον δείκτη του ποντικιού στον χώρο κάποιου μηνύματος
	// φροντίζουμε να κάνουμε εμφανέστερο το μήνυμα και να το εφοπλίσουμε
	// με το πάνελ διαχείρισης μηνυμάτων.

	on('mouseenter', '.minima', function(e) {
		var minimaDOM, kodikos, minima, panelDOM, apostoleas, katastasi;

		minimaDOM = $(this);
		kodikos = minimaDOM.data('minima');
		minima = Minima.lista[kodikos];
		if (!minima) return;

		// Καθιστούμε το μήνυμα εμφανές.

		minimaDOM.addClass('minimaTrexon');

		// Εφοπλίζουμε το πάνελ διαχείρισης μηνυμάτων ανάλογα με τα
		// χαρακτηριστικά του μηνύματος.

		panelDOM = minimaDOM.children('.minimaPanel');
		panelDOM.empty().

		// Η διαγραφή μηνύματος είναι πάντοτε μια διαθέσιμη επιλογή.

		append($('<div>').addClass('minimaPanelButton').
		append($('<img>').addClass('minimaPanelIcon').attr({
			src: '../ikona/minima/diagrafi.png',
			title: 'Διαγραφή μηνύματος',
		}).
		on('click', function(e) {
			Client.fyi.pano('Διαγραφή μηνύματος. Παρακαλώ περιμένετε…');
			Client.skiserService('minimaDelete', 'minima=' + kodikos).
			done(function(rsp) {
				Client.fyi.pano(rsp);
				Client.sound.skisimo();
				minimaDOM.addClass('minimaDiagrafi').
				fadeOut(function() {
					$(this).remove();
					Minima.zebraSetup();
				});
			}).
			fail(function(err) {
				Client.sound.beep();
				Client.skiserFail(err);
			});
		})));

		apostoleas = minima.minimaApostoleasGet();
		if (apostoleas.isEgo()) return;

		katastasi = minima.minimaStatusGet();

		if ((katastasi !== 'ΔΙΑΒΑΣΜΕΝΟ') && (katastasi !== 'ΚΡΑΤΗΜΕΝΟ'))
		panelDOM.append($('<div>').addClass('minimaPanelButton').
		append($('<img>').addClass('minimaPanelIcon').attr({
			src: '../ikona/minima/adiavasto.png',
			title: 'ΑΔΙΑΒΑΣΤΟ μήνυμα. Αλλαγή κατάστασης σε ΔΙΑΒΑΣΜΕΝΟ',
		}).
		on('click', function(e) {
			var katastasi = 'ΔΙΑΒΑΣΜΕΝΟ';

			Client.fyi.pano('Αλλαγή κατάστασης μηνύματος. Παρακαλώ περιμένετε…');
			Client.skiserService('minimaKatastasi', 'minima=' + kodikos, 'katastasi=' + katastasi).
			done(function(rsp) {
				Client.fyi.pano(rsp);
				Client.sound.tak();
				minima.minimaStatusSet(katastasi);
				minimaDOM.addClass('minimaDiavasmeno').trigger('mouseenter');
			}).
			fail(function(err) {
				Client.sound.beep();
				Client.skiserFail(err);
			});
		})));

		else
		panelDOM.append($('<div>').addClass('minimaPanelButton').
		append($('<img>').addClass('minimaPanelIcon').attr({
			src: '../ikona/minima/diavasmeno.png',
			title: 'Αλλαγή κατάστασης σε ΑΔΙΑΒΑΣΤΟ',
		}).
		on('click', function(e) {
			var katastasi = 'ΑΔΙΑΒΑΣΤΟ';

			Client.fyi.pano('Αλλαγή κατάστασης μηνύματος. Παρακαλώ περιμένετε…');
			Client.skiserService('minimaKatastasi', 'minima=' + kodikos, 'katastasi=' + katastasi).
			done(function(rsp) {
				Client.fyi.pano(rsp);
				Client.sound.tak();
				minima.minimaStatusSet(katastasi);
				minimaDOM.removeClass('minimaDiavasmeno').trigger('mouseenter');
			}).
			fail(function(err) {
				Client.sound.beep();
				Client.skiserFail(err);
			});
		})));

		if (katastasi !== 'ΚΡΑΤΗΜΕΝΟ')
		panelDOM.append($('<div>').addClass('minimaPanelButton').
		append($('<img>').addClass('minimaPanelIcon').attr({
			src: '../ikona/minima/kratimeno.png',
			title: 'Αρχειοθέτηση μηνύματος',
		}).
		on('click', function(e) {
			var katastasi = 'ΚΡΑΤΗΜΕΝΟ';

			Client.fyi.pano('Αρχειοθέτηση μηνύματος. Παρακαλώ περιμένετε…');
			Client.skiserService('minimaKatastasi', 'minima=' + kodikos, 'katastasi=' + katastasi).
			done(function(rsp) {
				Client.fyi.pano(rsp);
				Client.sound.tak();
				minima.minimaStatusSet(katastasi);
				minimaDOM.addClass('minimaDiavasmeno').trigger('mouseenter');
			}).
			fail(function(err) {
				Client.sound.beep();
				Client.skiserFail(err);
			});
		})));
	}).

	on('mouseleave', '.minima', function(e) {
		var minimaDOM, panelDOM;

		minimaDOM = $(this);
		minimaDOM.removeClass('minimaTrexon');
		minimaDOM.children('.minimaPios').removeAttr('title');

		panelDOM = minimaDOM.children('.minimaPanel');
		panelDOM.empty();
	}).

	// Κάνοντας κλικ στην περιοχή ημερομηνίας και αποστολέα/παραλήπτη,
	// εκκινούμε διαδικασία σύνθεσης μηνύματος απάντησης.

	on('click', '.minimaPios,.minimaPote', function(e) {
		Minima.editFormaParaliptisLoginDOM.
		val($(this).parent().children('.minimaPios').text().trim());
		Minima.editFormaDOM.finish().fadeIn(100, function() {
			Minima.editFormaKimenoDOM.focus();
		});
	});

	Minima.zebraSetup();
	Minima.editFormaSetup();
	Client.skiserService("minimaFeredata").
	done(function(rsp) {
		try {
			eval('var mlist = [' + rsp + '];');
		} catch (e) {
			Client.sound.beep();
			Client.fyi.epano('Παρελήφθησαν ακαθόριστα δεδομένα');
			return;
		}

		Minima.lista = {};
		Globals.awalk(mlist, function(i, minima) {
			minima = new Minima(minima);
			minima.minimaPoteAdd(Client.timeDif);
			Minima.lista[minima.minimaKodikosGet()] = minima;
			minima.minimaPushDOM();
		});
	}).
	fail(function(err) {
		Client.skiserFail(err);
	});
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
			var kodikos;

			Client.fyi.pano();
			Minima.editFormaKlisimo();

			kodikos = parseInt(rsp);
			Minima.lista[kodikos] = new Minima({
				kodikos: kodikos,
				apostoleas: Client.session.pektis,
				paraliptis: paraliptis,
				kimeno: kimeno,
				pote: Globals.tora(),
				status: 'ΑΔΙΑΒΑΣΤΟ',
			}).minimaPushDOM();
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Minima.prototype.minimaPushDOM = function() {
	var kodikos, pios, pote, img;

	kodikos = this.minimaKodikosGet();
	pios = this.minimaIsIserxomeno() ? this.minimaApostoleasGet() : this.minimaParaliptisGet();
	pote = this.minimaPoteGet();

	this.DOM = $('<tr>').
	data('minima', kodikos).
	addClass('minima').
	append($('<td>').addClass('minimaKodikos').text(this.minimaKodikosGet())).
	append($('<td>').addClass('minimaPote').
	html(Globals.mera(pote) + '<br />' + Globals.ora(pote))).
	append($('<td>').addClass('minimaPios').
	append($('<div>').addClass('minimaPiosOnoma').text(pios)).
	append(img = $('<img>').addClass('minimaIdosIcon'))).
	append($('<td>').addClass('minimaPanel')).
	append($('<td>').addClass('minimaKimeno').html(this.minimaKimenoGetHTML())).
	css('display', 'none').
	fadeIn(500).
	prependTo(Minima.minimataDOM);

	if (this.minimaStatusGet() !== 'ΑΔΙΑΒΑΣΤΟ')
	this.DOM.addClass('minimaDiavasmeno');

	if (this.minimaIsIserxomeno()) img.attr({
		src: '../ikona/minima/iserxomeno.png',
		title: 'Εισερχόμενο',
	});
	else if (this.minimaIsExerxomeno()) img.attr({
		src: '../ikona/minima/exerxomeno.png',
		title: 'Εξερχόμενο',
	});
	else {
		this.DOM.addClass('minimaIkothen');
		img.attr({
			src: '../ikona/minima/ikothen.png',
			title: 'Οίκοθεν',
		});
	}

	Minima.zebraSetup();
	return this;
};

Minima.prototype.minimaGetDOM = function() {
	return this.DOM;
};

Minima.prototype.minimaEndixiNeo = function() {
	var dom;

	dom = this.minimaGetDOM();
	if (!dom) return this;

	if (dom.find('.minimaNeoIcon').length)
	return this;

	dom.children('.minimaPote').
	append($('<img>').attr('src', '../ikona/minima/neo.png').addClass('minimaNeoIcon'));
	return this;
};

Minima.prototype.minimaIsIserxomeno = function() {
	var apostoleas;

	apostoleas = this.minimaApostoleasGet();
	if (apostoleas === this.minimaParaliptisGet())
	return false;

	return(apostoleas !== Client.session.pektis);
};

Minima.prototype.minimaIsExerxomeno = function() {
	return(this.minimaParaliptisGet() !== Client.session.pektis);
};

Minima.prototype.minimaIsIkothen = function() {
	return(this.minimaApostoleasGet() === this.minimaParaliptisGet());
};
