$(document).ready(function() {
	Client.tabPektis();
	Client.tabKlisimo($('#toolbarRight'));

	Minima.setupControls();
	Minima.setupMinimata();

	Client.fyi.pano('Καλώς ήλθατε στο ταχυδρομείο του «Πρεφαδόρου»');

	Arena = null;
	if (!window.opener) return;
	Arena = window.opener.Arena;
	if (!Arena) return;

	// TODO
	return;

	Client.tab($('<a>').attr({href: '#'}).on('click', function(e) {
		try {
			setTimeout(function() {
				Arena.inputRefocus();
				window.opener.focus();
			}, 100);
		} catch (e) {
			window.close();
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

Minima.setupControls = function() {
	Minima.controlsDOM = $('#minimaControls');

	$('.minimaControlsGo').
	on('mouseenter', function(e) {
		$(this).children('.minimaControlsGoIcon').finish().fadeIn(100);
	}).
	on('mouseleave', function(e) {
		$(this).children('.minimaControlsGoIcon').finish().fadeOut();
	});

	$('.minimaControlsGoIcon').attr({
		src: '../ikona/misc/baresH.png',
		title: 'Κορυφή σελίδας',
	}).on('click', function(e) {
		e.stopPropagation();
		$(window.document).scrollTop(0);
	});

	$('#minimaNeoButton').on('click', function(e) {
		e.stopPropagation();
		Minima.editFormaParaliptisLoginDOM.val('');
		Minima.editFormaDOM.finish().fadeIn(100, function() {
			Minima.editFormaParaliptisLoginDOM.focus();
		});
	});

	Minima.ananeosiButtonDOM = $('#minimaAnaneosiButton').on('click', function(e) {
		e.stopPropagation();
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
			Minima.filtrarisma();
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	});

	$('.minimaCheckboxButton').
	on('mousedown', function(e) {
		e.stopPropagation();
		e.preventDefault();
	}).
	on('click', function(e) {
		e.stopPropagation();
		e.preventDefault();
		$(this).children('input').trigger('click');
	}).
	children('input').
	on('click', function(e) {
		e.stopPropagation();
	});

	Minima.buttonOlaDOM = $('#minimaOlaButton').
	on('click', function(e) {
		if ($(this).prop('checked')) {
			Minima.buttonIserxomenaDOM.prop('checked', true);
			Minima.buttonExerxomenaDOM.prop('checked', true);
			Minima.buttonIkothenDOM.prop('checked', true);
			Minima.buttonKratimenaDOM.prop('checked', true);
			Minima.buttonDiavasmenaDOM.prop('checked', true);
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		else {
			Minima.buttonIserxomenaDOM.prop('checked', true);
			Minima.buttonExerxomenaDOM.prop('checked', true);
			Minima.buttonIkothenDOM.prop('checked', false);
			Minima.buttonKratimenaDOM.prop('checked', false);
			Minima.buttonDiavasmenaDOM.prop('checked', false);
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonIserxomenaDOM = $('#minimaIserxomenaButton').
	prop('checked', true).
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonIserxomenaDOM.prop('checked', true);
			Minima.buttonExerxomenaDOM.prop('checked', false);
			Minima.buttonIkothenDOM.prop('checked', false);
			Minima.buttonKratimenaDOM.prop('checked', false);
			Minima.buttonDiavasmenaDOM.prop('checked', false);
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonExerxomenaDOM = $('#minimaExerxomenaButton').
	prop('checked', true).
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonIserxomenaDOM.prop('checked', false);
			Minima.buttonExerxomenaDOM.prop('checked', true);
			Minima.buttonIkothenDOM.prop('checked', false);
			Minima.buttonKratimenaDOM.prop('checked', false);
			Minima.buttonDiavasmenaDOM.prop('checked', false);
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonIkothenDOM = $('#minimaIkothenButton').
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonIserxomenaDOM.prop('checked', false);
			Minima.buttonExerxomenaDOM.prop('checked', false);
			Minima.buttonIkothenDOM.prop('checked', true);
			Minima.buttonKratimenaDOM.prop('checked', false);
			Minima.buttonDiavasmenaDOM.prop('checked', false);
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonKratimenaDOM = $('#minimaKratimenaButton').
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonIserxomenaDOM.prop('checked', false);
			Minima.buttonExerxomenaDOM.prop('checked', false);
			Minima.buttonIkothenDOM.prop('checked', false);
			Minima.buttonKratimenaDOM.prop('checked', true);
			Minima.buttonDiavasmenaDOM.prop('checked', true);
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonDiavasmenaDOM = $('#minimaDiavasmenaButton').
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonDiavasmenaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonAdiavastaDOM = $('#minimaAdiavastaButton').
	prop('checked', true).
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});
};

Minima.filtrarisma = function() {
	var count = 0;

	Minima.minimataDOM.find('.minima').each(function() {
		var minima;

		$(this).css('display', 'none');
		minima = Minima.lista[$(this).data('minima')];
		if (!minima) return;

		if (minima.filtroCheck())
		$(this).removeClass('minimaZebra0 minimaZebra1').
		addClass('minimaZebra' + (count++ % 2)).
		css('display', 'table-row');
	});
};

Minima.prototype.filtroCheck = function() {
	if (Minima.buttonOlaDOM.prop('checked'))
	return true;

	if (Minima.buttonIkothenDOM.prop('checked'))
	return this.minimaIsIkothen();

	if (Minima.buttonKratimenaDOM.prop('checked'))
	return this.minimaIsKratimeno();

	if ((!Minima.buttonDiavasmenaDOM.prop('checked')) && this.minimaIsDiavasmeno())
	return false;

	if ((!Minima.buttonAdiavastaDOM.prop('checked')) && this.minimaIsAdiavasto())
	return false;

	if (this.minimaIsIkothen())
	return false;

	if ((!Minima.buttonIserxomenaDOM.prop('checked')) && this.minimaIsIserxomeno())
	return false;

	if ((!Minima.buttonExerxomenaDOM.prop('checked')) && this.minimaIsExerxomeno())
	return false;

	return true;
};

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

		paraliptis = minima.minimaParaliptisGet();
		if (paraliptis.oxiEgo()) return;

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

	Minima.editFormaSetup();
	Minima.ananeosiButtonDOM.trigger('click');
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

		Minima.editFormaParaliptisLoginDOM.focus();
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
			}).minimaPushDOM(true);
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

	Minima.minimataDOM.find('minima').each(function() {
		var i;

		if ($(this).css('display') === 'none')
		return;

		$(this).removeClass('minimaZebra0 minimaZebra1').addClass('minimaZebra' + (count++ % 2));
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Minima.prototype.minimaPushDOM = function(online) {
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
	prependTo(Minima.minimataDOM);

	if (online)
	this.DOM.fadeIn(500);

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

Minima.prototype.minimaOxiIserxomeno = function() {
	return !this.minimaIsIserxomeno();
};

Minima.prototype.minimaIsExerxomeno = function() {
	return(this.minimaParaliptisGet() !== Client.session.pektis);
};

Minima.prototype.minimaOxiExerxomeno = function() {
	return !this.minimaIsExerxomeno();
};
