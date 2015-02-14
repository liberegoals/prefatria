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
		Movie.pareBaza(pektis);
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
			Movie.
			displayFila().
			displayTzogos().
			displayBaza();
		},
	});
};

Movie.pareBaza = function(pektis) {
	var iseht, bazesDOM, dom, baza, count;

	if (Movie.trapezi.bazaCount < 1)
	return;

	iseht = Movie.thesiMap(pektis);
	bazesDOM = Movie.bazesDOM[iseht];

	baza = new filajsHand().
	circleSet($('#filajsCircle11')).
	alignmentSet(iseht === 2 ? 'L' : 'R').
	domCreate();

	baza.
	domGet().
	appendTo(bazesDOM);

	count = Movie.baza.cardsCount();
	Movie.baza.
	cardWalk(function(i) {
		this.domGet().animate({
			width: '14px',
			height: '20px',
		}, Movie.duration.baza, function() {
		count--;
			if (count <= 0)
			Movie.displayPartida();
		});
		Movie.baza.
		cardAnimate(i, baza, {
			duration: Movie.duration.baza,
			width: 14,
		});
	});
};
