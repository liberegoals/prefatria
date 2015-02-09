Movie.partidaDisplay = function() {
	Prefadoros.thesiWalk(function(thesi) {
		Movie.filaDisplay(thesi);
	});
};

Movie.filaDisplay = function(thesi) {
	var iseht, fila, dom;

	if (thesi === undefined) {
		Prefadoros.thesiWalk(function(thesi) {
			Movie.filaDisplay(thesi);
		});

		return Movie;
	}

	iseht = Movie.thesiMap(thesi);

	if (Movie.filaDOM[thesi])
	Movie.filaDOM[thesi].remove();

	fila = new filajsHand(Movie.trapezi.fila[thesi].xartosia2string());
	fila.
	sort().
	baselineSet(iseht === 1 ? 'T' : 'B', 4).
	alignmentSet('C').
	domCreate();

	if (fila.cardsCount() > 10)
	fila.shiftxSet(0.24);

	dom = fila.domGet();
	Movie.pektisDOM[thesi].append(dom);
	Movie.filaDOM[thesi] = dom;
	fila.
	cardWalk(function() {
		this.
		domCreate().
		domRefresh();
	}).
	domRefresh();

	return Movie;
};

Movie.tzogosDisplay = function() {
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
	circlePush(Movie.tzogosL).
	rotationPush(-10).
	circlePush(Movie.tzogosR).
	rotationPush(10).
	domCreate();

	$('#movieTzogos').remove();

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
