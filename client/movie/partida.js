Movie.displayPartida = function() {
	Movie.
	displayEpomenos().
	displayFila().
	displayBazes().
	displayTzogos().
	displayBaza();
};

Movie.displayFila = function(thesi) {
	var iseht, fila, anikta;

	if (thesi === undefined)
	return Movie.thesiWalk(function(thesi) {
		Movie.displayFila(thesi);
	});

	iseht = Movie.thesiMap(thesi);
	anikta = (iseht === 1) || Movie.oxiKlista23();

	if (Movie.filaDOM[iseht])
	Movie.filaDOM[iseht].empty();

	fila = new filajsHand(Movie.trapezi.fila[thesi].xartosia2string());
	fila.
	sort().
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
	append($('<div>').addClass('bazaPektis bazaPektis' + (parseInt(count / 3) % 2)));

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
	if (!Movie.baza)
	return Movie;

	Movie.baza.domRefresh();
	return Movie;
};
