Movie.duration = {
	tzogos: 400,
	filo: 400,
	baza: 350,
};

Movie.pareTzogo = function() {
	var tzogadoros, count;

	tzogadoros = Movie.trapezi.partidaTzogadorosGet();

	count = 0;
	Movie.tzogos.
	cardWalk(function(i) {
		if (Movie.oxiKlista23())
		this.
		faceUp().
		domRefresh();

		Movie.tzogos.
		cardAnimate(i, Movie.fila[tzogadoros], {
			duration: Movie.duration.tzogos,
			sort: true,
			callback: function() {
				if (++count === 2)
				Movie.panel.
				energiaNextButton.pbuttonGetDOM().trigger('click');
			},
		});
	});
};

Movie.pexeFilo = function(energia) {
	var pektis, filo, fila, iseht;

	pektis = energia.energiaPektisGet();
	filo = energia.energiaDataGet();

	fila = Movie.fila[pektis];
	for (i = 0; i < fila.cardArray.length; i++) {
		if (fila.cardArray[i].toString() === filo)
		break;
	}

	if (i >= fila.cardArray.length)
	return;

	if (Movie.trapezi.bazaFila.length === 1) {
		Movie.pareBaza();
		Movie.baza = new filajsHand();
		Movie.baza.domCreate().baselineSet('M').alignmentSet('C');
		Movie.baza.domGet().attr('id', 'movieBaza').appendTo(Movie.tsoxaDOM);
	}

	iseht = Movie.thesiMap(pektis);
	Movie.baza.
	circlePush($('#filajsCircle3' + iseht));

	fila.cardAnimate(i, Movie.baza, {
		duration: Movie.duration.filo,
		callback: function() {
			Movie.displayPartida();
		},
	});
};

Movie.pareBaza = function() {
	$('#movieBaza').each(function() {
		$(this).
		removeAttr('id').
		animate({
			left: '+=200px',
		}, Movie.duration.baza).
		find('.filajsCard').
		animate({
			width: '8px',
			height: '12px',
		}, Movie.duration.filo);
	});
};
