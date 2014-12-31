Movie.panel = new BPanel();
Movie.panel.omadaMax = 1;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Movie.panel.bpanelButtonPush(new PButton({
	omada: 1,
	img: '../ikona/movie/play.png',
	title: 'Play',
	click: function(e) {
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	omada: 1,
	img: '../ikona/movie/fwd.png',
	title: 'Επόμενη διανομή',
	click: function(e) {
		var dianomi;

		Movie.dianomiIndex++;
		if (Movie.dianomiIndex >= Movie.trapezi.dianomiArray.length) {
			Movie.dianomiIndex--;
			return;
		}

		dianomi = Movie.trapezi.dianomiArray[Movie.dianomiIndex];
		Movie.trapezi.movieDisplayDianomi(dianomi);
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	omada: 1,
	img: '../ikona/movie/rew.png',
	title: 'Προηγούμενη διανομή',
	click: function(e) {
		var dianomi;

		Movie.dianomiIndex--;
		if (Movie.dianomiIndex < 0) {
			Movie.dianomiIndex = -1;
			$('.dianomiTrexousa').removeClass('dianomiTrexousa');
			return;
		}

		if (Movie.trapezi.dianomiArray.length <= 0)
		return;

		dianomi = Movie.trapezi.dianomiArray[Movie.dianomiIndex];
		Movie.trapezi.movieDisplayDianomi(dianomi);
	},
}));
