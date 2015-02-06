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
		if (Movie.dianomiIndex <= 0)
		return;

		Movie.dianomiIndex--;
		Movie.displayDianomi();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	omada: 1,
	img: '../ikona/movie/trapoula.png',
	title: 'Αλλαγή τράπουλας',
	click: function(e) {
		var family;

		switch (filajs.cardFamilyGet()) {
		case 'aguilar':
			filajs.cardFamilySet('classic');
			break;
		case 'classic':
			filajs.cardFamilySet('nicubunu');
			break;
		case 'nicubunu':
			filajs.cardFamilySet('ilias');
			break;
		case 'ilias':
			filajs.cardFamilySet('jfitz');
			break;
		default:
			filajs.cardFamilySet('aguilar');
			break;
		}

		Movie.displayDianomi();

		family = filajs.cardFamilyGet();
		$.ajax('../lib/session.php', {data:{trapoula:family}});

		if (Client.isPektis())
		Client.skiserService('peparamSet', 'param=ΤΡΑΠΟΥΛΑ', 'timi=' + family);
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	omada: 1,
	img: '../ikona/movie/tzogosAniktos.png',
	title: 'Τζόγος φανερός',
	check: function() {
		return !Movie.tzogosFaneros;
	},
	click: function(e) {
		Movie.tzogosFaneros = true;
		Movie.tzogos.
		cardWalk(function() {
			this.
			faceUp().
			domRefresh();
		});

		this.pbuttonPanelGet().bpanelRefresh();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	omada: 1,
	img: '../ikona/movie/tzogosKlistos.png',
	title: 'Τζόγος κρυφός',
	check: function() {
		return Movie.tzogosFaneros;
	},
	click: function(e) {
		Movie.tzogosFaneros = false;
		Movie.tzogos.
		cardWalk(function() {
			this.
			faceDown().
			domRefresh();
		});

		this.pbuttonPanelGet().bpanelRefresh();
	},
}));
