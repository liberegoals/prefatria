///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
//
// Κατά τη φάση της πλειοδοσίας για την αγορά ισχύουν τα εξής:
//
// Ο παίκτης που έχει σειρά να μιλήσει βλέπει πάνελ δηλώσεων με τις δηλώσεις
// που έχουν σειρά να δηλωθούν.

Trapezi.prototype.efoplismosΔΗΛΩΣΗ = function() {
	var basi, thesi, klikDilosi = false;

	thesi = this.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck') && (Kafenio.egoThesiGet() !== thesi)) return this;

	Arena.partida.dilosiPanelDOM.empty().
	append(basi = $('<div>').attr('id', 'tsoxaDilosiPanelBasi'));

	if (this.anext && (this.apasoCount < 2))
	basi.append($('<div>').addClass('tsoxaButton').data('dilosi', this.anext));
	if (!this.alast) basi.append($('<div>').addClass('tsoxaButton').data('dilosi', new Dilosi('DS6')));
	basi.append($('<div>').addClass('tsoxaButton').data('dilosi', new Dilosi('DPS')));

	basi.find('.tsoxaButton').each(function() {
		$(this).append($(this).data('dilosi').dilosiDOM());
	});

	Arena.partida.xipnitiriOplismos();
	Arena.partida.dilosiPanelDOM.find('.tsoxaButton').addClass('tsoxaDilosiButton').
	off('mouseenter').on('mouseenter', function(e) {
		e.stopPropagation();
		if (klikDilosi) return;

		$(this).addClass('tsoxaButtonOplismeno');
	}).
	off('mouseleave').on('mouseleave', function(e) {
		e.stopPropagation();
		if (klikDilosi) return;

		$(this).removeClass('tsoxaButtonOplismeno');
	}).
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	off('click').on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.partida.xipnitiriAfoplismos();
		if (Arena.partida.akirosiKiniseon()) return;
		if (klikDilosi) return;

		klikDilosi = true;
		Arena.partida.enimerosiDOM.css('display', 'none');
		Client.skiserService('dilosi',
			'thesi=' + thesi,
			'dilosi=' + $(this).data('dilosi').dilosi2string()).
		fail(function(err) {
			Client.skiserFail(err);
			Arena.partida.enimerosiDOM.css('display', 'block');
			klikDilosi = false;
		});
	});

	Arena.partida.dilosiPanelDOM.css('display', 'block');
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
//
// Κατά τη φάση της αλλαγής φύλλων από τον τζογαδόρο ισχύουν τα εξής:
//
// Ο τζογαδόρος έχει παραλάβει τα φύλλα του τζόγου και έχει μπροστά του 12 φύλλα.
// Από αυτά πρέπει να επιλέξει τα δύο σκάρτα και να δηλώσει την τελική αγορά του.
// Κατ' εξαίρεσιν μπορεί να τα «γράψει σόλο» στην ελάχιστη δυνατή αγορά, εφόσον
// κρίνει ότι δεν αξίζει τον κόπο να παιχτεί η οποιαδήποτε αγορά. Επίσης, μπορεί
// να επιλέξει τους άσους στην αγορά, εφόσον, φυσικά, τους έχει.
//
// Τα παραπάνω λειτουργούν ως εξής:
//
// Ο τζογαδόρος επιλέγει την τελική αγορά του από το πάνελ το οποίο ονομάζουμε
// «πάνελ των αγορών». Αυτό το πάνελ εμφανίζεται μόνον όταν ο τζογαδόρος έχει ήδη
// επιλέξει ακριβώς δύο φύλλα για αλλαγή (σκάρτα). Στο πάνελ των αγορών ο τζογαδόρος
// μπορεί να επιλέξει μόνον αγορές που είναι τουλάχιστον της δυναμικότητας της
// τελευταίας του δήλωσης κατά τη φάση της πλειοδοσίας της αγοράς.
//
// Η επιλογή «ΣΟΛΟ» είναι επιλέξιμη σε οποιαδήποτε φάση της διαδικασίας, όπως και
// οι άσοι.
//
// Πριν την τελική αποφώνηση της αγοράς γίνεται έλεγχος και τελική ερώτηση στον
// τζογαδόρο.

Trapezi.prototype.efoplismosΑΛΛΑΓΗ = function() {
	if (Debug.flagGet('epomenosCheck') && (Kafenio.egoThesiGet() != this.partidaEpomenosGet())) return this;

	Trapezi.
	efoplismosAlagiPanel(this).
	efoplismosAlagiPanelArmatoma(this).
	efoplismosAlagiXartosia(this);
	Arena.partida.agoraPanelDOM.css('display', 'block');
	return this;
};

// Η function "efoplismosAlagiPanel" δημιουργεί το πάνελ των αγορών. Το πάνελ περιλαμβάνει
// πλήκτρα για όλες τις επιτρεπτές αγορές, πλήκτρο για σολαρία και πλήκτρο για τη δήλωση
// των άσων (εφόσον υπάρχουν άσοι). Οι αγορές παραμένουν αόρατες όσο ο τζογαδόρος δεν έχει
// επιλέξει ακριβώς δύο φύλλα προς αλλαγή (σκάρτα).

Trapezi.efoplismosAlagiPanel = function(trapezi) {
	var minAgora, minXroma, minBazes, bazes, xroma = [ 'S', 'C', 'D', 'H', 'N' ], i, dilosi,
		panelDom = Arena.partida.agoraPanelDOM, domGrami, domButton;

	minAgora = trapezi.alast.dilosiIsTagrafo() ? new Dilosi('DS6') : new Dilosi(trapezi.alast).dilosiExoSet(false);
	minXroma = Prefadoros.xromaAxia[minAgora.dilosiXromaGet()];
	minBazes = minAgora.dilosiBazesGet();

	panelDom.removeData().empty();
	for (bazes = 6; bazes <= 10; bazes++) {
		panelDom.append(domGrami = $('<div>').addClass('tsoxaAgoraGrami'));
		for (i = 0; i < xroma.length; i++) {
			dilosi = new Dilosi().dilosiXromaSet(xroma[i]).dilosiBazesSet(bazes);
			domGrami.append(domButton = $('<div>').addClass('tsoxaButton').
			data('dilosi', dilosi).append(dilosi.dilosiDOM('Agora')));

			if (bazes < minBazes) continue;
			if ((bazes == minBazes) && (Prefadoros.xromaAxia[xroma[i]] < minXroma)) continue;
			domButton.addClass('tsoxaAgoraButtonEpitrepto');
		}
		domButton.addClass('tsoxaAgoraButtonAxroa');
	}

	Trapezi.
	efoplismosAlagiPanelSolo(panelDom, minAgora).
	efoplismosAlagiPanelAsoi(trapezi, panelDom);

	return Trapezi;
}

// Η function "efoplismosAlagiPanelSolo" δημιουργεί το πλήκτρο της σολαρίας με το
// οποίο ο τζογαδόρος επιλέγει να γράψει σόλο την ελάχιστη δυνατή αγορά.

Trapezi.efoplismosAlagiPanelSolo = function(panelDom, minAgora) {
	panelDom.append($('<div>').addClass('tsoxaButton tsoxaAgoraButtonEpitrepto').
	attr('id', 'tsoxaAgoraButtonSolo').data('dilosi', new Dilosi(minAgora).dilosiSoloSet()).
	append($('<div>').attr({
		id: 'tsoxaAgoraDilosiSolo',
		title: 'Βάλτε σόλο μέσα την ελάχιστη δυνατή αγορά',
	}).text('ΣΟΛΟ')));

	return Trapezi;
};

// Η function "efoplismosAlagiPanelAsoi" δημιουργεί το πλήκτρο δήλωσης/απόκρυψης των
// άσων -εφόσον υπάρχουν οι τέσσερις άσοι στα φύλλα του τζογαδόρου και εφόσον στο
// τραπέζι παίζονται οι άσοι.

Trapezi.efoplismosAlagiPanelAsoi = function(trapezi, panelDom) {
	var asoi, asoiDir = 'ikona/panel/';

	if (trapezi.trapeziOxiAsoi()) return Trapezi;

	asoi = 0;
	trapezi.fila[trapezi.partidaTzogadorosGet()].xartosiaWalk(function(i, filo) {
		if (filo.filoAxiaGet() === 'A') asoi++;
	});
	//if (asoi < 4) return Trapezi;

	panelDom.data('asoi', true).append($('<img>').attr({
		id: 'tsoxaAgoraAsoiIcon',
		src: asoiDir + 'asoiOn.png',
		title: 'Δηλώστε/αποκρύψτε τους άσους',
	}).
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	on('click', function(e) {
		var dialogos;

		Arena.inputRefocus(e);
		if (Arena.partida.akirosiKiniseon()) return;

		if (panelDom.data('asoi')) {
			panelDom.data('asoi', false);
			$(this).attr('src', asoiDir + 'asoiOff.png');
		}
		else {
			panelDom.data('asoi', true);
			$(this).attr('src', asoiDir + 'asoiOn.png');
		}

		// Στο tag "dialogos" του πάνελ των αγορών έχουμε κρατήσει το πλήκτρο
		// που ενεργοποίησε τον διάλογο επιβεβεβαίωσης της αγοράς, οπότε μετά
		// από αλλαγή στο καθεστώς των άσων ξανακάνουμε κλικ στην ίδια αγορά.

		dialogos = panelDom.data('dialogos');
		if (dialogos) dialogos.trigger('click');
	}));

	return Trapezi;
};

// Η function "efoplismosAlagiPanelArmatoma" εξοπλίζει όλα τα πλήκτρα επιτρεπτών αγορών,
// συμπεριλαμβανομένης και της σολαρίας, με διαδικασία επιλογής αγοράς. Η διαδικασία
// επιλογής αγοράς μας περνάει σε παράθυρο διαλόγου όπου προτείνεται η αγορά και
// ο τζογαδόρος επιλέγει αν θα τη δημοσιοποιήσει ή όχι.

Trapezi.efoplismosAlagiPanelArmatoma = function(trapezi) {
	var panelDom = Arena.partida.agoraPanelDOM;

	panelDom.find('.tsoxaButton').addClass('tsoxaAgoraButton');
	panelDom.find('.tsoxaAgoraButtonEpitrepto').
	off('mouseenter').on('mouseenter', function(e) {
		e.stopPropagation();
		$(this).addClass('tsoxaButtonOplismeno');
	}).
	off('mouseleave').on('mouseleave', function(e) {
		e.stopPropagation();
		$(this).removeClass('tsoxaButtonOplismeno');
	}).
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	off('click').on('click', function(e) {
		Arena.inputRefocus(e);
		if (Arena.partida.akirosiKiniseon()) return;
		Trapezi.efoplismosAlagiPanelEpilogiAgoras(trapezi, $(this));
	});

	return Trapezi;
};

// Η function "efoplismosAlagiPanelEplilogiAgoras" παρουσιάζει παράθυρο διαλόγου στο
// οποίο προτείνεται η αγορά και ο τζογαδόρος έχει τη δυνατότητα να τη δημοσιοποιήσει
// ή όχι. Όσο το παράθυρο επιβεβαίωσης της αγοράς είναι ανοικτό, το πάνελ των αγορών
// παραμένει ενεργό και ο τζογαδόρος μπορεί να αλλάξει την αγορά του ή το καθεστώς
// των άσων.

Trapezi.efoplismosAlagiPanelEpilogiAgoras = function(trapezi, agoraButton) {
	var agora, dialogosDOM = Arena.partida.dialogosDOM, panelDom = Arena.partida.agoraPanelDOM;

	// Κρατάμε στο tag "dialogos" στο πάνελ των αγορών το πλήκτρο με το οποίο
	// επιλέξαμε την αγορά.

	panelDom.data('dialogos', agoraButton);

	// Αποσπούμε την αγορά του πλήκτρου που πατήθηκε και προχωρούμε στην κατασκευή
	// του παραθύρου διαλόγου επιβεβαίωσης της αγοράς.

	agora = new Dilosi(agoraButton.data('dilosi'));
	dialogosDOM.empty().addClass('tsoxaAgoraDialogos');
	if (agora.dilosiIsSolo()) {
		dialogosDOM.append($('<div>').text('Προτίθεστε να μπείτε σόλο'));
	}
	else {
		if (panelDom.data('asoi')) agora.dilosiAsoiSet();
		dialogosDOM.append($('<div>').text('Προτίθεστε να αγοράσετε'));
	}

	dialogosDOM.
	append($('<div>').attr('id', 'tsoxaAgoraDialogosAgora').append(agora.dilosiDOM())).
	append($('<div>').
	append($('<div>').addClass('dialogosButton').text('ΝΑΙ').
	on('click', function(e) {
		Arena.inputRefocus(e);
		if (Arena.partida.akirosiKiniseon()) return;
		Trapezi.efoplismosAlagiEpiveveosiNai(trapezi, agora);
	})).
	append($('<div>').addClass('dialogosButton').text('ΟΧΙ').
	on('click', function(e) {
		Arena.inputRefocus(e);
		if (Arena.partida.akirosiKiniseon()) return;
		Trapezi.efoplismosAlagiEpiveveosiOxi();
	})));

	if (agora.dilosiIsSolo()) dialogosDOM.addClass('dialogosWarning');
	else dialogosDOM.removeClass('dialogosWarning');
	dialogosDOM.css('display', 'block');
};

// Η function "efoplismosAlagiEpiveveosiNai" καλείται κατά το κλικ στο πλήκτρο "ΝΑΙ"
// της τελικής επιβεβαίωσης της αγοράς από το παράθυρο επιβεβαίωσης αγοράς.

Trapezi.efoplismosAlagiEpiveveosiNai = function(trapezi, agora) {
	var panelDom = Arena.partida.agoraPanelDOM, params, skartaCount;

	if (panelDom.data('agoraExelixi')) return;
	panelDom.data('agoraExelixi', true);

	if (panelDom.data('asoi')) agora.dilosiAsoiSet();
	else agora.dilosiAsoiSet(false);

	params = 'tzogadoros=' + trapezi.partidaTzogadorosGet()+ '&agora=' + agora.dilosi2string();
	if (agora.dilosiOxiSolo()) {
		params += '&skarta=';
		skartaCount = 0;
		$('.tsoxaXartosiaFilo').each(function() {
			var filo;

			if (!$(this).data('skarto')) return;

			filo = $(this).data('filo');
			if (!filo) return;

			skartaCount++;
			params += filo.filo2string();
		});

		if (skartaCount !== 2) {
			Client.fyi.epano('Κάτι δεν πήγε καλά με την αγορά');
			return;
		}
	}

	panelDom.css('display', 'none');
	Arena.partida.dialogosDOM.css('display', 'none');

	Client.skiserService('agora', params).
	fail(function(err) {
		Client.skiserFail(err);
		panelDom.css('display', 'block').removeData('agoraExelixi');
		Arena.partida.dialogosDOM.css('display', 'block');
	});
};

// Η function "efoplismosAlagiEpiveveosiOxi" καλείται όταν ο τζογαδόρος ακυρώσει την
// αγορά κάνοντας κλικ στο πλήκτρο "ΟΧΙ" του παραθύρου επιβεβαίωσης της αγοράς.

Trapezi.efoplismosAlagiEpiveveosiOxi = function() {
	Arena.partida.dialogosDOM.css('display', 'none');
	Arena.partida.agoraPanelDOM.removeData('dialogos');
};

// Η function "efoplismosAlagiXartosia" αρματώνει τα φύλλα του τζογαδόρου με διαδικασίες
// που αφορούν στην επιλογή των φύλλων προς αλλαγή (σκάρτα). Όσο ο τζογαδόρος έχει
// επιλεγμένα ακριβώς δύο φύλλα προς αλλαγή, εμφανίζεται το πάνελ των αγορών, αλλιώς
// το πάνελ παραμένει κρυφό.

Trapezi.efoplismosAlagiXartosia = function(trapezi) {
	var tzogadoros, iseht, panelDom = Arena.partida.agoraPanelDOM, panoCount = 0;

	tzogadoros = trapezi.partidaTzogadorosGet();
	$('.tsoxaXartosiaFilo').removeData('skarto');
/*
	trapezi.fila[tzogadoros].xartosiaWalk(function(i, filo) {
		delete filo.skarto;
	});
*/

	iseht = Arena.ego.thesiMap(tzogadoros);
	if (iseht == 1) {
		pano = '36px';
		kato = '20px';
	}
	else {
		pano = '8px';
		kato = '20px';
	}

	Arena.partida['fila' + iseht + 'DOM'].
	find('.tsoxaXartosiaFilo').css('cursor', 'pointer').
	off('mouseenter').on('mouseenter', function(e) {
		var filoDom = $(this);
		e.stopPropagation();
		if (panelDom.data('dialogos')) return;

		filoDom.addClass('tsoxaFiloEpilogi');
		if (filoDom.data('skarto')) return;
		filoDom.finish().animate({bottom: pano}, 'fast');
	}).
	off('mouseleave').on('mouseleave', function(e) {
		var filoDom = $(this);
		e.stopPropagation();
		if (panelDom.data('dialogos')) return;

		filoDom.removeClass('tsoxaFiloEpilogi');
		if (filoDom.data('skarto')) return;
		if (filoDom.data('kato')) filoDom.removeData('kato');
		else filoDom.finish().animate({bottom: kato}, 'fast');
	}).
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	off('click').on('click', function(e) {
		var filoDom = $(this);

		Arena.inputRefocus(e);
		if (Arena.partida.akirosiKiniseon()) return;
		if (panelDom.data('dialogos')) return;

		if (filoDom.data('skarto')) {
			filoDom.removeData('skarto');
			filoDom.css('bottom', kato).data('kato', true);
			panoCount--;
		}
		else {
			if (filoDom.data('kato')) filoDom.css('bottom', pano);
			filoDom.data('skarto', true);
			panoCount++;
		}

		if (panoCount === 2) {
			Arena.partida.enimerosiDOM.css('display', 'none');
			panelDom.find('.tsoxaAgoraGrami').css('display', 'inline-block');
		}
		else {
			panelDom.find('.tsoxaAgoraGrami').css('display', 'none');
			Arena.partida.enimerosiDOM.css('display', 'block');
		}
	});

	return Trapezi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.efoplismosΣΥΜΜΕΤΟΧΗ = function() {
	var basi, pektis, simpektis, silosi, klikDilosi = false;

	pektis = this.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck') && (Kafenio.egoThesiGet() !== pektis)) return this;

	simpektis = pektis.epomeniThesi();
	if (simpektis == this.partidaTzogadorosGet()) simpektis = simpektis.epomeniThesi();

	dilosi = this.sdilosi;

	Arena.partida.dilosiPanelDOM.empty().
	append(basi = $('<div>').attr('id', 'tsoxaDilosiPanelBasi'));

	if (!dilosi[simpektis]) basi.
	append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΠΑΙΖΩ')).
	append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΠΑΣΟ'));

	else if (dilosi[simpektis].simetoxiIsPaso()) {
		if (dilosi[pektis]) basi.
		append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΜΟΝΟΣ')).
		append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΜΑΖΙ'));

		else basi.
		append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΠΑΙΖΩ')).
		append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΜΑΖΙ')).
		append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΠΑΣΟ'));
	}

	else if (dilosi[pektis]) basi.
	append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΜΑΖΙ')).
	append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΠΑΣΟ'));

	else basi.
	append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΠΑΙΖΩ')).
	append($('<div>').addClass('tsoxaButton').data('dilosi', 'ΠΑΣΟ'));

	basi.find('.tsoxaButton').each(function() {
		$(this).append($(this).data('dilosi'));
	});

	Arena.partida.xipnitiriOplismos();
	Arena.partida.dilosiPanelDOM.find('.tsoxaButton').addClass('tsoxaDilosiButton').
	off('mouseenter').on('mouseenter', function(e) {
		e.stopPropagation();
		if (klikDilosi) return;

		$(this).addClass('tsoxaButtonOplismeno');
	}).
	off('mouseleave').on('mouseleave', function(e) {
		e.stopPropagation();
		if (klikDilosi) return;

		$(this).removeClass('tsoxaButtonOplismeno');
	}).
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	off('click').on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.partida.xipnitiriAfoplismos();
		if (Arena.partida.akirosiKiniseon()) return;
		if (klikDilosi) return;

		klikDilosi = true;
		Arena.partida.enimerosiDOM.css('display', 'none');
		Client.skiserService('simetoxi',
			'thesi=' + pektis,
			'dilosi=' + $(this).data('dilosi')).
		fail(function(err) {
			Client.skiserFail(err);
			Arena.partida.enimerosiDOM.css('display', 'block');
			klikDilosi = false;
		});
	});

	Arena.partida.dilosiPanelDOM.css('display', 'block');
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.efoplismosΠΑΙΧΝΙΔΙ = function() {
	var trapezi = this, pektis, iseht, over, pano, kato;

	Arena.cpanel.claimButtonDOM.data('akiro', true).css('opacity', 0.3);
	pektis = this.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck') && (Kafenio.egoThesiGet() !== pektis)) return this;

	this.efoplismosPexnidiClaim(pektis);

	iseht = Arena.ego.thesiMap(pektis);
	if (iseht === 1) {
		over = '30px';
		pano = '+=10px';
		kato = '-=10px';
	}
	else {
		over = '12px';
		pano = '-=8px';
		kato = '+=8px';
	}
	if (this.partidaBazaCountGet() > 8) over = null;

	Arena.partida.xipnitiriOplismos();
	this.efoplismosPexnidiFila(iseht, over).each(function() {
		var filoDom, delay = 100;

		filoDom = $(this);
		if (!filoDom.data('ok')) return;

		filoDom.
		off('mouseenter').on('mouseenter', function(e) {
			e.stopPropagation();
			e.preventDefault();
			if (Arena.partida.klikFilo) return;

			filoDom.finish().css('cursor', 'pointer');
			if (trapezi.partidaBazaCountGet() > 8) return;
			filoDom.animate({bottom: pano}, delay);
		}).
		off('mouseleave').on('mouseleave', function(e) {
			e.stopPropagation();
			e.preventDefault();
			if (Arena.partida.klikFilo) return;

			filoDom.finish().css('cursor', 'auto');
			if (trapezi.partidaBazaCountGet() > 8) return;
			filoDom.animate({bottom: filoDom.data('bottom')}, delay);
		}).
		off('click').on('click', function(e) {
			var olif, filo = $(this);

			Arena.inputRefocus(e);
			Arena.partida.xipnitiriAfoplismos();
			if (Arena.partida.akirosiKiniseon()) return;
			if (Arena.partida.klikFilo) return;

			// Κάνοντας κλικ το φύλλο μαρκάρω με 1, εκκινώ κίνηση φύλλου και
			// κοινοποιώ το κλικ στον σέρβερ.

			Arena.partida.klikFilo = 1;
			Arena.partida.kinisiFilo(pektis, filoDom, function() {
				// Η κίνηση του φύλλο προς το κέντρο έχει περατωθεί.

				// Αν έχω παραμείνει σε κατάσταση 1 σημαίνει ότι δεν έχει παραληφθεί
				// ακόμη η κοινοποίηση της ενέργειας από τον σέρβερ, οπότε μαρκάρω 2
				// που σημαίνει ακριβώς αυτό.

				if (Arena.partida.klikFilo == 1) {
					Arena.partida.klikFilo = 2;
					return;
				}

				// Αλλιώς σημαίνει ότι η ενέργεια έχει ήδη ληφθεί από τον σέρβερ και
				// αφού καθαρίσω την κατάσταση εμφανίζω την τρέχουσα κατάσταση και
				// στέλνω την μπάζα εκεί που ανήκει, εφόσον έχει κλείσει μπάζα.

				if (Arena.partida.klikFilo == 3) {
					//delete Arena.partida.klikFilo;
					Arena.partida.trapeziRefreshDOM();
					Arena.partida.kinisiBaza();
				}
			});

			Client.skiserService('peximo',
				'pektis=' + pektis,
				'filo=' + filo.data('filo').filo2string()).
			fail(function(err) {
				Client.skiserFail(err);
				delete Arena.partida.klikFilo;
			});
		});
	});

	return this;
};

Trapezi.prototype.efoplismosPexnidiClaim = function(pektis) {
	if (pektis != this.partidaTzogadorosGet()) return this;
	if (this.bazaCount > 8) return this;
	if (this.bazaFila.length > 0) return this;

	Arena.cpanel.claimButtonDOM.removeData('akiro').css('opacity', '');
	return this;
};

Trapezi.prototype.efoplismosPexnidiFila = function(iseht, over) {
	var fila, bottom, xroma, found, agora, delay = 100;

	bottom = (iseht == 1 ? '+20px' : 'auto');
	fila = Arena.partida['fila' + iseht + 'DOM'].find('.tsoxaXartosiaFilo').
	// Ο επόμενος mouse event listener κρίθηκε απαραίτητος στην περίπτωση
	// χειραφετημένηυς τσόχας όπου δεν θέλουμε να κινείται η τσόχα όταν
	// σέρνουμε λάθος φύλλο.
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	removeData('ok').
	data('bottom', bottom);
	xroma = this.partidaBazaXromaGet();
	if (!xroma) return fila.data('ok', true);

	found = false;
	fila.each(function() {
		var filo, filoDom;

		filoDom = $(this);

		filo = $(this).data('filo');
		if (!filo) return;
		if (filo.filoXromaGet() != xroma) return;

		filoDom.data('ok', true);
		if (over) filoDom.data('bottom', over).finish().animate({bottom: over}, delay);
		found = true;
	});
	if (found) return fila;

	agora = this.partidaAgoraGet();
	if (!agora) return fila.data('ok', true);

	xroma = agora.dilosiXromaGet();
	found = false;
	fila.each(function() {
		var filo, filoDom;

		filo = $(this).data('filo');
		if (!filo) return;
		if (filo.filoXromaGet() != xroma) return;

		filoDom = $(this);
		filoDom.data('ok', true);
		if (over) filoDom.data('bottom', over).finish().animate({bottom: over}, delay);
		found = true;
	});
	if (found) return fila;

	return fila.data('ok', true);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.efoplismosCLAIM = function() {
	var thesi, basi, klikApantisi;

	thesi = this.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck') && (Kafenio.egoThesiGet() !== thesi)) return this;

	Arena.partida.dilosiPanelDOM.empty().
	append(basi = $('<div>').attr('id', 'tsoxaDilosiPanelBasi'));

	basi.
	append($('<div>').addClass('tsoxaButton').data('apodoxi', 'ΝΑΙ').text('ΝΑΙ')).
	append($('<div>').addClass('tsoxaButton').data('apodoxi', 'ΟΧΙ').text('ΟΧΙ'));

	Arena.partida.xipnitiriOplismos();
	Arena.partida.dilosiPanelDOM.find('.tsoxaButton').addClass('tsoxaDilosiButton').
	off('mouseenter').on('mouseenter', function(e) {
		e.stopPropagation();
		$(this).addClass('tsoxaButtonOplismeno');
	}).
	off('mouseleave').on('mouseleave', function(e) {
		e.stopPropagation();
		$(this).removeClass('tsoxaButtonOplismeno');
	}).
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	off('click').on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.partida.xipnitiriAfoplismos();
		if (Arena.partida.akirosiKiniseon()) return;
		if (klikApantisi) return;

		klikApantisi = true;
		Arena.partida.enimerosiDOM.css('display', 'none');
		Client.skiserService('claimApantisi',
			'thesi=' + thesi,
			'apodoxi=' + $(this).data('apodoxi')).
		fail(function(err) {
			Client.skiserFail(err);
			Arena.partida.enimerosiDOM.css('display', 'block');
			klikApantisi = false;
		});
	});

	Arena.partida.dilosiPanelDOM.css('display', 'block');
	return this;
};
