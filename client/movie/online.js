Movie.duration = {
	tzogos: 400,
	filo: 400,
	baza: 400,
	bazaDelay: 1000,
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

Movie.pexeFilo = function(energia, fasi) {
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
		Movie.baza = new filajsHand();
		Movie.baza.domCreate().baselineSet('M').alignmentSet('C');
		Movie.baza.domGet().appendTo(Movie.tsoxaDOM);
	}

	iseht = Movie.thesiMap(pektis);
	Movie.baza.
	circlePush($('#filajsCircle3' + iseht));

	fila.cardAnimate(i, Movie.baza, {
		duration: Movie.duration.filo,
		callback: function() {
			var baza;

			Movie.
			displayFila().
			displayBaza();

			if (Movie.trapezi.bazaPios.length)
			return;

			baza = Movie.baza;
			setTimeout(function() {
				Movie.pareBaza(baza, Movie.trapezi.partidaBazaPios(true));
			}, Movie.duration.bazaDelay);
		},
	});
};

Movie.pareBaza = function(baza, pektis) {
	var iseht, bazesDOM, dom, bazaPektis, count;

	iseht = Movie.thesiMap(pektis);
	bazesDOM = Movie.bazesDOM[iseht];

	bazaPektis = new filajsHand().
	circleSet($('#filajsCircle11')).
	alignmentSet(iseht === 2 ? 'L' : 'R').
	domCreate();

	bazaPektis.
	domGet().
	appendTo(bazesDOM);

	dom = baza.domGet();
	count = baza.cardsCount();
	baza.
	cardWalk(function(i) {
		this.
		domGet().
		css('backgroundColor', 'rgb(245, 70, 70)').
		children().
		remove();

		baza.
		cardAnimate(i, bazaPektis, {
			duration: Movie.duration.baza,
			width: 14,
			callback: function() {
				count--;
				if (count > 0)
				return;

				dom.remove();
				Movie.displayPartida();
			},
		});
	});
};
