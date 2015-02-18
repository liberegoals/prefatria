Movie.displayPartida = function() {
	$('.filajsHand').remove();
	Movie.
	displayEpomenos().
	displayAgora().
	displayFila().
	displayBazes().
	displayTzogos().
	displayBaza();
};

Movie.displayAgora = function(thesi) {
	var iseht, dilosi, paso, simetoxi;

	if (thesi === undefined)
	return Movie.thesiWalk(function(thesi) {
		Movie.displayAgora(thesi);
	});

	iseht = Movie.thesiMap(thesi);

	Movie.agoraDOM[iseht].
	removeClass().
	addClass('agora').
	empty();

	Movie.dilosiDOM[iseht].
	removeClass().
	addClass('dilosi').
	empty();

	if (thesi == Movie.trapezi.partidaTzogadorosGet()) {
		if (Movie.trapezi.partidaIsAgora()) {
			dilosi = Movie.trapezi.partidaAgoraGet();
			Movie.agoraDOM[iseht].
			addClass('movieDilosiAgora');
		}
		else {
			dilosi = Movie.trapezi.adilosi[thesi];
			Movie.agoraDOM[iseht].
			addClass('movieDilosiTzogadoros');
		}
	}
	else {
		dilosi = Movie.trapezi.adilosi[thesi];
	}

	if (dilosi) {
		Movie.agoraDOM[iseht].
		addClass('movieDilosiOxiPaso').
		append(dilosi.dilosiDOM());
		if (dilosi.dilosiIsTagrafo())
		Movie.agoraDOM[iseht].
		addClass('movieDilosiTaGrafo');
	}

	paso = Movie.trapezi.apaso[thesi];
	if (paso) {
		if (Movie.agoraDOM[iseht].text())
		Movie.agoraDOM[iseht].
		addClass('movieDilosiPaso');

		Movie.dilosiDOM[iseht].
		addClass('movieDilosiPaso').
		text('ΠΑΣΟ');
	}

	simetoxi = Movie.trapezi.sdilosi[thesi];
	if (simetoxi) {
		Movie.dilosiDOM[iseht].removeClass('movieDilosiPaso');
		if (simetoxi.simetoxiIsPaso())
		Movie.dilosiDOM[iseht].addClass('tsoxaPektisSimetoxiPaso').text('ΠΑΣΟ');
		else if (simetoxi.simetoxiIsPezo())
		Movie.dilosiDOM[iseht].addClass('tsoxaPektisSimetoxiPezo').text('ΠΑΙΖΩ');
		else if (simetoxi.simetoxiIsMazi())
		Movie.dilosiDOM[iseht].addClass('tsoxaPektisSimetoxiMazi').text('ΜΑΖΙ');
		else if (simetoxi.simetoxiIsVoithao())
		Movie.dilosiDOM[iseht].addClass('tsoxaPektisSimetoxiPezo').text('ΒΟΗΘΑΩ');
		else if (simetoxi.simetoxiIsMonos())
		Movie.dilosiDOM[iseht].addClass('tsoxaPektisSimetoxiMonos').text('ΜΟΝΟΣ');
	}

	switch (Movie.trapezi.partidaFasiGet()) {
	case 'ΠΑΙΧΝΙΔΙ':
	case 'ΠΛΗΡΩΜΗ':
		if (Movie.trapezi.bazaCount > 0)
		Movie.dilosiDOM[iseht].
		addClass('movieDilosiAorati');
		break;
	}

	return Movie;
};

Movie.displayFila = function(thesi) {
	var iseht, fila, anikta;

	if (thesi === undefined)
	return Movie.thesiWalk(function(thesi) {
		Movie.displayFila(thesi);
	});

	iseht = Movie.thesiMap(thesi);
	Movie.filaDOM[iseht].empty();
	anikta = (iseht === 1) || Movie.oxiKlista23();

	fila = new filajsHand(Movie.trapezi.fila[thesi].xartosia2string());

	if (anikta)
	fila.sort();

	else
	fila.shuffle();

	fila.
	baselineSet(iseht === 1 ? 'T' : 'B').
	alignmentSet('C').
	domCreate();

	if (fila.cardsCount() > 10)
	fila.shiftxSet(0.23);

	Movie.filaDOM[iseht].
	append(fila.domGet());

	fila.
	cardWalk(function() {
		this.
		faceSet(anikta).
		domCreate().
		domRefresh();
	}).
	domRefresh();

	Movie.fila[thesi] = fila;
	return Movie;
};

Movie.displayBazes = function(thesi) {
	var iseht, count, i;

	if (thesi === undefined)
	return Movie.thesiWalk(function(thesi) {
		Movie.displayBazes(thesi);
	});

	iseht = Movie.thesiMap(thesi);
	Movie.bazesDOM[iseht].empty();

	count = Movie.trapezi.bazes[thesi];
	if (!count)
	return Movie;

	while (count-- > 0)
	Movie.bazesDOM[iseht].
	append($('<div>').addClass('bazaPektis bazaKlisti bazaXroma' + (parseInt(count / 3) % 2)));

	return Movie;
};

Movie.displayTzogos = function() {
	$('#movieTzogos').
	remove();

	switch (Movie.trapezi.partidaFasiGet()) {
	case 'ΔΙΑΝΟΜΗ':
	case 'ΔΗΛΩΣΗ':
		break;
	default:
		return Movie;
	}

	Movie.tzogos = new filajsHand(Movie.trapezi.tzogos.xartosia2string());

	Movie.tzogos.
	cardWalk(function() {
		this.
		faceSet(Movie.tzogosFaneros).
		domCreate().
		domRefresh();
	}).
	sort().
	baselineSet('M').
	alignmentSet('C').
	archSet(2).
	domCreate();

	Movie.tsoxaDOM.
	append(Movie.tzogos.domGet().
	attr('id', 'movieTzogos').
	on('click', function(e) {
		Movie.tzogosFaneros = !Movie.tzogosFaneros;

		Movie.tzogos.
		cardWalk(function() {
			this.
			faceSet(Movie.tzogosFaneros).
			domRefresh();
		});
		Movie.panel.bpanelButtonGet('tzogosAniktos').pbuttonDisplay();
		Movie.panel.bpanelButtonGet('tzogosKlistos').pbuttonDisplay();
	}));
	Movie.tzogos.domRefresh();

	return Movie;
};

Movie.displayBaza = function() {
	var i, iseht, pios, fila;

	if (Movie.baza)
	Movie.baza.
	domGet().
	remove();

	Movie.baza = new filajsHand();
	Movie.baza.domCreate().baselineSet('M').alignmentSet('C');
	Movie.baza.domGet().appendTo(Movie.tsoxaDOM);

	if (Movie.bazaEkremis) {
		pios = Movie.trapezi.azabPios;
		fila = Movie.trapezi.azabFila;
	}
	else {
		pios = Movie.trapezi.bazaPios;
		fila = Movie.trapezi.bazaFila;
	}

	for (i = 0; i < pios.length; i++) {
		iseht = Movie.thesiMap(pios[i]);
		Movie.baza.
		cardPush(new filajsCard(fila[i].filo2string()).domCreate().domRefresh()).
		circlePush($('#filajsCircle3' + iseht));
	}

	Movie.baza.domRefresh();

	return Movie;
};
