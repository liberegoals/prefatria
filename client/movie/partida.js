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
	baselineSet('T').
	alignmentSet('C').
	domCreate();

	if (fila.cardsCount() > 10)
	fila.shiftxSet(0.24);

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

	return Movie;
};

Movie.tzogosDisplay = function() {
	$('#movieTzogos').
	remove();

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
