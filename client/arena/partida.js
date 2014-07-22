Arena.partida = {};

Arena.partida.flags = {
	// Η flag "amolimeni" δείχνει αν το DOM element της παρτίδας είναι
	// χειραφετημένο ή αγκυρωμένο σε σταθερή θέση. Πρόκειται για ακέραιο
	// που παίρνει τις παρακάτω τιμές:
	//
	//	0	Σταθερό, συμμορφωμένο με το γενικότερο πλαίσιο.
	//
	//	1	Χειραφετημένο, συρόμενο.
	//
	//	2	Χειραφετημένο, σταθεροποιημένο.
	//
	// Η τιμή της flag αλλάζει με πλήκτρα από το control panel.

	amolimeni: 0,

	// Η flag "niofertosView" δείχνει αν θα εμφανίζονται οι νεοφερμένοι στην
	// παρτίδα του χρήστη. Πρόκειται για στενή λωρίδα πάνω από την τσόχα στην
	// οποία εμφανίζονται οι νεοφερμένοι, δηλαδή οι παίκτες που εισέρχονται
	// στο καφενείο. Η αλλαγή της τιμής της flag γίνεται με πλήκτρο στο πάνελ
	// προσκλήσεων.

	niofertosView: true,

	// Η flag "fanera23" δείχνει αν τα φύλλα Ανατολής και Δύσης είναι ανοικτά.
	// Τα φύλλα Ανατολής και Δύσης μπορούν δεν μπορούν να είναι ανοικτά όταν
	// συμμετέχουμε ως παίκτες σε κάποια παρτίδα, αλλά οι θεατές έχουν αυτή
	// τη δυνατότητα. Η αλλαγή της τιμής της flag γίνεται με πλήκτρο (βατραχάκι)
	// στο control panel.

	fanera23: false,

	// Η flag "azab" δείχνει αν η προηγούμενη μπάζα που παίχτηκε είναι εμφανής
	// η κρυμμένη. Η αλλαγή της τιμής της flag γίνεται με κατάλληλο πλήκτρο στο
	// control panel.

	azab: false,
};

Arena.partida.niofertosView = function() {
	return Arena.partida.flags.niofertosView;
};

Arena.partida.isFanera23 = function() {
	return Arena.partida.flags.fanera23;
};

Arena.partida.oxiFanera23 = function() {
	return !Arena.partida.isFanera23();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.setup = function() {
	Arena.partida.niofertosDOM = $('<div>').attr({
		id: 'niofertos',
		title: 'Περιοχή νεοφερμένων',
	}).appendTo(Arena.partidaDOM);

	Arena.partida.tsoxaDOM = $('<div>').attr('id', 'tsoxa').appendTo(Arena.partidaDOM);

	Arena.partida.thesiWalk(function(thesi) {
		var pektisDOM, filaDOM;

		pektisDOM = Arena.partida['pektis' + thesi + 'DOM'] = $('<div>').attr('id', 'tsoxaPektis' + thesi).
		addClass('tsoxaPektis').appendTo(Arena.partida.tsoxaDOM);

		filaDOM = Arena.partida['fila' + thesi + 'DOM'] = $('<div>').attr('id', 'tsoxaFila' + thesi).
		addClass('tsoxaFila').appendTo(Arena.partida.tsoxaDOM);

		if (thesi === 1) return;

		pektisDOM.on('mouseleave', function(e) {
			e.stopPropagation();
			filaDOM.css('visibility', 'visible');
		});

		filaDOM.on('mouseenter', function(e) {
			e.stopPropagation();
			if (Debug.flagGet('striptiz')) return;
			filaDOM.css('visibility', 'hidden');
		});
	});

	Arena.partida.tsoxaDOM.
	append(Arena.partida.dataPanoDOM = $('<div>').attr('id', 'tsoxaDataPano').addClass('tsoxaData')).
	append(Arena.partida.dataKatoDOM = $('<div>').attr('id', 'tsoxaDataKato').addClass('tsoxaData')).
	append(Arena.partida.tzogosDOM = $('<div>').attr({
		id: 'tsoxaTzogos',
		title: 'Τζόγος',
	})).
	append(Arena.partida.azabDOM = $('<div>').addClass('tsoxaAzab').attr({
		title: 'Τελευταία μπάζα',
	})).
	append(Arena.partida.filaPrevDOM = $('<div>').attr({
		id: 'tsoxaFilaPrev',
		title: 'Προηγούμενη χαρτωσιά',
	})).
	append(Arena.partida.enimerosiDOM = $('<div>').attr('id', 'tsoxaEnimerosi')).
	append(Arena.partida.dilosiPanelDOM = $('<div>').attr('id', 'tsoxaDilosiPanel')).
	append(Arena.partida.agoraPanelDOM = $('<div>').attr('id', 'tsoxaAgoraPanel')).
	append(Arena.partida.dialogosDOM = $('<div>').attr('id', 'tsoxaDialogos').addClass('dialogos'));

	Arena.partida.theatisDOM = $('<div>').attr('id', 'theatis').appendTo(Arena.partida.tsoxaDOM);
	Arena.partida.optionsDOM = $('<div>').attr('id', 'tsoxaOptions').appendTo(Arena.partidaDOM);
	return Arena;
};

// Η function "refreshDOM" επαναδιαμορφώνει τα βασικά DOM elements της παρτίδας,
// ήτοι την τσόχα και τους θεατές. Αν επιθυμούμε επαναδιαμόρφωση και της συζήτησης
// της συγκεκριμένης παρτίδας, τότε περνάμε σχετική παράμετρο.

Arena.partida.refreshDOM = function(opts) {
	if (opts === undefined) opts = {};
	else if (opts === true) opts = {
		sizitisi: true,
	};

	Arena.partida.
	trapeziRefreshDOM().
	theatisRefreshDOM();

	if (opts.sizitisi)
	Arena.partida.sizitisiRefreshDOM();

	return Arena.partida;
};

Arena.partida.clearDOM = function() {
	Arena.partida.theatisDOM.children().detach();
	Arena.partida.tsoxaDOM.find('.tsoxaTelosIcon').remove();
	Arena.partida.dataPanoDOM.empty();
	Arena.partida.dataKatoDOM.empty();
	Arena.partida.tzogosDOM.empty();
	Arena.partida.azabDOM.empty();
	Arena.partida.filaPrevDOM.empty();
	Arena.partida.enimerosiClearDOM();
	Arena.partida.dilosiPanelDOM.empty();
	Arena.partida.agoraPanelDOM.empty();
	Arena.partida.dialogosDOM.empty();
	Arena.partida.pektisClearDOM().
	Arena.partida.filaClearDOM();
	Arena.sizitisi.trapeziDOM.empty();
	return Arena.partida;
};

Arena.partida.trapeziRefreshDOM = function() {
	$('#tsoxaSoloEndixi').remove();

	Arena.partida.
	peximoTheasiRefreshDOM().
	dataPanoRefreshDOM().
	dataKatoRefreshDOM().
	enimerosiRefreshDOM().
	pektisRefreshDOM().
	dixeKripseFila().
	filaRefreshDOM().
	tzogosRefreshDOM().
	bazaRefreshDOM().
	azabRefreshDOM().
	claimRefreshDOM().
	efoplismos();
	return Arena.partida;
};

Arena.partida.peximoTheasiRefreshDOM = function() {
	Arena.partida.tsoxaDOM.
	removeClass('tsoxaPeximo tsoxaTheasi');

	if (Arena.ego.isTheatis()) {
		Arena.partida.tsoxaDOM.addClass('tsoxaTheasi').
		children('#tsoxaPektis3,#tsoxaPektis2').
		attr('title', 'Κλικ για αλλαγή θέσης θέασης').
		css('cursor', 'crosshair');
	}
	else {
		Arena.partida.tsoxaDOM.
		addClass('tsoxaPeximo').
		children('.tsoxaPektis').
		attr('title', '').
		css('cursor', 'auto');
	}

	return Arena.partida;
};

// Η function "dixeKripseFila" εμφανίζει η αποκρύπτει τα φύλλα Ανατολής και Δύσης
// ανάλογα με την τιμή της σχετικής flag.

Arena.partida.dixeKripseFila = function() {
	var display;

	display = (Arena.partida.filaFanera23() ? 'block' : 'none');
	Arena.partida['fila3DOM'].css('display', display);
	Arena.partida['fila2DOM'].css('display', display);
	return Arena.partida;
};

Arena.partida.filaFanera23 = function() {
	if (Arena.partida.oxiFanera23()) return false;
	if (Debug.flagGet('striptiz')) return true;
	return Arena.ego.oxiPektis();
};

Arena.partida.theatisRefreshDOM = function() {
	Arena.partida.theatisDOM.children().detach();
	Arena.skiniko.skinikoSinedriaWalk(function() {
		if (this.sinedriaOxiTheatis()) return;
		if (this.sinedriaOxiTrapezi(Arena.ego.trapeziKodikos)) return;
		Arena.partida.theatisPushDOM(this);
	}, 1);
	return Arena.partida;
};

// Για λόγους που δεν γνωρίζω, η σκίαση των θεατών στην τσόχα «ακυρώνεται» δεξιά
// λόγω του scroll overflow. Για να το παρακάμψω χρησιμοποιώ φαρδύτερο κέλυφος.

Arena.partida.theatisPushDOM = function(sinedria) {
	Arena.partida.theatisDOM.prepend($('<div>').addClass('tsoxaTheatisKelifos').append(sinedria.tsoxaTheatisDOM));
	return Arena.partida;
}

Arena.partida.sizitisiRefreshDOM = function() {
	Arena.sizitisi.trapeziDOM.empty();
	if (Arena.ego.oxiTrapezi()) return Arena.partida;

	Arena.ego.trapezi.trapeziSizitisiWalk(function() {
		this.sizitisiCreateDOM();
	}, 1);

	if (Arena.sizitisi.oxiPagomeni())
	Arena.sizitisi.areaDOM.scrollKato();

	return Arena.partida;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.dataPanoClearDOM = function() {
	Arena.partida.ipolipoClearDOM();
	Arena.partida.dataPanoDOM.empty();
	Arena.partida.optionsDOM.empty();
	return Arena.partida;
};

Arena.partida.dataPanoRefreshDOM = function() {
	var dianomiDOM, ipolipoDOM;

	Arena.partida.dataPanoClearDOM();
	if (Arena.ego.oxiTrapezi()) return Arena.partida;

	Arena.partida.dataPanoDOM.
	append($('<div>').attr('id', 'tsoxaPartidaData').
	append($('<div>').attr('id', 'tsoxaKodikos').addClass('sinefo').
	attr('title', 'Κωδικός τραπεζιού').text(Arena.ego.trapezi.trapeziKodikosGet())).
	append(dianomiDOM = $('<div>').attr('id', 'tsoxaDianomi')).
	append(kasaDOM = $('<div>').attr('id', 'tsoxaKasa')).
	append(ipolipoDOM = $('<div>').attr('id', 'tsoxaIpolipo')));

	if (Arena.ego.trapezi.trapeziOxiAsoi())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/asoiOn.png',
		title: 'Δεν παίζονται οι άσοι',
	}));

	if (Arena.ego.trapezi.trapeziIsPaso())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/pasoOn.png',
		title: 'Παίζεται το πάσο',
	}));

	Arena.partida.
	dianomiRefreshDOM(dianomiDOM).
	kasaRefreshDOM(kasaDOM).
	ipolipoRefreshDOM(ipolipoDOM);
	return Arena.partida;
};

Arena.partida.dataKatoClearDOM = function() {
	Arena.partida.dataKatoDOM.empty();
	return Arena.partida;
};

Arena.partida.dataKatoRefreshDOM = function() {
	var akirosi;

	Arena.partida.dataKatoClearDOM();
	if (Arena.ego.oxiTrapezi()) return Arena.partida;

	Arena.partida.dataKatoDOM.
	append($('<div>').addClass('tsoxaPartidaInfo').
	append($('<div>').addClass('tsoxaPartidaInfoFasi').attr({
		title: 'Φάση παρτίδας',
	}).text(Arena.ego.trapezi.partidaFasiGet())));

	akirosi = Arena.ego.trapezi.trapeziAkirosiGet();
	if (!akirosi) return Arena.partida;

	Arena.partida.dataKatoDOM.append($('<div>').addClass('tsoxaPartidaInfoAkirosi').
		html('Ο παίκτης <div class="tsoxaPartidaInfoAkirosiLogin">' +
			akirosi + '</div> ακυρώνει κινήσεις&hellip;'));
	return Arena.partida;
};

Arena.partida.dianomiRefreshDOM = function(dom) {
	var dianomi;

	if (dom === undefined) dom = $('#tsoxaDianomi');

	dianomi = Arena.ego.trapezi.trapeziTelefteaDianomi();
	if (!dianomi) {
		dom.css('display', 'none');
		return Arena.partida;
	}

	dom.css('display', 'inline-block');
	dom.addClass('sinefo').attr('title', 'Κωδικός τρέχουσας διανομής').text(dianomi.dianomiKodikosGet());
	return Arena.partida;
};

Arena.partida.kasaRefreshDOM = function(dom) {
	var kasa;

	if (!Arena.ego.trapezi) return Arena.partida;

	if (dom === undefined) dom = $('#tsoxaKasa');

	kasa = Arena.ego.trapezi.trapeziKasaGet();
	if (!kasa) kasa = 0;
	else kasa *= 3;
	dom.addClass('sinefo').attr('title', 'Αρχική κάσα').text(kasa);
	return Arena.partida;
};

Arena.partida.ipolipoClearDOM = function() {
	Arena.partida.tsoxaDOM.find('.tsoxaTelosIcon').remove();
	return Arena.partida;
};

Arena.partida.ipolipoRefreshDOM = function(dom) {
	var ipolipo;

	Arena.partida.ipolipoClearDOM();
	if (!Arena.ego.trapezi) return Arena.partida;

	if (dom === undefined) dom = $('#tsoxaIpolipo');

	ipolipo = Arena.ego.trapezi.trapeziIpolipoGet();
	dom.addClass('sinefo').attr('title', 'Τρέχον υπόλοιπο κάσας').text(ipolipo / 10);
	if (ipolipo <= 0) {
		dom.addClass('tsoxaIpolipoMion');
		Arena.partida.tsoxaDOM.append($('<img>').addClass('tsoxaTelosIcon').attr({
			src: 'ikona/endixi/telos.png',
			title: 'Η κάσα έχει τελειώσει',
		}));
	}
	else {
		if (ipolipo < 300) dom.addClass('tsoxaIpolipoLigo');
		else dom.removeClass('tsoxaIpolipoLigo');
	}

	return Arena.partida;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.thesiWalk = function(callback) {
	Prefadoros.thesiWalk(callback);
	return Arena.partida;
};

Arena.partida.pektisClearDOM = function(thesi) {
	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.pektisClearDOM(thesi);
	});

	iseht = Arena.ego.thesiMap(thesi);
	Arena.partida['pektis' + iseht + 'DOM'].empty();
	return Arena.partida;
};

Arena.partida.pektisRefreshDOM = function(thesi) {
	var dom, domMain, domOnoma, domKapikia, domAgora, domDilosi, domBazes, iseht;

	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.pektisRefreshDOM(thesi);
	});

	Arena.partida.pektisClearDOM(thesi);
	iseht = Arena.ego.thesiMap(thesi);
	if (Arena.ego.oxiTrapezi()) return Arena.partida;

	dom = Arena.partida['pektis' + iseht + 'DOM'].
	append(domMain = $('<div>').attr('id', 'tsoxaPektisMain' + iseht).addClass('tsoxaPektisMain').
	append(domOnoma = $('<div>').addClass('tsoxaPektisOnoma')).
	append(domKapikia = $('<div>').addClass('tsoxaPektisKapikia')).
	append(domAgora = $('<div>').addClass('tsoxaPektisAgora'))).
	append(domDilosi = $('<div>').attr('id', 'tsoxaPektisDilosi' + iseht).addClass('tsoxaPektisDilosi')).
	append(domBazes = $('<div>').attr('id', 'tsoxaPektisBazes' + iseht).addClass('tsoxaPektisBazes'));
	if (Arena.ego.isTheatis()) domMain.addClass('tsoxaPektisMainTheasi');

	Arena.partida['pektisMain' + iseht + 'DOM'] = domMain;
	Arena.partida['pektisOnoma' + iseht + 'DOM'] = domOnoma;
	Arena.partida['pektisKapikia' + iseht + 'DOM'] = domKapikia;
	Arena.partida['pektisAgora' + iseht + 'DOM'] = domAgora;
	Arena.partida['pektisDilosi' + iseht + 'DOM'] = domDilosi;
	Arena.partida['pektisBazes' + iseht + 'DOM'] = domBazes;

	Arena.partida.
	pektisDataRefreshDOM(thesi, iseht, domMain, domOnoma).
	pektisKapikiaRefreshDOM(thesi, iseht, domKapikia).
	pektisAgoraRefreshDOM(thesi, iseht, domAgora).
	pektisDilosiRefreshDOM(thesi, iseht, domDilosi).
	pektisBazesRefreshDOM(thesi, iseht, domBazes).
	pektisAnamoniRefreshDOM(thesi, iseht, domMain);

	if (Arena.partida.isDealer(thesi)) domMain.append($('<img>').
	addClass('tsoxaPektisIcon').attr({
		src: 'ikona/endixi/dealer.png',
		title: 'Μοιράζει φύλλα',
	}));

	if (Arena.partida.isProtos(thesi)) domMain.append($('<img>').
	addClass('tsoxaPektisIcon').attr({
		src: 'ikona/endixi/protos.png',
		title: 'Πρώτος παίκτης μετά τον παίκτη που μοίρασε',
	}));

	if (Arena.ego.trapezi.partidaIsClaim(thesi)) domMain.append($('<img>').
	addClass('tsoxaPektisIcon tsoxaPektisIconClaim').attr({
		src: 'ikona/panel/claim.png',
		title: 'Παραιτήθηκε από τις υπόλοιπες μπάζες',
	}));

	if (Arena.partida.isEpomenos(thesi)) domMain.addClass('tsoxaEpomenos');

	switch (Arena.ego.trapezi.partidaFasiGet()) {
	case 'ΠΑΙΧΝΙΔΙ':
	case 'ΠΛΗΡΩΜΗ':
		if (Arena.ego.trapezi.sdilosi[thesi]) {
			if (Arena.ego.trapezi.sdilosi[thesi].simetoxiIsPaso())
			domMain.addClass('tsoxaPektisEktos');

			else if (Arena.ego.trapezi.sdilosi[thesi].simetoxiIsMazi())
			domMain.append($('<img>').
			addClass('tsoxaPektisIcon tsoxaPektisIconMazi').attr({
				src: Client.server + 'ikona/endixi/mazi.png',
				title: 'Πήρε τον συμπαίκτη να παίξουν μαζί',
			}));
		}
		break;
	}

	if (Arena.ego.trapezi.simetoxi[thesi] === 'ΠΑΣΟ') var x = 1;
	if (Arena.ego.isPektis()) return Arena.partida;

	// Αλλαγή θέσης θέασης

	dom.off('click').on('click', function(e) {
		Arena.inputRefocus(e);
		if (Arena.ego.thesiGet() === thesi) return;

		Client.fyi.pano('Αλλαγή θέσης θέασης. Παρακαλώ περιμένετε…');
		Client.skiserService('thesiTheasis', 'thesi=' + thesi).
		done(function(rsp) {
			Client.fyi.pano();
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	});

	return Arena.partida;
};

// Η function "pektisDataRefreshDOM" δέχεται ως παράμετρο τη θέση κάποιου παίκτη
// στο τραπέζι και ενημερώνει τα DOM elements που αφορούν στα στοιχεία και στην
// κατάσταση του παίκτη. Αν δεν καθορίσουμε θέση, τότε η function καλείται και
// για τους τρεις παίκτες του τραπεζιού.

Arena.partida.pektisDataRefreshDOM = function(thesi, iseht, domMain, domOnoma) {
	var login, sinedria;

	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.pektisDataRefreshDOM(thesi);
	});

	if (Arena.ego.oxiTrapezi()) return Arena.partida;
	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (domMain === undefined) domMain = Arena.partida['pektisMain' + iseht + 'DOM'];
	if (domOnoma === undefined) domOnoma = Arena.partida['pektisOnoma' + iseht + 'DOM'];

	domMain.removeClass('apodoxi xapodoxi offline fevgatos');
	domOnoma.removeClass('fantasma tsoxaSxesiFilos tsoxaSxesiApoklismenos');

	domMain.addClass(Arena.ego.trapezi.trapeziIsApodoxi(thesi) ? 'apodoxi' : 'xapodoxi');

	login = Arena.ego.trapezi.trapeziPektisGet(thesi);
	if (!login) {
		domMain.addClass('fevgatos');
		login = Arena.ego.trapezi.trapeziTelefteosGet(thesi);
		if (login) domOnoma.addClass('fantasma').html(login);
		return Arena.partida;
	}

	sinedria = Arena.skiniko.skinikoSinedriaGet(login);
	if (!sinedria) domMain.addClass('offline');

	domOnoma.html(login);
	if (Arena.ego.isFilos(login)) domOnoma.addClass('tsoxaSxesiFilos');
	else if (Arena.ego.isApoklismenos(login)) domOnoma.addClass('tsoxaSxesiApoklismenos');

	return Arena.partida;
};

Arena.partida.pektisKapikiaRefreshDOM = function(thesi, iseht, dom) {
	var kapikia, klasi;

	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.pektisKapikiaRefreshDOM(thesi);
	});

	if (Arena.ego.oxiTrapezi()) return Arena.partida;
	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (dom === undefined) dom = Arena.partida['pektisKapikia' + iseht + 'DOM'];

	kapikia = Arena.ego.trapezi.partidaKapikiaGet(thesi);
	if (!kapikia) {
		dom.empty();
		return Arena.partida;
	}

	klasi = 'tsoxaPektisKapikiaPoso';
	if (kapikia < 0) klasi += ' tsoxaPektisKapikiaPosoMion';
	dom.
	append('καπίκια').
	append($('<div>').addClass(klasi).text(Arena.ego.trapezi.partidaKapikiaGet(thesi)));
	return Arena.partida;
};

Arena.partida.pektisAgoraRefreshDOM = function(thesi, iseht, dom) {
	var dlist, agora, tzogadoros, dilosi;

	if (Arena.ego.oxiTrapezi()) return Arena.partida;
	dlist = Arena.ego.trapezi.adilosi;

	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (dom === undefined) dom = Arena.partida['pektisAgora' + iseht + 'DOM'];
	dom.empty().removeClass('tsoxaPektisAgoraTzogadoros tsoxaPektisAgoraTzogadorosCandi');

	// Αν δεν έχει γίνει δήλωση κατά τη φάση της αγοράς από τον συγκεκριμένο παίκτη
	// δεν πρέπει να εμφανίσουμε κάτι στην περιοχή της δήλωσης αγοράς.

	if (!dlist.hasOwnProperty(thesi)) return Arena.partida;

	// Θα ελέγξουμε τώρα αν έχει γίνει αγορά στο τραπέζι και αν ο συγκεκριμένος παίκτης
	// είναι ο τζογαδόρος. Σ' αυτή την περίπτωησ θα εμφανίσουμε την αγορά του.

	tzogadoros = Arena.ego.trapezi.partidaTzogadorosGet();
	agora = Arena.ego.trapezi.partidaAgoraGet();
	if (agora && (thesi === tzogadoros)) dilosi = agora;

	// Αλλιώς θα εμφανίσουμε την τελευταία δήλωση που είχε κάνει κατά τη φάση της
	// αγοράς.

	else dilosi = dlist[thesi];

	dom.append(dilosi.dilosiDOM().addClass('tsoxaPektisAgoraDilosi'));
	switch (Arena.ego.trapezi.partidaFasiGet()) {
	case 'ΔΗΛΩΣΗ':
		if (thesi != tzogadoros) return Arena.partida;
		dom.addClass('tsoxaPektisAgoraTzogadorosCandi');
		break;
	case 'ΑΛΛΑΓΗ':
		if (thesi != tzogadoros) return Arena.partida;
		dom.addClass('tsoxaPektisAgoraTzogadoros').
		append($('<img>').addClass('tsoxaPektisIcon').attr({
			id: 'tsoxaPektisAgoraTzogos',
			src: 'ikona/endixi/tzogos.png',
			title: 'Αλλαγή φύλλων',
		}));
		break;
	default:
		if (thesi == tzogadoros) dom.addClass('tsoxaPektisAgoraTzogadoros');
		else if (Arena.ego.trapezi.partidaBazaCountGet() > 0) dom.addClass('tsoxaPektisAgoraAminomenos');
		break;
	}

	return Arena.partida;
};

Arena.partida.pektisDilosiRefreshDOM = function(thesi, iseht, dom) {
	var trapezi = Arena.ego.trapezi, paso, dilosi;

	if (!trapezi) return Arena.partida;
	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (dom === undefined) dom = Arena.partida['pektisDilosi' + iseht + 'DOM'];
	dom.empty().removeClass('tsoxaPektisDilosiPaso tsoxaPektisDilosiAgora ' +
		'tsoxaPektisSimetoxiPaso tsoxaPektisSimetoxiPezo ' +
		'tsoxaPektisSimetoxiMazi tsoxaPektisSimetoxiMonos');

	switch (trapezi.partidaFasiGet()) {
	case 'ΔΗΛΩΣΗ':
		paso = trapezi.apaso;
		if (paso.hasOwnProperty(thesi)) {
			dom.addClass('tsoxaPektisDilosiPaso').text('ΠΑΣΟ');
			return Arena.partida;
		}

		if ((trapezi.tagrafo == thesi) && (trapezi.partidaTzogadorosGet() != thesi)) {
			dom.addClass('tsoxaPektisDilosiPaso').html('&mdash;');
			return Arena.partida;
		}

		if (thesi !== trapezi.partidaEpomenosGet()) return Arena.partida;
		if (!trapezi.anext) return Arena.partida;
		if (Arena.ego.isPektis() && (Arena.ego.thesiGet() == thesi)) return Arena.partida;

		dilosi = trapezi.anext;
		if (dilosi.dilosiIsTagrafo() && (trapezi.apasoCount == 2)) dilosi = new Dilosi('DS6');
		dom.append(dilosi.dilosiDOM()).addClass('tsoxaPektisDilosiAgora').
		attr({title: 'Σκέφτεται "' + dilosi.dilosiLektiko() + '"'});
		break;
	case 'ΣΥΜΜΕΤΟΧΗ':
	case 'ΠΑΙΧΝΙΔΙ':
		if (trapezi.partidaBazaCountGet() > 0) {
			dom.css('display', 'none');
			return Arena.partida;
		}

		if (thesi === trapezi.partidaTzogadorosGet()) return Arena.partida;

		dilosi = trapezi.sdilosi;
		if (!dilosi[thesi]) return Arena.partida;

		if (dilosi[thesi].simetoxiIsPaso()) dom.addClass('tsoxaPektisSimetoxiPaso').text('ΠΑΣΟ');
		else if (dilosi[thesi].simetoxiIsPezo()) dom.addClass('tsoxaPektisSimetoxiPezo').text('ΠΑΙΖΩ');
		else if (dilosi[thesi].simetoxiIsMazi()) dom.addClass('tsoxaPektisSimetoxiMazi').text('ΜΑΖΙ');
		else if (dilosi[thesi].simetoxiIsVoithao()) dom.addClass('tsoxaPektisSimetoxiPezo').text('ΒΟΗΘΑΩ');
		else if (dilosi[thesi].simetoxiIsMonos()) dom.addClass('tsoxaPektisSimetoxiMonos').text('ΜΟΝΟΣ');
		break;
	}

	return Arena.partida;
};

Arena.partida.pektisBazesRefreshDOM = function(thesi, iseht, dom) {
	var trapezi = Arena.ego.trapezi, bazes, plati;

	if (!trapezi) return Arena.partida;
	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (dom === undefined) dom = Arena.partida['pektisBazes' + iseht + 'DOM'];

	dom.empty();
	switch (trapezi.partidaFasiGet()) {
	case 'ΠΑΙΧΝΙΔΙ':
	case 'CLAIM':
	case 'ΠΛΗΡΩΜΗ':
		bazes = trapezi.partidaBazesGet(thesi);
		if (isNaN(bazes)) return Arena.partida;
		if (bazes < 1) return Arena.partida;

		dom.css('display', 'block');
		do {
			plati = (Math.floor((bazes - 1) / 3) % 2) ? Arena.ego.plati : Arena.ego.italp;
			dom.prepend($('<img>').addClass('tsoxaPektisBazesBaza').
			attr('src', 'ikona/trapoula/' + plati + 'L.png'));
		} while (--bazes > 0);
		break;
	}

	return Arena.partida;
};

Arena.partida.pektisAnamoniRefreshDOM = function(thesi, iseht, domMain) {
	var trapezi = Arena.ego.trapezi;

	if (!trapezi) return Arena.partida;
	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (domMain === undefined) domMain = Arena.partida['pektisMain' + iseht + 'DOM'];

	domMain.find('.tsoxaEndixiAnamoni').remove();
	switch (trapezi.partidaFasiGet()) {
	case 'ΔΙΑΝΟΜΗ':
		if (thesi != trapezi.partidaDealerGet()) return Arena.partida;
		domMain.append(endixi = $('<img>').addClass('tsoxaEndixiAnamoni').attr({
			src: 'ikona/working/default.gif',
			title: 'Ο παίκτης μοιράζει φύλλα',
		}));
		break;
	case 'ΔΗΛΩΣΗ':
		if (thesi != trapezi.partidaEpomenosGet()) return Arena.partida;
		domMain.append(endixi = $('<img>').addClass('tsoxaEndixiAnamoni').attr({
			src: Arena.partida.pektisAnamoniIkona(thesi),
			title: 'Σκέφτεται την επόμενη δήλωση αγοράς',
		}));
		break;
	case 'ΑΛΛΑΓΗ':
		if (thesi != trapezi.partidaEpomenosGet()) return Arena.partida;
		domMain.append(endixi = $('<img>').addClass('tsoxaEndixiAnamoni').attr({
			src: Arena.partida.pektisAnamoniIkona(thesi),
			title: 'Σκέφτεται αλλαγή και δήλωση αγοράς',
		}));
		break;
	case 'ΣΥΜΜΕΤΟΧΗ':
		if (thesi != trapezi.partidaEpomenosGet()) return Arena.partida;
		domMain.append(endixi = $('<img>').addClass('tsoxaEndixiAnamoni').attr({
			src: Arena.partida.pektisAnamoniIkona(thesi, 'endixi/erotimatiko.gif'),
			title: 'Σκέφτεται αν θα διεκδικήσει τις μπάζες του',
		}));
		break;
	case 'ΠΑΙΧΝΙΔΙ':
		if (thesi != trapezi.partidaEpomenosGet()) return Arena.partida;
		domMain.append(endixi = $('<img>').addClass('tsoxaEndixiAnamoni').attr({
			src: Arena.partida.pektisAnamoniIkona(thesi, 'endixi/balitsa.gif'),
			title: 'Σκέφτεται ποιο φύλλο θα παίξει',
		}));
		break;
	}

	return Arena.partida;
};

Arena.partida.pektisAnamoniIkona = function(thesi, img) {
	if (img === undefined) img = 'working/rologaki.gif';
	return 'ikona/' + ((Arena.ego.isPektis() && (thesi == Arena.ego.thesiGet())) ? 'endixi/rollStar.gif' : img);
};

Arena.partida.filaClearDOM = function(thesi) {
	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.filaClearDOM(thesi);
	});

	iseht = Arena.ego.thesiMap(thesi);
	$('.tsoxaXartosiaFilo' + iseht).remove();
	Arena.partida['fila' + iseht + 'DOM'].empty();
	return Arena.partida;
};

Arena.partida.filaRefreshDOM = function(thesi) {
	var fila, iseht, dom;

	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		$('.tsoxaBazaFiloProxiro').remove();
		delete Arena.partida.klikFilo;
		Arena.partida.filaRefreshDOM(thesi);
	});

	Arena.partida.filaClearDOM(thesi);
	if (Arena.ego.oxiTrapezi()) return Arena.partida;

	fila = Arena.ego.trapezi.partidaFilaGet(thesi);
	if (!fila) return Arena.partida;

	iseht = Arena.ego.thesiMap(thesi);
	dom = Arena.partida['fila' + iseht + 'DOM'];
	dom.append(fila.xartosiaTaxinomisi().xartosiaDOM(iseht));
	return Arena.partida;
};

Arena.partida.tzogosRefreshDOM = function() {
	var dom, fila;

	dom = Arena.partida.tzogosDOM.css('display', 'none').empty();
	if (Arena.ego.oxiTrapezi()) return Arena.partida;
	fila = Arena.ego.trapezi.partidaTzogosGet();
	if (!fila) return Arena.partida;

	fila = fila.xartosiaFilaGet();
	dom.
	append(fila[0].filoDOM().addClass('tsoxaTzogosFilo tsoxaTzogosFiloLeft')).
	append(fila[1].filoDOM().addClass('tsoxaTzogosFilo tsoxaTzogosFiloRight'));

	switch (Arena.ego.trapezi.partidaFasiGet()) {
	case 'ΔΙΑΝΟΜΗ':
	case 'ΔΗΛΩΣΗ':
		dom.css('display', 'block');
		break;
	}

	return Arena.partida;
};

// Η function "peristrofiDOM" καλείται κατά τη χειραφεσία της τσόχας, όπου
// η τσόχα ανεξαρτοποιείται και μπορεί να μετακινηθεί σε οποιοδήποτε μέρος
// της σελίδας. Σκοπός της function είνα, ακριβώς, να κάνει σαφές αυτό το
// γεγονός περιστεφοντας λίγες φορές την τσοχα δεξιά-αριστερά.

Arena.partida.peristrofiDOM = function(rotationCount) {
	var rotation;

	if (rotationCount === undefined) rotationCount = 1;

	if (rotationCount > 4) {
		Arena.partida.tsoxaDOM.css({
			'transform': '',
			'-ms-transform': '',
			'-webkit-transform': '',
		});
		return Arena.partida;
	}

	rotation = (rotationCount % 2 ? '2deg' : '-2deg');
	Arena.partida.tsoxaDOM.css({
		'transform': 'rotate(' + rotation + ')',
		'-ms-transform': 'rotate(' + rotation + ')',
		'-webkit-transform': 'rotate(' + rotation + ')',
	});
	setTimeout(function() {
		Arena.partida.peristrofiDOM(rotationCount + 1);
	}, 60);

	return Arena.partida;
};

Arena.partida.akirosiKiniseon = function() {
	if (Arena.ego.oxiTrapezi()) return false;
	return Arena.ego.trapezi.trapeziAkirosiGet();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.isDealer = function(thesi) {
	if (Arena.ego.oxiTrapezi()) return false;
	return(Arena.ego.trapezi.partidaDealerGet() === thesi);
};

Arena.partida.isProtos = function(thesi) {
	if (Arena.ego.oxiTrapezi()) return false;
	return(Arena.ego.trapezi.partidaProtosGet() === thesi);
};

Arena.partida.isEpomenos = function(thesi) {
	if (Arena.ego.oxiTrapezi()) return false;
	return(Arena.ego.trapezi.partidaEpomenosGet() === thesi);
};
