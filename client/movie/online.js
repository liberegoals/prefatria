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
			sort: true,
			callback: function() {
				if (++count === 2)
				Movie.panel.
				energiaNextButton.pbuttonGetDOM().trigger('click');
			},
		});
	});
};

Movie.pexeFilo = function() {
};
