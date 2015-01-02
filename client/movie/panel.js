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
		Movie.dianomiIndex++;

		if (Movie.dianomiIndex >= Movie.trapezi.dianomiArray.length)
		Movie.dianomiIndex--;

		else
		Movie.displayDianomi();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	omada: 1,
	img: '../ikona/movie/rew.png',
	title: 'Προηγούμενη διανομή',
	click: function(e) {
		Movie.dianomiIndex--;

		if (Movie.dianomiIndex < -1)
		Movie.dianomiIndex = -1;

		else
		Movie.displayDianomi();
	},
}));
